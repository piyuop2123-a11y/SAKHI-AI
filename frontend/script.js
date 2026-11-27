
document.addEventListener("DOMContentLoaded", function () {

    const navItems = document.querySelectorAll(".nav-item[data-page]");
    const pages = document.querySelectorAll(".page");

    const pageTitle = document.getElementById("currentPageName");
    const sidebar = document.getElementById("sidebar");

    const menuToggle = document.getElementById("menuToggle");
    const discreetButton = document.getElementById("discreetButton");

    let countdownInterval = null;
    let currentJourney = null;


    // -----------------------------
    // DATE
    // -----------------------------

    const dateElement = document.getElementById("todayDate");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }


   // -----------------------------
// PAGE NAVIGATION
// -----------------------------

const SAVED_PAGE_KEY = "sakhiLastActivePage";

function showPage(pageId) {

    const selectedPage = document.getElementById(pageId);

    if (!selectedPage || !selectedPage.classList.contains("page")) {
        return;
    }

    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    selectedPage.classList.add("active");

    navItems.forEach(function (item) {
        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );
    });

    const activeItem = document.querySelector(
        `.nav-item[data-page="${pageId}"]`
    );

    if (pageTitle) {
        pageTitle.textContent = activeItem
            ? activeItem.querySelector("span").textContent
            : "Dashboard";
    }

    // Remember the currently selected page.
    try {
        localStorage.setItem(SAVED_PAGE_KEY, pageId);
    } catch (error) {
        console.warn("Unable to save the selected page.", error);
    }

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Sidebar navigation

navItems.forEach(function (item) {

    item.addEventListener("click", function () {
        showPage(item.dataset.page);
    });

});


// Dashboard shortcut navigation

document.querySelectorAll("[data-go]").forEach(function (button) {

    button.addEventListener("click", function () {
        showPage(button.dataset.go);
    });

});


// Restore the last selected page after refresh.

let savedPage = "dashboard";

try {
    const storedPage = localStorage.getItem(SAVED_PAGE_KEY);

    if (
        storedPage &&
        document.getElementById(storedPage) &&
        document.getElementById(storedPage).classList.contains("page")
    ) {
        savedPage = storedPage;
    }
} catch (error) {
    console.warn("Unable to restore the selected page.", error);
}

showPage(savedPage);

    // -----------------------------
    // MOBILE SIDEBAR
    // -----------------------------

    if (menuToggle && sidebar) {

        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });

    }


    // -----------------------------
    // DISCREET DISPLAY MODE
    // -----------------------------

    if (discreetButton) {

        discreetButton.addEventListener("click", function () {

            document.body.classList.toggle("discreet-mode");

            const enabled = document.body.classList.contains(
                "discreet-mode"
            );

            discreetButton.innerHTML = enabled
                ? '<i data-lucide="eye"></i>'
                : '<i data-lucide="eye-off"></i>';

            discreetButton.title = enabled
                ? "Return to normal display"
                : "Discreet display mode";

            if (window.lucide) {
                window.lucide.createIcons();
            }

        });

    }


    // -----------------------------
    // JOURNEY GUARDIAN STYLES
    // -----------------------------

    const journeyStyles = document.createElement("style");

    journeyStyles.textContent = `
        .journey-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .journey-form-card,
        .journey-status-card {
            background: #ffffff;
            border: 1px solid #eeeaf5;
            border-radius: 17px;
            padding: 25px;
        }

        .journey-card-title {
            font-family: Manrope, sans-serif;
            font-size: 18px;
            margin-bottom: 8px;
        }

        .journey-card-description {
            color: #898598;
            font-size: 12px;
            line-height: 1.7;
            margin-bottom: 22px;
        }

        .journey-field {
            margin-bottom: 17px;
        }

        .journey-field label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .journey-field input {
            width: 100%;
            border: 1px solid #e9e4f1;
            border-radius: 9px;
            padding: 12px;
            font: inherit;
            font-size: 13px;
            outline: none;
            background: #fff;
        }

        .journey-field input:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px #f1eaff;
        }

        .journey-submit {
            width: 100%;
            background: #8b5cf6;
            color: white;
            border: none;
            border-radius: 9px;
            padding: 13px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
        }

        .journey-submit:hover {
            background: #7542df;
        }

        .journey-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .journey-message {
            display: none;
            padding: 11px;
            border-radius: 9px;
            margin-top: 15px;
            font-size: 12px;
            line-height: 1.6;
        }

        .journey-message.error {
            display: block;
            color: #b42318;
            background: #fff0ef;
        }

        .journey-message.success {
            display: block;
            color: #18794e;
            background: #eaf8f0;
        }

        .journey-empty {
            text-align: center;
            padding: 30px 10px;
        }

        .journey-empty-icon {
            width: 55px;
            height: 55px;
            display: grid;
            place-items: center;
            background: #f1eaff;
            color: #8b5cf6;
            border-radius: 16px;
            margin: 0 auto 15px;
        }

        .journey-empty p {
            color: #898598;
            font-size: 12px;
            margin-top: 8px;
            line-height: 1.6;
        }

        .journey-status-label {
            display: inline-block;
            padding: 7px 11px;
            border-radius: 20px;
            background: #eaf8f0;
            color: #18794e;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 18px;
        }

        .journey-status-label.overdue {
            background: #fff0ef;
            color: #b42318;
        }

        .journey-route {
            background: #f8f6fc;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 18px;
        }

        .journey-route p {
            color: #898598;
            font-size: 11px;
            margin-bottom: 5px;
        }

        .journey-route strong {
            font-size: 14px;
            overflow-wrap: anywhere;
        }

        .journey-route-arrow {
            color: #8b5cf6;
            padding: 9px 0;
        }

        .journey-countdown-label {
            color: #898598;
            font-size: 11px;
            margin-bottom: 8px;
        }

        .journey-countdown {
            font-family: Manrope, sans-serif;
            font-size: 34px;
            font-weight: 800;
            color: #8b5cf6;
            margin-bottom: 17px;
            font-variant-numeric: tabular-nums;
        }

        .journey-countdown.overdue {
            color: #dc2626;
        }

        .journey-arrival-time {
            font-size: 11px;
            color: #898598;
            margin-bottom: 17px;
            line-height: 1.6;
        }

        .journey-complete {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 9px;
            background: #eaf8f0;
            color: #18794e;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }

        .journey-complete:hover {
            background: #d9f1e4;
        }

        .journey-safety-note {
            margin-top: 20px;
            padding: 14px;
            border-radius: 10px;
            background: #f8f6fc;
            color: #777386;
            font-size: 11px;
            line-height: 1.7;
        }

        @media (max-width: 900px) {
            .journey-layout {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(journeyStyles);
        // -----------------------------
    // JOURNEY GUARDIAN HTML
    // -----------------------------

    const journeyPage = document.getElementById("journey");

    if (journeyPage) {

        journeyPage.innerHTML = `
            <div class="page-heading">
                <p class="eyebrow">TRAVEL SAFETY</p>
                <h1>Journey Guardian</h1>
                <p>Plan your journey and keep track of your expected arrival.</p>
            </div>

            <div class="journey-layout">

                <div class="journey-form-card">

                    <h2 class="journey-card-title">Plan your journey</h2>

                    <p class="journey-card-description">
                        Enter your journey details to start your safety check-in timer.
                    </p>

                    <form id="journeyForm">

                        <div class="journey-field">
                            <label for="startLocation">Starting location</label>
                            <input
                                type="text"
                                id="startLocation"
                                maxlength="200"
                                placeholder="Enter your starting point"
                                required
                            >
                        </div>

                        <div class="journey-field">
                            <label for="destination">Destination</label>

                            <input
                                type="text"
                                id="destination"
                                maxlength="200"
                                placeholder="Enter your destination"
                                required
                            >
                        </div>

                        <div class="journey-field">
                            <label for="journeyDuration">
                                Expected journey duration (minutes)
                            </label>
                            <input
                                type="number"
                                id="journeyDuration"
                                min="1"
                                max="1440"
                                value="30"
                                required
                            >
                        </div>

                        <button type="submit" class="journey-submit" id="startJourneyButton">
                            Start Journey
                        </button>

                        <div class="journey-message" id="journeyMessage"></div>

                    </form>

                </div>


                <div class="journey-status-card">

                    <h2 class="journey-card-title">Journey status</h2>

                    <p class="journey-card-description">
                        Your current journey and arrival information.
                    </p>

                    <div id="journeyStatusContent">
                        <div class="journey-empty">
                            <div class="journey-empty-icon">
                                <i data-lucide="map-pin"></i>
                            </div>

                            <h3>No active journey</h3>

                            <p>
                                Start a journey to see its countdown and arrival status here.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            <div class="journey-safety-note">
                <strong>Important:</strong> This is an in-app check-in reminder.
                It does not track your live location, send messages, or contact
                emergency services. Keep your trusted contacts informed yourself.
                The timer requires the application to remain open to update visibly.
            </div>
        `;

        if (window.lucide) {
            window.lucide.createIcons();
        }

    }


    // -----------------------------
    // JOURNEY MESSAGES
    // -----------------------------

    function showJourneyMessage(message, type) {

        const messageBox = document.getElementById("journeyMessage");

        if (!messageBox) {
            return;
        }

        messageBox.textContent = message;
        messageBox.className = "journey-message " + type;

    }


    // -----------------------------
    // DASHBOARD JOURNEY STATUS
    // -----------------------------

    function updateDashboardJourney(journey) {

        const panel = document.querySelector(".journey-panel");

        if (!panel) {
            return;
        }

        const heading = panel.querySelector(".panel-heading");

        const emptyState = panel.querySelector(".empty-state");

        if (!heading || !emptyState) {
            return;
        }

        if (!journey) {

            heading.querySelector(".status-badge").innerHTML =
                '<span class="status-dot"></span> No active journey';

            emptyState.style.display = "block";

            return;
        }

        heading.querySelector(".status-badge").innerHTML =
            '<span class="status-dot"></span> ' +
            (journey.status === "overdue" ? "Arrival overdue" : "Journey active");

        emptyState.style.display = "block";

        emptyState.innerHTML = `
            <div class="empty-icon">
                <i data-lucide="map-pinned"></i>
            </div>

            <h4>${escapeHTML(journey.destination)}</h4>

            <p>From ${escapeHTML(journey.start_location)}</p>

            <button class="secondary-button" id="openJourneyButton">
                View journey
            </button>
        `;

        const openButton = document.getElementById("openJourneyButton");

        if (openButton) {
            openButton.addEventListener("click", function () {
                showPage("journey");
            });
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }

    }


    // -----------------------------
    // BASIC HTML ESCAPING
    // -----------------------------

    function escapeHTML(value) {

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


    // -----------------------------
    // COUNTDOWN
    // -----------------------------

    function formatTime(milliseconds) {

        const totalSeconds = Math.max(
            0,
            Math.floor(milliseconds / 1000)
        );

        const hours = Math.floor(totalSeconds / 3600);

        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const seconds = totalSeconds % 60;

        return [
            String(hours).padStart(2, "0"),
            String(minutes).padStart(2, "0"),
            String(seconds).padStart(2, "0")
        ].join(":");

    }


    function updateCountdown() {

        if (!currentJourney) {
            return;
        }

        const countdownElement = document.getElementById("journeyCountdown");
        const statusElement = document.getElementById("journeyStatusLabel");

        if (!countdownElement || !statusElement) {
            return;
        }

        const arrivalTime = new Date(
        currentJourney.expected_arrival.replace(" ", "T") +"Z"
       ).getTime();    

        const difference = arrivalTime - Date.now();

        if (difference <= 0) {

            countdownElement.textContent =
                "+" + formatTime(Math.abs(difference));

            countdownElement.classList.add("overdue");

            statusElement.textContent = "Arrival overdue";
            statusElement.classList.add("overdue");

        } else {

            countdownElement.textContent = formatTime(difference);

            countdownElement.classList.remove("overdue");

            statusElement.textContent = "Journey active";
            statusElement.classList.remove("overdue");

        }

    }


    // -----------------------------
    // DISPLAY JOURNEY
    // -----------------------------

    function displayJourney(journey) {

        currentJourney = journey;

        const statusContent = document.getElementById(
            "journeyStatusContent"
        );

        if (!statusContent) {
            return;
        }

        if (!journey) {

            currentJourney = null;

            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }

            statusContent.innerHTML = `
                <div class="journey-empty">
                    <div class="journey-empty-icon">
                        <i data-lucide="map-pin"></i>
                    </div>

                    <h3>No active journey</h3>

                    <p>
                        Start a journey to see its countdown and arrival status here.
                    </p>
                </div>
            `;

            updateDashboardJourney(null);

            if (window.lucide) {
                window.lucide.createIcons();
            }

            return;
        }


        statusContent.innerHTML = `
            <div>
                <span class="journey-status-label" id="journeyStatusLabel">
                    Journey active
                </span>
            </div>

            <div class="journey-route">

                <p>STARTING POINT</p>
                <strong>${escapeHTML(journey.start_location)}</strong>

                <div class="journey-route-arrow">↓</div>

                <p>DESTINATION</p>
                <strong>${escapeHTML(journey.destination)}</strong>

            </div>

            <p class="journey-countdown-label">
                TIME UNTIL EXPECTED ARRIVAL
            </p>

            <div class="journey-countdown" id="journeyCountdown">
                --:--:--
            </div>

            <p class="journey-arrival-time">
                Expected arrival:
               ${new Date(
              journey.expected_arrival.replace(" ", "T") + "Z"
              ).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short"
              })}
            </p>

            <button class="journey-complete" id="completeJourneyButton">
                Confirm Arrival
            </button>
        `;

        updateDashboardJourney(journey);

        updateCountdown();

        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        countdownInterval = setInterval(updateCountdown, 1000);


        const completeButton = document.getElementById(
            "completeJourneyButton"
        );

        if (completeButton) {
            completeButton.addEventListener("click", completeJourney);
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }

    }


    // -----------------------------
    // LOAD ACTIVE JOURNEY
    // -----------------------------

    async function loadActiveJourney() {

        try {

            const response = await fetch("/api/journeys/active");

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not load journey.");
            }

            displayJourney(data.journey);

        } catch (error) {

            console.error("Journey loading error:", error);

            showJourneyMessage(
                "Unable to load journey information. Please refresh the page.",
                "error"
            );

        }

    }


    // -----------------------------
    // START JOURNEY
    // -----------------------------

    const journeyForm = document.getElementById("journeyForm");

    if (journeyForm) {

        journeyForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const startLocation = document.getElementById(
                "startLocation"
            ).value.trim();

            const destination = document.getElementById(
                "destination"
            ).value.trim();

            const expectedMinutes = Number(
                document.getElementById("journeyDuration").value
            );

            const startButton = document.getElementById(
                "startJourneyButton"
            );

            if (!startLocation || !destination) {

                showJourneyMessage(
                    "Please enter both locations.",
                    "error"
                );

                return;

            }

            if (
                !Number.isInteger(expectedMinutes) ||
                expectedMinutes < 1 ||
                expectedMinutes > 1440
            ) {

                showJourneyMessage(
                    "Enter a journey duration between 1 and 1440 minutes.",
                    "error"
                );

                return;

            }

            startButton.disabled = true;
            startButton.textContent = "Starting journey...";

            try {

                const response = await fetch("/api/journeys", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        start_location: startLocation,
                        destination: destination,
                        expected_minutes: expectedMinutes
                    })

                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Unable to start journey.");
                }

                showJourneyMessage(
                    "Your journey has started successfully.",
                    "success"
                );

                journeyForm.reset();

                document.getElementById(
                    "journeyDuration"
                ).value = 30;

                displayJourney(data.journey);

            } catch (error) {

                showJourneyMessage(error.message, "error");

            } finally {

                startButton.disabled = false;
                startButton.textContent = "Start Journey";

            }

        });

    }

    // -----------------------------
    // CONFIRM ARRIVAL
    // -----------------------------

    async function completeJourney() {

        if (!currentJourney) {
            return;
        }

        const completeButton = document.getElementById(
            "completeJourneyButton"
        );

        completeButton.disabled = true;
        completeButton.textContent = "Confirming...";

        try {

            const response = await fetch(
                `/api/journeys/${currentJourney.id}/complete`,
                {
                    method: "POST"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to complete journey.");
            }

            displayJourney(null);

            showJourneyMessage(
                "Arrival confirmed. Your journey has been completed.",
                "success"
            );

            alert("Arrival confirmed! Your journey is now completed.");

        } catch (error) {

            showJourneyMessage(error.message, "error");

            completeButton.disabled = false;
            completeButton.textContent = "Confirm Arrival";

        }

    }


    // -----------------------------
    // INITIALIZE
    // -----------------------------

    if (window.lucide) {
        window.lucide.createIcons();
    }

    loadActiveJourney();

});


// -----------------------------
// AI SITUATION ANALYZER
// -----------------------------
// Connects the website to:
// 1. Machine Learning API
// 2. Rule-Based Expert System API
// 3. Incident History API

document.addEventListener("DOMContentLoaded", function () {

    const analyzerPage = document.getElementById("analyzer");

    if (!analyzerPage) {
        return;
    }


    // -----------------------------
    // ANALYZER STYLES
    // -----------------------------

    const analyzerStyles = document.createElement("style");

    analyzerStyles.textContent = `
        .analyzer-card {
            max-width: 850px;
            background: #ffffff;
            border: 1px solid #eeeaf5;
            border-radius: 17px;
            padding: 25px;
            margin-bottom: 20px;
        }

        .analyzer-card h2 {
            font-family: Manrope, sans-serif;
            font-size: 18px;
            margin-bottom: 8px;
        }

        .analyzer-description {
            color: #898598;
            font-size: 12px;
            line-height: 1.7;
            margin-bottom: 20px;
        }

        .analyzer-textarea {
            width: 100%;
            min-height: 150px;
            resize: vertical;
            border: 1px solid #e9e4f1;
            border-radius: 10px;
            padding: 14px;
            font: inherit;
            font-size: 13px;
            line-height: 1.6;
            outline: none;
            background: #fff;
            box-sizing: border-box;
        }

        .analyzer-textarea:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px #f1eaff;
        }

        .analyzer-submit {
            width: 100%;
            margin-top: 14px;
            background: #8b5cf6;
            color: white;
            border: none;
            border-radius: 9px;
            padding: 13px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
        }

        .analyzer-submit:hover {
            background: #7542df;
        }

        .analyzer-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .analyzer-result {
            display: none;
            margin-top: 20px;
            padding: 18px;
            border-radius: 12px;
            background: #f8f6fc;
            border: 1px solid #eeeaf5;
        }

        .analyzer-result.visible {
            display: block;
        }

        .analyzer-result h3 {
            font-size: 16px;
            margin-bottom: 8px;
            text-transform: capitalize;
        }

        .analyzer-result p {
            color: #777386;
            font-size: 12px;
            line-height: 1.7;
            margin-top: 7px;
        }

        .analyzer-category {
            display: inline-block;
            padding: 7px 11px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 12px;
        }

        .analyzer-category.high {
            color: #b42318;
            background: #fff0ef;
        }

        .analyzer-category.medium {
            color: #946200;
            background: #fff7df;
        }

        .analyzer-category.low {
            color: #18794e;
            background: #eaf8f0;
        }

        .analyzer-warning {
            margin-top: 16px;
            padding: 13px;
            border-radius: 10px;
            background: #fff7e8;
            color: #76521b;
            font-size: 11px;
            line-height: 1.7;
        }

        .analyzer-error {
            display: none;
            margin-top: 14px;
            padding: 11px;
            border-radius: 9px;
            color: #b42318;
            background: #fff0ef;
            font-size: 12px;
            line-height: 1.6;
        }

        .analyzer-error.visible {
            display: block;
        }

        .expert-result {
            display: none;
            max-width: 850px;
            margin: 20px 0;
            padding: 22px;
            border: 1px solid #eeeaf5;
            border-radius: 17px;
            background: #ffffff;
        }

        .expert-result.visible {
            display: block;
        }

        .expert-result h2 {
            font-family: Manrope, sans-serif;
            font-size: 18px;
            margin-bottom: 8px;
        }

        .expert-result p {
            color: #898598;
            font-size: 12px;
            line-height: 1.7;
            margin: 8px 0;
        }

        .expert-suggestions {
            padding-left: 20px;
            margin: 14px 0;
        }

        .expert-suggestions li {
            color: #555166;
            font-size: 13px;
            line-height: 1.7;
            margin-bottom: 9px;
        }

        .expert-conditions {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin: 12px 0;
        }

        .expert-condition {
            display: inline-block;
            padding: 6px 9px;
            border-radius: 20px;
            background: #f1eaff;
            color: #7542df;
            font-size: 10px;
            font-weight: 700;
        }

        .expert-disclaimer {
            padding: 12px;
            border-radius: 9px;
            background: #fff7e8;
            color: #76521b !important;
        }

        .expert-error {
            display: none;
            margin-top: 12px;
            padding: 11px;
            border-radius: 9px;
            color: #b42318;
            background: #fff0ef;
            font-size: 12px;
            line-height: 1.6;
        }

        .expert-error.visible {
            display: block;
        }

        .history-save-status {
            display: none;
            max-width: 850px;
            margin: 14px 0;
            padding: 12px 14px;
            border-radius: 9px;
            font-size: 12px;
            line-height: 1.6;
        }

        .history-save-status.success {
            display: block;
            color: #18794e;
            background: #eaf8f0;
        }

        .history-save-status.error {
            display: block;
            color: #b42318;
            background: #fff0ef;
        }

        .history-save-status.info {
            display: block;
            color: #76521b;
            background: #fff7e8;
        }
    `;

    document.head.appendChild(analyzerStyles);


    // -----------------------------
    // ANALYZER PAGE HTML
    // -----------------------------

    analyzerPage.innerHTML = `
        <div class="page-heading">
            <p class="eyebrow">MACHINE LEARNING + EXPERT SYSTEM</p>
            <h1>AI Situation Analyzer</h1>
            <p>
                Describe a situation to receive an experimental text classification
                and rule-based safety suggestions.
            </p>
        </div>

        <div class="analyzer-card">

            <h2>Describe your situation</h2>

            <p class="analyzer-description">
                Enter a few sentences describing what is happening or what you are concerned about.
                Avoid including names, phone numbers, addresses, or other sensitive personal details.
            </p>

            <form id="analyzerForm">

                <textarea
                    class="analyzer-textarea"
                    id="analyzerText"
                    maxlength="2000"
                    placeholder="Example: I feel uncomfortable walking through a poorly lit street..."
                    required
                ></textarea>

                <button type="submit" class="analyzer-submit" id="analyzerSubmit">
                    Analyze Situation
                </button>

            </form>

            <div class="analyzer-error" id="analyzerError" role="alert"></div>

            <div class="analyzer-result" id="analyzerResult" aria-live="polite">

                <span class="analyzer-category" id="analyzerCategory"></span>

                <h3>Machine Learning Result</h3>

                <p id="analyzerDescription"></p>

                <p>
                    <strong>Model confidence estimate:</strong>
                    <span id="analyzerConfidence"></span>
                </p>

                <p id="analyzerDisclaimer"></p>

            </div>

        </div>


        <div class="expert-result" id="expertResult" aria-live="polite">

            <p class="eyebrow">RULE-BASED ARTIFICIAL INTELLIGENCE</p>

            <h2 id="expertTitle">Expert System Suggestions</h2>

            <p>
                Suggestions generated by SAKHI AI's predefined IF-THEN rules:
            </p>

            <div class="expert-conditions" id="expertConditions"></div>

            <ul class="expert-suggestions" id="expertSuggestions"></ul>

            <p class="expert-disclaimer" id="expertDisclaimer"></p>

        </div>

        <div class="expert-error" id="expertError" role="alert"></div>

        <div
            class="history-save-status"
            id="historySaveStatus"
            role="status"
            aria-live="polite"
        ></div>

        <div class="analyzer-warning">
            <strong>Safety note:</strong>
            The text classifier uses a small, manually created training dataset.
            The Expert System uses predefined rules. Neither can determine whether
            a person or place is actually safe, predict someone's intentions,
            or replace professional help. If you are in immediate danger,
            move to a safer place if possible and contact local emergency services.
        </div>
    `;


    // -----------------------------
    // ANALYZER ELEMENTS
    // -----------------------------

    const analyzerForm = document.getElementById("analyzerForm");

    const analyzerText = document.getElementById("analyzerText");

    const analyzerSubmit = document.getElementById("analyzerSubmit");

    const analyzerError = document.getElementById("analyzerError");

    const analyzerResult = document.getElementById("analyzerResult");

    const historySaveStatus = document.getElementById("historySaveStatus");

    const analyzerCategory = document.getElementById("analyzerCategory");

    const analyzerDescription = document.getElementById("analyzerDescription");

    const analyzerConfidence = document.getElementById("analyzerConfidence");

    const analyzerDisclaimer = document.getElementById("analyzerDisclaimer");

    const expertResult = document.getElementById("expertResult");

    const expertTitle = document.getElementById("expertTitle");

    const expertConditions = document.getElementById("expertConditions");

    const expertSuggestions = document.getElementById("expertSuggestions");

    const expertDisclaimer = document.getElementById("expertDisclaimer");

    const expertError = document.getElementById("expertError");


    // -----------------------------
    // ANALYZER FORM SUBMISSION
    // -----------------------------

    analyzerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const text = analyzerText.value.trim();

        if (!text) {
            analyzerError.textContent = "Please describe a situation first.";
            analyzerError.classList.add("visible");
            return;
        }

        // Reset previous results and messages.

        analyzerError.textContent = "";
        analyzerError.classList.remove("visible");

        expertError.textContent = "";
        expertError.classList.remove("visible");

        analyzerResult.classList.remove("visible");
        expertResult.classList.remove("visible");

        historySaveStatus.textContent = "";
        historySaveStatus.className = "history-save-status";

        analyzerSubmit.disabled = true;
        analyzerSubmit.textContent = "Analyzing...";


        try {

            // STEP 1: MACHINE LEARNING ANALYSIS

            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to analyze the situation."
                );
            }


            // Display the ML result.

            analyzerCategory.textContent =
                (data.category || "unknown").replaceAll("_", " ");

            analyzerCategory.className = "analyzer-category";

            if (data.category === "immediate_threat") {
                analyzerCategory.classList.add("high");
            } else if (data.category === "unsafe_travel") {
                analyzerCategory.classList.add("medium");
            } else {
                analyzerCategory.classList.add("low");
            }

            analyzerDescription.textContent =
                data.description || "The situation has been analyzed.";

            analyzerConfidence.textContent =
                `${data.confidence_percent ?? 0}%`;

            analyzerDisclaimer.textContent =
                data.disclaimer ||
                "This is a machine learning classification, not a real-world danger assessment.";

            analyzerResult.classList.add("visible");


            // STEP 2: RULE-BASED EXPERT SYSTEM

            try {

                const adviceResponse = await fetch("/api/safety-advice", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: text
                    })
                });

                const advice = await adviceResponse.json();

                if (!adviceResponse.ok) {
                    throw new Error(
                        advice.error || "Unable to generate safety suggestions."
                    );
                }


                // Display the Expert System result.

                expertTitle.textContent =
                    advice.title || "Safety Suggestions";

                expertConditions.innerHTML = "";

                const conditions = advice.matched_conditions || [];

                if (conditions.length > 0) {

                    conditions.forEach(function (condition) {

                        const conditionTag = document.createElement("span");

                        conditionTag.className = "expert-condition";

                        conditionTag.textContent = condition;

                        expertConditions.appendChild(conditionTag);

                    });

                } else {

                    const noConditions = document.createElement("span");

                    noConditions.className = "expert-condition";

                    noConditions.textContent = "No specific rule matched";

                    expertConditions.appendChild(noConditions);

                }


                expertSuggestions.innerHTML = "";

                const suggestions = advice.suggestions || [];

                suggestions.forEach(function (suggestion) {

                    const listItem = document.createElement("li");

                    listItem.textContent = suggestion;

                    expertSuggestions.appendChild(listItem);

                });


                expertDisclaimer.textContent =
                    advice.disclaimer ||
                    "These are general suggestions generated using predefined rules.";

                expertResult.classList.add("visible");


                // STEP 3: SAVE BOTH RESULTS TO INCIDENT HISTORY

                historySaveStatus.textContent = "Saving analysis to Incident History...";
                historySaveStatus.className = "history-save-status info";

                try {

                    const historyResponse = await fetch("/api/history", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            description: text,
                            analysis: data,
                            advice: advice
                        })
                    });

                    const historyData = await historyResponse.json();

                    if (!historyResponse.ok) {
                        throw new Error(
                            historyData.error || "Unable to save analysis."
                        );
                    }

                    historySaveStatus.textContent =
                        "Analysis successfully saved to Incident History.";

                    historySaveStatus.className =
                        "history-save-status success";

                } catch (historyError) {

                    console.error(
                        "Incident History save error:",
                        historyError
                    );

                    historySaveStatus.textContent =
                        "Analysis completed, but it could not be saved to Incident History. " +
                        historyError.message;

                    historySaveStatus.className =
                        "history-save-status error";

                }

            } catch (adviceError) {

                console.error("Expert System error:", adviceError);

                expertError.textContent =
                    "The Machine Learning result is available, but the Expert System could not generate suggestions: " +
                    adviceError.message;

                expertError.classList.add("visible");

            }

        } catch (error) {

            console.error("Analyzer error:", error);

            analyzerError.textContent = error.message;

            analyzerError.classList.add("visible");

        } finally {

            analyzerSubmit.disabled = false;

            analyzerSubmit.textContent = "Analyze Situation";

        }

    });


    // -----------------------------
    // INITIALIZE ANALYZER
    // -----------------------------

    if (window.lucide) {
        window.lucide.createIcons();
    }

});
