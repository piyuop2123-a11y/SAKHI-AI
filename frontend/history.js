
document.addEventListener("DOMContentLoaded", function () {

    const historyPage = document.getElementById("history");

    if (!historyPage) {
        return;
    }

    // =====================================
    // HISTORY PAGE STYLES
    // =====================================

    const historyStyles = document.createElement("style");

    historyStyles.textContent = `
        .history-container {
            display: grid;
            gap: 18px;
        }

        .history-intro {
            color: #898598;
            font-size: 13px;
            line-height: 1.7;
            margin-bottom: 20px;
        }

        .history-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
            flex-wrap: wrap;
        }

        .history-count {
            font-size: 12px;
            color: #898598;
        }

        .history-refresh {
            background: #8b5cf6;
            color: white;
            border: none;
            border-radius: 9px;
            padding: 10px 16px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }

        .history-refresh:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .history-card {
            background: #ffffff;
            border: 1px solid #eeeaf5;
            border-radius: 15px;
            padding: 20px;
        }

        .history-card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 14px;
        }

        .history-category {
            display: inline-block;
            background: #f1eaff;
            color: #7542df;
            padding: 7px 11px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .history-confidence {
            font-size: 12px;
            color: #18794e;
            font-weight: 700;
        }

        .history-description {
            font-size: 13px;
            line-height: 1.7;
            color: #393545;
            overflow-wrap: anywhere;
            margin-bottom: 15px;
        }

        .history-expert-title {
            font-size: 14px;
            font-weight: 800;
            margin-bottom: 9px;
            color: #393545;
        }

        .history-suggestions {
            padding-left: 19px;
            color: #777386;
            font-size: 12px;
            line-height: 1.8;
        }

        .history-date {
            color: #9893a4;
            font-size: 11px;
            margin-top: 16px;
        }

        .history-empty {
            background: #ffffff;
            border: 1px solid #eeeaf5;
            border-radius: 15px;
            padding: 45px 20px;
            text-align: center;
        }

        .history-empty-icon {
            width: 55px;
            height: 55px;
            border-radius: 16px;
            background: #f1eaff;
            color: #8b5cf6;
            display: grid;
            place-items: center;
            margin: 0 auto 15px;
            font-size: 24px;
        }

        .history-empty h3 {
            font-size: 16px;
            margin-bottom: 8px;
        }

        .history-empty p {
            color: #898598;
            font-size: 12px;
            line-height: 1.7;
        }

        .history-error {
            background: #fff0ef;
            color: #b42318;
            padding: 13px;
            border-radius: 10px;
            font-size: 12px;
            line-height: 1.6;
        }

        .history-safety-note {
            background: #f8f6fc;
            padding: 14px;
            border-radius: 10px;
            color: #777386;
            font-size: 11px;
            line-height: 1.7;
        }
    `;

    document.head.appendChild(historyStyles);


    // =====================================
    // HISTORY PAGE HTML
    // =====================================

    historyPage.innerHTML = `
        <div class="page-heading">

            <p class="eyebrow">YOUR RECORDS</p>

            <h1>Incident History</h1>

            <p>
                Review your previously submitted AI situation analyses
                and their corresponding safety suggestions.
            </p>

        </div>

        <div class="history-container">

            <div class="history-toolbar">

                <span class="history-count" id="historyCount">
                    Loading records...
                </span>

                <button
                    class="history-refresh"
                    id="refreshHistoryButton"
                    type="button"
                >
                    Refresh History
                </button>

            </div>

            <div id="historyMessage"></div>

            <div id="historyRecords">

                <div class="history-empty">
                    <div class="history-empty-icon">⌛</div>
                    <h3>Loading your history</h3>
                    <p>Please wait while your saved records are retrieved.</p>
                </div>

            </div>

            <div class="history-safety-note">
                <strong>Privacy note:</strong>
                These records are stored in the local SQLite database
                of this project. Avoid entering real names, phone numbers,
                addresses, or other sensitive personal information.
            </div>

        </div>
    `;


    // =====================================
    // HELPER FUNCTIONS
    // =====================================

    function escapeHistoryHTML(value) {

        return String(value).replace(/[&<>"']/g, function (character) {

            const replacements = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return replacements[character];

        });

    }


    function formatCategory(category) {

        const names = {
            immediate_threat: "Immediate Threat",
            online_harassment: "Online Harassment",
            unsafe_travel: "Unsafe Travel"
        };

        return names[category] || "General Safety";

    }


  function formatDate(dateValue) {
    if (!dateValue) {
        return "Date unavailable";
    }

    // Backend timestamps without a timezone are stored as UTC.
    const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(dateValue);

    const normalizedDate = hasTimezone
        ? dateValue
        : dateValue + "Z";

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

    // =====================================
    // DISPLAY HISTORY RECORDS
    // =====================================

    function displayHistory(records) {

        const recordsContainer = document.getElementById(
            "historyRecords"
        );

        const countElement = document.getElementById(
            "historyCount"
        );

        if (!recordsContainer || !countElement) {
            return;
        }

        countElement.textContent =
            records.length + (records.length === 1
                ? " saved analysis"
                : " saved analyses");


        if (records.length === 0) {

            recordsContainer.innerHTML = `
                <div class="history-empty">

                    <div class="history-empty-icon">📋</div>

                    <h3>No saved analyses yet</h3>

                    <p>
                        Your completed AI situation analyses will
                        appear here after they are saved.
                    </p>

                </div>
            `;

            return;
        }


        recordsContainer.innerHTML = records.map(function (record) {

            const suggestions = Array.isArray(
                record.expert_suggestions
            )
                ? record.expert_suggestions
                : [];


            const suggestionHTML = suggestions.length > 0
                ? suggestions.map(function (suggestion) {
                    return `
                        <li>${escapeHistoryHTML(suggestion)}</li>
                    `;
                }).join("")
                : "<li>No additional suggestions recorded.</li>";


            return `
                <article class="history-card">

                    <div class="history-card-top">

                        <span class="history-category">
                            ${escapeHistoryHTML(
                                formatCategory(record.category)
                            )}
                        </span>

                        <span class="history-confidence">
                            Model confidence:
                            ${Number(record.confidence).toFixed(1)}%
                        </span>

                    </div>

                    <p class="history-description">
                        ${escapeHistoryHTML(record.description)}
                    </p>

                    <h3 class="history-expert-title">
                        ${escapeHistoryHTML(record.expert_title)}
                    </h3>

                    <ul class="history-suggestions">
                        ${suggestionHTML}
                    </ul>

                    <p class="history-date">
                        Analyzed on:
                        ${escapeHistoryHTML(
                            formatDate(record.created_at)
                        )}
                    </p>

                </article>
            `;

        }).join("");

    }


    // =====================================
    // LOAD HISTORY FROM FLASK BACKEND
    // =====================================

    async function loadHistory() {

        const recordsContainer = document.getElementById(
            "historyRecords"
        );

        const messageContainer = document.getElementById(
            "historyMessage"
        );

        const refreshButton = document.getElementById(
            "refreshHistoryButton"
        );

        refreshButton.disabled = true;
        refreshButton.textContent = "Loading...";

        messageContainer.innerHTML = "";

        try {

            const response = await fetch("/api/history");

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to retrieve history."
                );
            }

            displayHistory(data.history || []);

        } catch (error) {

            console.error("History loading error:", error);

            recordsContainer.innerHTML = "";

            document.getElementById(
                "historyCount"
            ).textContent = "Unable to load records";

            messageContainer.innerHTML = `
                <div class="history-error">
                    ${escapeHistoryHTML(error.message)}
                    Please check that the Flask server is running.
                </div>
            `;

        } finally {

            refreshButton.disabled = false;
            refreshButton.textContent = "Refresh History";

        }

    }


    // =====================================
    // REFRESH BUTTON
    // =====================================

    document.getElementById(
        "refreshHistoryButton"
    ).addEventListener("click", loadHistory);


    // =====================================
    // NAVIGATION CONNECTION
    // =====================================

    document.querySelectorAll(
        '.nav-item[data-page="history"]'
    ).forEach(function (item) {

        item.addEventListener("click", loadHistory);

    });


    // =====================================
    // INITIALIZE
    // =====================================

    loadHistory();

});
