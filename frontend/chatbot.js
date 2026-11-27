
document.addEventListener("DOMContentLoaded", () => {

    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("chatSendButton");

    const clearChatButton = document.getElementById("clearChatButton");
    const newChatButton = document.getElementById("newChatButton");

    if (!chatForm || !chatInput || !chatMessages || !sendButton) {
        console.log("SAKHI chatbot interface not found.");
        return;
    }

    let chatHistory = [];

    const welcomeMessage = `
Hello! I'm SAKHI AI. 💜

How can I help you today?

You can ask me about travel safety, online harassment,
personal safety, or any concerns you have.
`;

    // Safely format basic Markdown.
    function formatMessage(text) {

        const container = document.createElement("div");
        const lines = String(text).split("\n");

        let currentList = null;
        let currentTable = null;

        function appendInlineText(element, value) {

            const parts = value.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

            parts.forEach(part => {

                if (part.startsWith("**") && part.endsWith("**")) {
                    const strong = document.createElement("strong");
                    strong.textContent = part.slice(2, -2);
                    element.appendChild(strong);

                } else if (part.startsWith("*") && part.endsWith("*")) {
                    const italic = document.createElement("em");
                    italic.textContent = part.slice(1, -1);
                    element.appendChild(italic);

                } else if (part.startsWith("`") && part.endsWith("`")) {
                    const code = document.createElement("code");
                    code.textContent = part.slice(1, -1);
                    element.appendChild(code);

                } else {
                    element.appendChild(document.createTextNode(part));
                }

            });
        }

        function createParagraph(value) {
            const paragraph = document.createElement("p");
            appendInlineText(paragraph, value);
            container.appendChild(paragraph);
        }

        lines.forEach(line => {

            const trimmed = line.trim();

            if (!trimmed) {
                currentList = null;
                currentTable = null;
                return;
            }

            if (/^#{1,3}\s/.test(trimmed)) {

                currentList = null;
                currentTable = null;

                const level = trimmed.match(/^#+/)[0].length;
                const heading = document.createElement(`h${level + 2}`);

                appendInlineText(
                    heading,
                    trimmed.replace(/^#{1,3}\s/, "")
                );

                container.appendChild(heading);
                return;
            }

            if (trimmed.startsWith("|") && trimmed.endsWith("|")) {

                currentList = null;

                const cells = trimmed
                    .slice(1, -1)
                    .split("|")
                    .map(cell => cell.trim());

                if (cells.every(cell => /^:?-{3,}:?$/.test(cell))) {
                    return;
                }

                if (!currentTable) {
                    currentTable = document.createElement("table");
                    currentTable.className = "chat-response-table";

                    const tbody = document.createElement("tbody");
                    currentTable.appendChild(tbody);

                    container.appendChild(currentTable);
                }

                const row = document.createElement("tr");

                cells.forEach(cell => {
                    const td = document.createElement("td");
                    appendInlineText(td, cell);
                    row.appendChild(td);
                });

                currentTable.querySelector("tbody").appendChild(row);
                return;
            }

            currentTable = null;

            if (/^[-*]\s/.test(trimmed)) {

                if (!currentList || currentList.tagName !== "UL") {
                    currentList = document.createElement("ul");
                    container.appendChild(currentList);
                }

                const li = document.createElement("li");
                appendInlineText(li, trimmed.replace(/^[-*]\s/, ""));
                currentList.appendChild(li);
                return;
            }

            if (/^\d+[.)]\s/.test(trimmed)) {

                if (!currentList || currentList.tagName !== "OL") {
                    currentList = document.createElement("ol");
                    container.appendChild(currentList);
                }

                const li = document.createElement("li");
                appendInlineText(li, trimmed.replace(/^\d+[.)]\s/, ""));
                currentList.appendChild(li);
                return;
            }

            currentList = null;
            createParagraph(trimmed);

        });

        return container;
    }

    // Display a message.
    function addMessage(message, sender) {

        const messageElement = document.createElement("div");
        messageElement.className = `chat-message ${sender}`;

        if (sender === "assistant") {
            messageElement.appendChild(formatMessage(message));
        } else {
            const paragraph = document.createElement("p");
            paragraph.textContent = message;
            messageElement.appendChild(paragraph);
        }

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Restore the welcome message and reset conversation history.
    function resetChat() {

        if (sendButton.disabled) return;

        chatHistory = [];
        chatMessages.innerHTML = "";

        addMessage(welcomeMessage, "assistant");

        chatInput.value = "";
        chatInput.focus();
    }

    // Clear Chat button.
    if (clearChatButton) {
        clearChatButton.addEventListener("click", resetChat);
    }

    // New Chat button.
    if (newChatButton) {
        newChatButton.addEventListener("click", resetChat);
    }

    // Suggested question buttons.
    document.querySelectorAll(".suggestion-button").forEach(button => {

        button.addEventListener("click", () => {

            if (sendButton.disabled) return;

            const suggestions = {
                "Travel safety":
                    "What precautions should I take while travelling alone at night?",

                "Online harassment":
                    "Someone is harassing me online. What should I do?",

                "Emergency preparation":
                    "Help me prepare a personal emergency safety checklist."
            };

            const question = suggestions[button.textContent.trim()];

            if (question) {
                chatInput.value = question;
                chatForm.requestSubmit();
            }

        });

    });

    // Send a message to Flask.
    chatForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message || sendButton.disabled) return;

        addMessage(message, "user");

        const previousHistory = [...chatHistory];

        chatHistory.push({
            role: "user",
            content: message
        });

        chatInput.value = "";
        sendButton.disabled = true;

        const loadingElement = document.createElement("div");
        loadingElement.className = "chat-message assistant";
        loadingElement.textContent = "SAKHI AI is thinking...";

        chatMessages.appendChild(loadingElement);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message,
                    history: previousHistory.slice(-10)
                })
            });

            const result = await response.json();

            loadingElement.remove();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error || "Unable to generate a response."
                );
            }

            addMessage(result.reply, "assistant");

            chatHistory.push({
                role: "assistant",
                content: result.reply
            });

            console.log("SAKHI AI provider:", result.provider);

        } catch (error) {

            loadingElement.remove();
            chatHistory = previousHistory;

            addMessage(
                error.message || "Something went wrong. Please try again.",
                "assistant"
            );

            console.error("SAKHI chatbot error:", error);

        } finally {

            sendButton.disabled = false;
            chatInput.focus();

        }

    });

    console.log("SAKHI AI chatbot initialized successfully!");

});
