
document.addEventListener("DOMContentLoaded", function () {

    const simulatorPage = document.getElementById("simulator");

    if (!simulatorPage) return;

    const scenarios = [
        {
            category: "TRAVEL SAFETY",
            title: "Someone appears to be following you",
            description: "You are walking home in the evening. You notice someone behind you who seems to be taking the same turns as you.",
            question: "What would be the safest response?",
            options: [
                {
                    text: "Walk directly to your home.",
                    safe: false,
                    feedback: "Going directly home may reveal where you live. Avoid leading an unfamiliar person to your home if you feel followed."
                },
                {
                    text: "Move towards a well-lit, populated place and contact someone you trust.",
                    safe: true,
                    feedback: "Good choice. Move towards a busy shop, public place, or staffed location. Contact someone you trust. If you feel in immediate danger, call 112."
                },
                {
                    text: "Confront the person and demand an explanation.",
                    safe: false,
                    feedback: "Confrontation can escalate an uncomfortable situation. Prioritise distance, a public place, and getting help."
                }
            ],
            tip: "Keep your phone accessible and avoid isolated shortcuts when you feel uncomfortable."
        },
        {
            category: "ONLINE SAFETY",
            title: "You receive threatening messages",
            description: "An unknown account repeatedly sends you unwanted messages and threatens to share your personal information.",
            question: "What should you do?",
            options: [
                {
                    text: "Reply angrily and threaten the person back.",
                    safe: false,
                    feedback: "Responding aggressively can escalate the situation. Avoid engaging with the account."
                },
                {
                    text: "Save evidence, block and report the account, and seek trusted support.",
                    safe: true,
                    feedback: "Good choice. Preserve screenshots and relevant details before blocking or reporting. Do not share passwords, OTPs, or additional personal information."
                },
                {
                    text: "Share your password to prove you have nothing to hide.",
                    safe: false,
                    feedback: "Never share passwords or OTPs. Secure your accounts and enable two-factor authentication."
                }
            ],
            tip: "In India, cybercrime complaints can be reported through cybercrime.gov.in. For immediate danger, call 112."
        },
        {
            category: "TRANSPORT SAFETY",
            title: "Your taxi takes an unexpected route",
            description: "You are travelling in a taxi. You notice the driver has taken a route you do not recognise and you feel uncomfortable.",
            question: "What is a safer next step?",
            options: [
                {
                    text: "Stay silent and assume everything is fine.",
                    safe: false,
                    feedback: "You do not have to ignore your discomfort. Check the route and take reasonable steps to seek help."
                },
                {
                    text: "Check your route, contact someone you trust, and ask to stop at a safe public place if needed.",
                    safe: true,
                    feedback: "Good choice. Share your trip details with someone you trust. If you feel threatened, ask to stop at a populated, well-lit place and contact emergency services."
                },
                {
                    text: "Try to grab the steering wheel.",
                    safe: false,
                    feedback: "Interfering with vehicle controls can cause an accident. Avoid actions that could put you in greater danger."
                }
            ],
            tip: "Before travelling, verify the vehicle and driver details and share your trip information with someone you trust."
        },
        {
            category: "PERSONAL SAFETY",
            title: "A stranger offers you a lift",
            description: "You are waiting for transport. An unfamiliar person offers you a free ride and insists that they are going in your direction.",
            question: "What would be a safer response?",
            options: [
                {
                    text: "Accept because the person seems friendly.",
                    safe: false,
                    feedback: "A friendly appearance does not establish that a stranger or their offer is safe."
                },
                {
                    text: "Politely decline and use a transport option you can verify.",
                    safe: true,
                    feedback: "Good choice. Use a verified transport service or another trusted travel option. You do not owe a stranger an explanation."
                },
                {
                    text: "Share your home address before getting into the vehicle.",
                    safe: false,
                    feedback: "Avoid sharing your home address or unnecessary personal information with an unfamiliar person."
                }
            ],
            tip: "Verify the vehicle and driver details before starting a journey."
        },
        {
            category: "PERSONAL BOUNDARIES",
            title: "Someone takes your photos without permission",
            description: "You are at a public event. Someone nearby repeatedly takes your photographs even after you express discomfort.",
            question: "What can you do?",
            options: [
                {
                    text: "Ignore your discomfort because you are in public.",
                    safe: false,
                    feedback: "Your discomfort matters. Being in a public place does not mean you must ignore behaviour that makes you feel unsafe."
                },
                {
                    text: "Move towards event staff or security and ask for assistance.",
                    safe: true,
                    feedback: "Good choice. Seek help from event organisers or security. Avoid escalating the confrontation if you feel unsafe."
                },
                {
                    text: "Follow the person alone to demand that they delete everything.",
                    safe: false,
                    feedback: "Following someone alone can put you in a vulnerable situation. Seek assistance instead."
                }
            ],
            tip: "If the incident involves harassment or threats, document relevant details when safe and seek appropriate support."
        },
        {
            category: "DIGITAL SAFETY",
            title: "A suspicious link asks for your OTP",
            description: "You receive a message claiming that your bank account will be blocked unless you click a link and enter your banking details and OTP.",
            question: "What should you do?",
            options: [
                {
                    text: "Click the link quickly to avoid account problems.",
                    safe: false,
                    feedback: "Urgent messages can be used in phishing attempts. Do not click suspicious links or enter banking details."
                },
                {
                    text: "Ignore the link and verify the message using your bank's official contact details.",
                    safe: true,
                    feedback: "Good choice. Contact your bank through its official app, website, or verified phone number. Never share your OTP, PIN, or password."
                },
                {
                    text: "Forward your OTP to the sender for verification.",
                    safe: false,
                    feedback: "Never share an OTP. Banks and legitimate support staff should not ask you to disclose it."
                }
            ],
            tip: "If you suspect financial cyber fraud in India, contact your bank immediately and report it through the official cybercrime channels. The cyber fraud helpline is 1930."
        },
        {
            category: "DIGITAL PRIVACY",
            title: "Someone pressures you to share live location",
            description: "A person you recently met repeatedly asks you to share your live location and becomes upset when you refuse.",
            question: "What is a sensible response?",
            options: [
                {
                    text: "Share it because refusing might upset them.",
                    safe: false,
                    feedback: "You are not obligated to share your location. Your privacy and boundaries matter."
                },
                {
                    text: "Decline if uncomfortable and review your location-sharing settings.",
                    safe: true,
                    feedback: "Good choice. Share location only with people you trust and only when you choose to. Review active location-sharing permissions."
                },
                {
                    text: "Share your location permanently so they stop asking.",
                    safe: false,
                    feedback: "Permanent location sharing can expose your movements. You can revoke access whenever you choose."
                }
            ],
            tip: "Periodically review location permissions and active location sharing in your phone and apps."
        },
        {
            category: "PUBLIC SPACE SAFETY",
            title: "You feel uncomfortable in a crowded place",
            description: "You are in a crowded public place. Someone repeatedly invades your personal space and you feel uncomfortable.",
            question: "What could you do?",
            options: [
                {
                    text: "Stay in the same place and hope it stops.",
                    safe: false,
                    feedback: "You can move away from a situation that makes you uncomfortable. You do not need to wait for it to become worse."
                },
                {
                    text: "Move closer to staff, security, or a group of people and ask for help.",
                    safe: true,
                    feedback: "Good choice. Move towards a staffed or safer area and clearly ask for assistance if needed."
                },
                {
                    text: "Leave the venue alone through an isolated exit.",
                    safe: false,
                    feedback: "An isolated exit may leave you with fewer people to help. Consider a staffed, populated exit instead."
                }
            ],
            tip: "Identify exits and staffed help points when entering unfamiliar public venues."
        },
        {
            category: "LOOKING OUT FOR OTHERS",
            title: "Your friend may be in an unsafe situation",
            description: "At an event, your friend appears distressed and tells you that someone is making them uncomfortable.",
            question: "How can you support your friend?",
            options: [
                {
                    text: "Dismiss their concern and tell them not to overreact.",
                    safe: false,
                    feedback: "Listen without judgement. Dismissing their concern may make it harder for them to ask for help."
                },
                {
                    text: "Listen, ask what support they want, and help them reach a safer place.",
                    safe: true,
                    feedback: "Good choice. Respect your friend's choices, stay with them if appropriate, and seek trusted staff or emergency help when needed."
                },
                {
                    text: "Confront the other person aggressively without asking your friend.",
                    safe: false,
                    feedback: "An aggressive confrontation can escalate the situation. Ask your friend what they need and prioritise their safety."
                }
            ],
            tip: "Offer support without blaming or pressuring someone. In an emergency in India, call 112."
        },
        {
            category: "JOURNEY PREPARATION",
            title: "Your phone battery is almost dead",
            description: "You are travelling alone and notice your phone battery is at 3%. You still have some distance to travel.",
            question: "What should you prioritise?",
            options: [
                {
                    text: "Keep watching videos until the battery dies.",
                    safe: false,
                    feedback: "Conserve your remaining battery so you can communicate or seek help if needed."
                },
                {
                    text: "Contact someone you trust with your travel update and conserve battery.",
                    safe: true,
                    feedback: "Good choice. Share your current status and expected arrival if possible. Reduce battery use and consider moving to a staffed public place to arrange charging or transport."
                },
                {
                    text: "Turn off your phone without telling anyone.",
                    safe: false,
                    feedback: "If possible, communicate your status before your battery runs out. Keep a way to seek assistance in mind."
                }
            ],
            tip: "Before travelling, charge your phone and consider carrying a power bank. Keep important emergency numbers accessible."
        }
    ];

    let currentScenario = 0;
    let selectedAnswer = false;
    let score = 0;

    const simulatorStyles = document.createElement("style");

    simulatorStyles.textContent = `
        .simulator-layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 280px;
            gap: 22px;
            align-items: start;
        }

        .simulator-card,
        .simulator-info-card {
            background: #ffffff;
            border: 1px solid #eee8f8;
            border-radius: 19px;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(91, 64, 130, 0.05);
        }

        .simulator-category {
            display: inline-block;
            padding: 7px 12px;
            border-radius: 20px;
            background: #f1eafa;
            color: #76549e;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
        }

        .simulator-progress {
            height: 7px;
            background: #eee8f5;
            border-radius: 10px;
            margin: 20px 0;
            overflow: hidden;
        }

        .simulator-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #a98bd1, #d78bb6);
            border-radius: 10px;
            transition: width 0.3s ease;
        }

        .simulator-card h2 {
            color: #352747;
            margin: 15px 0 10px;
            font-size: 21px;
        }

        .simulator-description {
            color: #786e84;
            line-height: 1.7;
            margin-bottom: 22px;
        }

        .simulator-question {
            color: #49385e;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 13px;
        }

        .simulator-options {
            display: grid;
            gap: 11px;
        }

        .simulator-option {
            width: 100%;
            padding: 15px;
            text-align: left;
            border: 1px solid #e9e1f1;
            border-radius: 12px;
            background: #fdfbff;
            color: #514461;
            font-size: 13px;
            line-height: 1.6;
            cursor: pointer;
            transition: 0.2s ease;
        }

        .simulator-option:hover:not(:disabled) {
            border-color: #ad91d1;
            background: #f7f1fd;
        }

        .simulator-option:disabled {
            cursor: default;
            opacity: 1;
        }

        .simulator-option.correct {
            border-color: #75b995;
            background: #eff9f2;
            color: #286b48;
        }

        .simulator-option.incorrect {
            border-color: #e7a0ae;
            background: #fff3f5;
            color: #a9435b;
        }

        .simulator-feedback {
            display: none;
            margin-top: 18px;
            padding: 16px;
            border-radius: 12px;
            line-height: 1.7;
            font-size: 13px;
        }

        .simulator-feedback.visible {
            display: block;
        }

        .simulator-feedback.good {
            background: #eff9f2;
            color: #286b48;
        }

        .simulator-feedback.try-again {
            background: #fff3f5;
            color: #a9435b;
        }

        .simulator-tip {
            margin-top: 15px;
            padding: 15px;
            border-radius: 12px;
            background: #f5f0fb;
            color: #644c82;
            font-size: 13px;
            line-height: 1.7;
        }

        .simulator-actions {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 20px;
        }

        .simulator-next,
        .simulator-restart {
            padding: 12px 19px;
            border: none;
            border-radius: 11px;
            background: #8564b2;
            color: white;
            font-weight: 700;
            cursor: pointer;
        }

        .simulator-next:disabled {
            background: #c9bdd8;
            cursor: not-allowed;
        }

        .simulator-restart {
            background: #eee7fa;
            color: #684a91;
        }

        .simulator-info-card h3 {
            color: #47345f;
            margin-bottom: 13px;
        }

        .simulator-info-card p,
        .simulator-info-card li {
            color: #7b7188;
            font-size: 13px;
            line-height: 1.8;
        }

        .simulator-info-card ul {
            padding-left: 19px;
        }

        .simulator-score {
            margin-top: 15px;
            padding: 14px;
            border-radius: 12px;
            background: #f7f2fc;
            color: #674d88;
            font-size: 13px;
            font-weight: 700;
        }

        .simulator-complete {
            text-align: center;
            padding: 30px 10px;
        }

        .simulator-complete h2 {
            color: #49345f;
        }

        .simulator-complete p {
            color: #786e84;
            line-height: 1.7;
        }

        @media (max-width: 850px) {
            .simulator-layout {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 550px) {
            .simulator-card,
            .simulator-info-card {
                padding: 18px;
            }

            .simulator-actions {
                flex-direction: column;
            }

            .simulator-actions button {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(simulatorStyles);

    simulatorPage.innerHTML = `
        <div class="page-heading">
            <p class="eyebrow">SAFETY EDUCATION</p>
            <h1>Safety Simulator</h1>
            <p>
                Explore hypothetical situations and practise choosing
                safer responses.
            </p>
        </div>

        <div class="simulator-layout">

            <div class="simulator-card" id="simulatorMainCard"></div>

            <aside class="simulator-info-card">
                <h3>How it works</h3>
                <p>
                    Read each hypothetical situation and choose the
                    response you think is safest.
                </p>

                <ul>
                    <li>Explore realistic situations.</li>
                    <li>Learn from each response.</li>
                    <li>Review practical safety tips.</li>
                </ul>

                <div class="simulator-score" id="simulatorScore">
                    Correct choices: 0 / ${scenarios.length}
                </div>

                <p style="margin-top:15px;">
                    Remember: every real situation is different.
                    Prioritise your judgement and seek help when needed.
                </p>
            </aside>

        </div>

        <p class="small-disclaimer" style="margin-top:18px;">
            Educational simulation only. These scenarios do not predict
            danger or replace professional or emergency assistance.
            In India, call 112 for immediate emergencies.
        </p>
    `;

    const mainCard = document.getElementById("simulatorMainCard");
    const scoreDisplay = document.getElementById("simulatorScore");

    function renderScenario() {

        selectedAnswer = false;

        const scenario = scenarios[currentScenario];

        const progress =
            ((currentScenario + 1) / scenarios.length) * 100;

        mainCard.innerHTML = `
            <span class="simulator-category">
                ${scenario.category}
            </span>

            <div class="simulator-progress">
                <div
                    class="simulator-progress-fill"
                    style="width:${progress}%"
                ></div>
            </div>

            <p style="color:#8a7d96;font-size:12px;">
                SCENARIO ${currentScenario + 1} OF ${scenarios.length}
            </p>

            <h2>${scenario.title}</h2>

            <p class="simulator-description">
                ${scenario.description}
            </p>

            <p class="simulator-question">
                ${scenario.question}
            </p>

            <div class="simulator-options">
                ${scenario.options.map((option, index) => `
                    <button
                        type="button"
                        class="simulator-option"
                        data-option="${index}"
                    >
                        ${String.fromCharCode(65 + index)}.
                        ${option.text}
                    </button>
                `).join("")}
            </div>

            <div
                class="simulator-feedback"
                id="simulatorFeedback"
                aria-live="polite"
            ></div>

            <div
                class="simulator-tip"
                id="simulatorTip"
                style="display:none;"
            ></div>

            <div class="simulator-actions">
                <button
                    type="button"
                    class="simulator-restart"
                    id="simulatorRestart"
                >
                    Restart
                </button>

                <button
                    type="button"
                    class="simulator-next"
                    id="simulatorNext"
                    disabled
                >
                    ${currentScenario === scenarios.length - 1
                        ? "View Results"
                        : "Next Scenario"}
                </button>
            </div>
        `;

        mainCard.querySelectorAll(".simulator-option")
            .forEach(button => {
                button.addEventListener("click", function () {
                    chooseAnswer(Number(this.dataset.option));
                });
            });

        document.getElementById("simulatorNext")
            .addEventListener("click", nextScenario);

        document.getElementById("simulatorRestart")
            .addEventListener("click", restartSimulation);

        updateScore();
    }

    function chooseAnswer(optionIndex) {

        if (selectedAnswer) return;

        selectedAnswer = true;

        const scenario = scenarios[currentScenario];
        const selectedOption = scenario.options[optionIndex];

        const buttons = mainCard.querySelectorAll(".simulator-option");
        const feedback = document.getElementById("simulatorFeedback");
        const tip = document.getElementById("simulatorTip");
        const nextButton = document.getElementById("simulatorNext");

        buttons.forEach((button, index) => {

            button.disabled = true;

            if (scenario.options[index].safe) {
                button.classList.add("correct");
            } else if (index === optionIndex) {
                button.classList.add("incorrect");
            }

        });

        if (selectedOption.safe) {
            score++;
            feedback.className = "simulator-feedback visible good";
            feedback.textContent = "✓ Good choice! " + selectedOption.feedback;
        } else {
            feedback.className = "simulator-feedback visible try-again";
            feedback.textContent = "Let's learn from this. " + selectedOption.feedback;
        }

        tip.style.display = "block";
        tip.textContent = "SAKHI SAFETY TIP: " + scenario.tip;

        nextButton.disabled = false;

        updateScore();
    }

    function updateScore() {
        scoreDisplay.textContent =
            "Correct choices: " + score + " / " + scenarios.length;
    }

    function nextScenario() {

        if (currentScenario < scenarios.length - 1) {
            currentScenario++;
            renderScenario();
        } else {
            showResults();
        }
    }

    function showResults() {

        let message = "";

        if (score === scenarios.length) {
            message = "Excellent! You selected the safer response in every scenario.";
        } else if (score >= Math.ceil(scenarios.length * 0.7)) {
            message = "Good effort! Review the feedback to strengthen your safety knowledge.";
        } else {
            message = "Every scenario is a learning opportunity. Review the guidance and try again.";
        }

        mainCard.innerHTML = `
            <div class="simulator-complete">
                <span class="simulator-category">
                    SIMULATION COMPLETE
                </span>

                <h2 style="margin-top:20px;">Well done!</h2>

                <h1 style="font-size:38px;color:#8564b2;">
                    ${score} / ${scenarios.length}
                </h1>

                <p>${message}</p>

                <button
                    type="button"
                    class="simulator-next"
                    id="simulatorPlayAgain"
                    style="margin-top:18px;"
                >
                    Play Again
                </button>
            </div>
        `;

        document.getElementById("simulatorPlayAgain")
            .addEventListener("click", restartSimulation);
    }

    function restartSimulation() {
        currentScenario = 0;
        score = 0;
        renderScenario();
    }

    renderScenario();

});
