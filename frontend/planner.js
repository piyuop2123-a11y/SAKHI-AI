
document.addEventListener("DOMContentLoaded", function () {

    const plannerPage = document.getElementById("planner");

    if (!plannerPage) {
        console.error("SAKHI AI: Planner page element not found.");
        return;
    }

    // ==========================================
    // SAFETY PLANNER STYLES
    // ==========================================

    const plannerStyles = document.createElement("style");

    plannerStyles.textContent = `
        .planner-container {
            max-width: 900px;
        }

        .planner-card {
            background: #ffffff;
            border: 1px solid #eeeaf5;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
        }

        .planner-card h2 {
            font-size: 17px;
            margin-bottom: 8px;
        }

        .planner-subtitle {
            color: #898598;
            font-size: 12px;
            line-height: 1.7;
            margin-bottom: 20px;
        }

        .planner-label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            margin: 18px 0 9px;
            color: #555166;
        }

        .planner-select {
            width: 100%;
            padding: 12px;
            border: 1px solid #e9e4f1;
            border-radius: 9px;
            background: #ffffff;
            color: #555166;
            font-size: 13px;
            outline: none;
        }

        .planner-select:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px #f1eaff;
        }

        .planner-generate {
            width: 100%;
            margin-top: 22px;
            padding: 13px;
            border: none;
            border-radius: 9px;
            background: #8b5cf6;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
        }

        .planner-generate:hover {
            background: #7542df;
        }

        .planner-generate:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .planner-error {
            display: none;
            margin-top: 15px;
            padding: 12px;
            border-radius: 9px;
            background: #fff0ef;
            color: #b42318;
            font-size: 12px;
            line-height: 1.6;
        }

        .planner-error.visible {
            display: block;
        }

        .planner-results {
            display: none;
        }

        .planner-results.visible {
            display: block;
        }

        .planner-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .planner-progress-header strong {
            font-size: 13px;
        }

        .planner-progress-track {
            height: 9px;
            border-radius: 20px;
            background: #eeeaf5;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .planner-progress-fill {
            height: 100%;
            width: 0%;
            background: #8b5cf6;
            border-radius: 20px;
            transition: width 0.25s ease;
        }

        .planner-task {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 0;
            border-bottom: 1px solid #f0edf5;
        }

        .planner-task:last-child {
            border-bottom: none;
        }

        .planner-task input {
            width: 17px;
            height: 17px;
            margin-top: 2px;
            accent-color: #8b5cf6;
            cursor: pointer;
            flex-shrink: 0;
        }

        .planner-task label {
            color: #555166;
            font-size: 13px;
            line-height: 1.6;
            cursor: pointer;
        }

        .planner-task.completed label {
            color: #9994a6;
            text-decoration: line-through;
        }

        .planner-disclaimer {
            margin-top: 18px;
            padding: 13px;
            border-radius: 9px;
            background: #fff7e8;
            color: #76521b;
            font-size: 11px;
            line-height: 1.7;
        }

        .planner-complete-message {
            display: none;
            padding: 13px;
            margin-top: 15px;
            border-radius: 9px;
            background: #eaf8f0;
            color: #18794e;
            font-size: 12px;
            font-weight: 700;
        }

        .planner-complete-message.visible {
            display: block;
        }

        .planner-reset {
            margin-top: 18px;
            padding: 10px 15px;
            border: 1px solid #e9e4f1;
            border-radius: 8px;
            background: #ffffff;
            color: #7542df;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }
    `;

    document.head.appendChild(plannerStyles);


    // ==========================================
    // SAFETY PLANNER HTML
    // ==========================================

    plannerPage.innerHTML = `
        <div class="page-heading">
            <p class="eyebrow">PERSONALIZED SAFETY ASSISTANCE</p>
            <h1>Smart Safety Planner</h1>
            <p>
                Create a practical checklist for your upcoming activity
                using SAKHI AI's rule-based recommendation engine.
            </p>
        </div>

        <div class="planner-container">

            <div class="planner-card">

                <h2>Plan your activity</h2>

                <p class="planner-subtitle">
                    Select the details below to generate a personalized
                    preventive safety checklist.
                </p>

                <form id="plannerForm">

                    <label class="planner-label" for="plannerActivity">
                        What are you planning?
                    </label>

                    <select
                        class="planner-select"
                        id="plannerActivity"
                        required
                    >
                        <option value="">Select an activity</option>
                        <option value="commute">Daily Commute</option>
                        <option value="solo_trip">Solo Trip</option>
                        <option value="event">Attending an Event</option>
                        <option value="returning_home">Returning Home</option>
                    </select>


                    <label class="planner-label" for="plannerTransport">
                        How will you travel?
                    </label>

                    <select
                        class="planner-select"
                        id="plannerTransport"
                        required
                    >
                        <option value="">Select transport method</option>
                        <option value="walking">Walking</option>
                        <option value="public_transport">Public Transport</option>
                        <option value="taxi">Taxi / Cab</option>
                        <option value="private_vehicle">Private Vehicle</option>
                        <option value="other">Other</option>
                    </select>


                    <label class="planner-label" for="plannerTime">
                        When will you travel?
                    </label>

                    <select
                        class="planner-select"
                        id="plannerTime"
                        required
                    >
                        <option value="">Select time</option>
                        <option value="day">Daytime</option>
                        <option value="night">Nighttime</option>
                    </select>


                    <button
                        type="submit"
                        class="planner-generate"
                        id="plannerGenerate"
                    >
                        <i data-lucide="sparkles"></i>
                        Generate My Safety Plan
                    </button>

                </form>

                <div
                    class="planner-error"
                    id="plannerError"
                    role="alert"
                ></div>

            </div>


            <div
                class="planner-results planner-card"
                id="plannerResults"
                aria-live="polite"
            >

                <p class="eyebrow">YOUR PERSONALIZED CHECKLIST</p>

                <h2 id="plannerTitle">Your Safety Plan</h2>

                <p class="planner-subtitle">
                    Mark each task as completed as you prepare.
                </p>

                <div class="planner-progress-header">

                    <strong>Preparation progress</strong>

                    <strong id="plannerProgressText">0 / 0 completed</strong>

                </div>

                <div class="planner-progress-track">

                    <div
                        class="planner-progress-fill"
                        id="plannerProgressFill"
                    ></div>

                </div>

                <div id="plannerChecklist"></div>

                <div
                    class="planner-complete-message"
                    id="plannerCompleteMessage"
                >
                    <i data-lucide="check-circle"></i>
                    All checklist tasks have been completed!
                </div>

                <div
                    class="planner-disclaimer"
                    id="plannerDisclaimer"
                ></div>

                <button
                    type="button"
                    class="planner-reset"
                    id="plannerReset"
                >
                    Generate Another Plan
                </button>

            </div>

        </div>
    `;


    // ==========================================
    // ELEMENT REFERENCES
    // ==========================================

    const plannerForm = document.getElementById("plannerForm");
    const plannerActivity = document.getElementById("plannerActivity");
    const plannerTransport = document.getElementById("plannerTransport");
    const plannerTime = document.getElementById("plannerTime");
    const plannerGenerate = document.getElementById("plannerGenerate");
    const plannerError = document.getElementById("plannerError");
    const plannerResults = document.getElementById("plannerResults");
    const plannerTitle = document.getElementById("plannerTitle");
    const plannerChecklist = document.getElementById("plannerChecklist");
    const plannerProgressText = document.getElementById("plannerProgressText");
    const plannerProgressFill = document.getElementById("plannerProgressFill");

    const plannerCompleteMessage = document.getElementById(
        "plannerCompleteMessage"
    );

    const plannerDisclaimer = document.getElementById("plannerDisclaimer");
    const plannerReset = document.getElementById("plannerReset");


    // ==========================================
    // LOCAL STORAGE PERSISTENCE
    // ==========================================

    const PLANNER_STORAGE_KEY = "sakhiSafetyPlannerState";

    function savePlannerState() {
        try {
            const checklist = Array.from(
                plannerChecklist.querySelectorAll(".planner-task")
            ).map(function (taskContainer) {
                const checkbox = taskContainer.querySelector(
                    'input[type="checkbox"]'
                );
                const label = taskContainer.querySelector("label");

                return {
                    id: checkbox ? checkbox.id.replace("plannerTask", "") : "",
                    task: label ? label.textContent : "",
                    completed: checkbox ? checkbox.checked : false
                };
            });

            const hasPlan = plannerResults.classList.contains("visible");

            const state = {
                activity: plannerActivity.value,
                transport: plannerTransport.value,
                time_of_day: plannerTime.value,
                hasPlan: hasPlan,
                title: hasPlan ? plannerTitle.textContent : "",
                checklist: hasPlan ? checklist : [],
                disclaimer: hasPlan ? plannerDisclaimer.textContent : ""
            };

            localStorage.setItem(
                PLANNER_STORAGE_KEY,
                JSON.stringify(state)
            );
        } catch (error) {
            console.warn("SAKHI AI: Unable to save planner progress.", error);
        }
    }


    function loadPlannerState() {
        try {
            const savedState = localStorage.getItem(PLANNER_STORAGE_KEY);

            if (!savedState) {
                return;
            }

            const state = JSON.parse(savedState);

            if (!state || typeof state !== "object") {
                return;
            }

            plannerActivity.value = state.activity || "";
            plannerTransport.value = state.transport || "";
            plannerTime.value = state.time_of_day || "";

            if (state.hasPlan && Array.isArray(state.checklist)) {
                plannerTitle.textContent = state.title || "Your Safety Plan";
                plannerDisclaimer.textContent = state.disclaimer || "";

                renderChecklist(state.checklist);
                plannerResults.classList.add("visible");
            }

        } catch (error) {
            console.warn("SAKHI AI: Unable to restore planner progress.", error);
        }
    }


    // ==========================================
    // CHECKLIST PROGRESS
    // ==========================================

    function updatePlannerProgress() {

        const checkboxes = plannerChecklist.querySelectorAll(
            'input[type="checkbox"]'
        );

        const total = checkboxes.length;

        const completed = plannerChecklist.querySelectorAll(
            'input[type="checkbox"]:checked'
        ).length;

        const percentage = total > 0
            ? (completed / total) * 100
            : 0;

        plannerProgressText.textContent =
            `${completed} / ${total} completed`;

        plannerProgressFill.style.width = `${percentage}%`;

        plannerCompleteMessage.classList.toggle(
            "visible",
            total > 0 && completed === total
        );

    }


    // ==========================================
    // RENDER CHECKLIST
    // ==========================================

    function renderChecklist(checklist) {

        plannerChecklist.innerHTML = "";

        checklist.forEach(function (item) {

            const taskContainer = document.createElement("div");

            taskContainer.className = "planner-task";

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.id = `plannerTask${item.id}`;
            checkbox.checked = Boolean(item.completed);

            const label = document.createElement("label");

            label.htmlFor = checkbox.id;
            label.textContent = item.task;

            taskContainer.classList.toggle(
                "completed",
                checkbox.checked
            );

            checkbox.addEventListener("change", function () {

                taskContainer.classList.toggle(
                    "completed",
                    checkbox.checked
                );

                updatePlannerProgress();
                savePlannerState();

            });

            taskContainer.appendChild(checkbox);
            taskContainer.appendChild(label);
            plannerChecklist.appendChild(taskContainer);

        });

        updatePlannerProgress();

    }


    // ==========================================
    // GENERATE SAFETY PLAN
    // ==========================================

    plannerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        plannerError.textContent = "";
        plannerError.classList.remove("visible");
        plannerResults.classList.remove("visible");

        plannerGenerate.disabled = true;
        plannerGenerate.textContent = "Generating Safety Plan...";

        try {

            const response = await fetch("/api/safety-plan", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    activity: plannerActivity.value,
                    transport: plannerTransport.value,
                    time_of_day: plannerTime.value
                })

            });


            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to generate your safety plan."
                );
            }


            // Display and save generated plan.

            plannerTitle.textContent = data.title;

            renderChecklist(data.checklist || []);

            plannerDisclaimer.textContent = data.disclaimer || "";

            plannerResults.classList.add("visible");

            savePlannerState();

            plannerResults.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


        } catch (error) {

            console.error("Safety Planner error:", error);

            plannerError.textContent = error.message;
            plannerError.classList.add("visible");

        } finally {

            plannerGenerate.disabled = false;

            plannerGenerate.innerHTML =
                '<i data-lucide="sparkles"></i> Generate My Safety Plan';

            if (window.lucide) {
                window.lucide.createIcons();
            }

        }

    });


    // ==========================================
    // RESET PLANNER
    // ==========================================

    plannerReset.addEventListener("click", function () {

        plannerForm.reset();

        plannerResults.classList.remove("visible");
        plannerError.classList.remove("visible");
        plannerChecklist.innerHTML = "";

        try {
            localStorage.removeItem(PLANNER_STORAGE_KEY);
        } catch (error) {
            console.warn("SAKHI AI: Unable to clear saved planner state.", error);
        }

        plannerProgressText.textContent = "0 / 0 completed";
        plannerProgressFill.style.width = "0%";
        plannerCompleteMessage.classList.remove("visible");

        plannerForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });


    // ==========================================
    // INITIALIZE SAVED PLAN AND ICONS
    // ==========================================

    loadPlannerState();

    if (window.lucide) {
        window.lucide.createIcons();
    }

});
