
document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById(
        "emergencyContactForm"
    );

    const nameInput = document.getElementById(
        "emergencyContactName"
    );

    const phoneInput = document.getElementById(
        "emergencyContactPhone"
    );

    const contactsList = document.getElementById(
        "emergencyContactsList"
    );

    const sosButton = document.getElementById(
        "sosSimulationButton"
    );

    const sosResult = document.getElementById(
        "sosSimulationResult"
    );

    if (!contactForm || !contactsList || !sosButton) {
        return;
    }

    const STORAGE_KEY = "sakhiEmergencyContacts";

    let contacts = loadContacts();

    // Load contacts saved in this browser
    function loadContacts() {
        try {
            const savedContacts = localStorage.getItem(
                STORAGE_KEY
            );

            const parsedContacts = savedContacts
                ? JSON.parse(savedContacts)
                : [];

            return Array.isArray(parsedContacts)
                ? parsedContacts.filter(contact =>
                    contact &&
                    typeof contact.name === "string" &&
                    typeof contact.phone === "string" &&
                    typeof contact.id === "string"
                )
                : [];

        } catch (error) {
            console.error("Could not load contacts:", error);
            return [];
        }
    }

    // Save contacts locally in the browser
    function saveContacts() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(contacts)
            );

            return true;

        } catch (error) {
            console.error("Could not save contacts:", error);
            alert(
                "Unable to save contacts in this browser. " +
                "Please check your browser storage settings."
            );

            return false;
        }
    }

    // Create an element safely using textContent
    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    // Display trusted contacts
    function renderContacts() {

        contactsList.replaceChildren();

        if (contacts.length === 0) {
            contactsList.appendChild(
                createElement(
                    "p",
                    "empty-contacts-message",
                    "No trusted contacts added yet."
                )
            );

            return;
        }

        contacts.forEach(contact => {

            const card = createElement(
                "div",
                "emergency-contact-card"
            );

            const details = createElement(
                "div",
                "emergency-contact-details"
            );

            const name = createElement(
                "h4",
                "",
                contact.name
            );

            const phone = createElement(
                "p",
                "",
                contact.phone
            );

            const actions = createElement(
                "div",
                "emergency-contact-actions"
            );

            const callButton = createElement(
                "a",
                "contact-call-button",
                "Call"
            );

            callButton.href =
                "tel:" + contact.phone.replace(/[^\d+]/g, "");

            const deleteButton = createElement(
                "button",
                "contact-delete-button",
                "Remove"
            );

            deleteButton.type = "button";

            deleteButton.addEventListener("click", () => {
                removeContact(contact.id);
            });

            details.append(name, phone);
            actions.append(callButton, deleteButton);
            card.append(details, actions);

            contactsList.appendChild(card);
        });
    }

    // Add a trusted contact
    contactForm.addEventListener("submit", event => {

        event.preventDefault();

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name || !phone) {
            alert("Please enter both name and phone number.");
            return;
        }

        // Accept Indian 10-digit numbers with optional +91
        const normalizedPhone = phone.replace(/[\s-]/g, "");

        const phonePattern =
            /^(?:\+91)?[6-9]\d{9}$/;

        if (!phonePattern.test(normalizedPhone)) {
            alert(
                "Please enter a valid Indian mobile number " +
                "with 10 digits, optionally starting with +91."
            );
            return;
        }

        const newContact = {
            id: Date.now().toString(),
            name: name,
            phone: normalizedPhone
        };

        contacts.push(newContact);

        if (!saveContacts()) {
            contacts.pop();
            return;
        }

        renderContacts();
        contactForm.reset();

        alert("Trusted contact added successfully!");
    });

    // Remove a trusted contact
    function removeContact(contactId) {

        const confirmed = confirm(
            "Are you sure you want to remove this contact?"
        );

        if (!confirmed) {
            return;
        }

        const previousContacts = [...contacts];

        contacts = contacts.filter(
            contact => contact.id !== contactId
        );

        if (!saveContacts()) {
            contacts = previousContacts;
            return;
        }

        renderContacts();
    }

    // SOS simulation only
    sosButton.addEventListener("click", () => {

        const confirmed = confirm(
            "This is only an SOS demonstration. " +
            "It will NOT send an alert or contact anyone. " +
            "Do you want to continue?"
        );

        if (!confirmed) {
            return;
        }

        sosResult.replaceChildren();

        const resultBox = createElement(
            "div",
            "sos-simulation-message"
        );

        const heading = createElement(
            "h3",
            "",
            "SOS Simulation Activated"
        );

        const message = createElement(
            "p",
            "",
            "This is a demonstration only. No emergency " +
            "alert was sent and no contacts were notified."
        );

        const reminder = createElement(
            "p",
            "",
            "If you are in immediate danger, call 112 " +
            "or contact someone you trust."
        );

        resultBox.append(heading, message, reminder);
        sosResult.appendChild(resultBox);

        sosResult.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });

    // Initial page setup
    renderContacts();

});
