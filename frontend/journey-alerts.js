
document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "sakhiEmergencyContacts";
    const CHECK_INTERVAL = 15000;

    let checking = false;
    let currentJourneyId = null;

    // Read trusted contacts saved by emergency.js.
    function getTrustedContact() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const contacts = saved ? JSON.parse(saved) : [];

            if (!Array.isArray(contacts)) {
                return null;
            }

            return contacts.find(contact =>
                contact &&
                typeof contact.name === "string" &&
                typeof contact.phone === "string"
            ) || null;

        } catch (error) {
            console.error("Could not read trusted contacts:", error);
            return null;
        }
    }

    // Display the demo alert inside Journey Guardian.
    function displayDemoAlert(alert) {

        const statusContent = document.getElementById(
            "journeyStatusContent"
        );

        if (!statusContent || !alert) {
            return;
        }

        let alertBox = document.getElementById(
            "journeyDemoAlert"
        );

        if (!alertBox) {
            alertBox = document.createElement("div");
            alertBox.id = "journeyDemoAlert";
            alertBox.className = "journey-demo-alert";

            alertBox.style.cssText = `
                margin-top: 22px;
                padding: 18px;
                border-radius: 14px;
                border: 1px solid #e8a1ad;
                background: #fff0f2;
                color: #71313d;
            `;

            statusContent.appendChild(alertBox);
        }

        alertBox.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = "⚠ Trusted Contact Demo Alert";

        const status = document.createElement("p");
        status.textContent = "Demo alert generated successfully.";

        const contact = document.createElement("p");
        contact.textContent =
            "Contact: " + alert.contact_name +
            " (" + alert.contact_phone + ")";

        const destination = document.createElement("p");
        destination.textContent =
            "Destination: " + alert.destination;

        const message = document.createElement("p");
        message.textContent = alert.message;

        const disclaimer = document.createElement("small");
        disclaimer.textContent =
            "Simulation only. No SMS, WhatsApp message, or phone call was sent.";

        alertBox.append(
            heading,
            status,
            contact,
            destination,
            message,
            disclaimer
        );
    }

    // Check the active journey and generate an alert if eligible.
    async function checkJourneyAlert() {

        if (checking) {
            return;
        }

        checking = true;

        try {

            const journeyResponse = await fetch(
                "/api/journeys/active"
            );

            if (!journeyResponse.ok) {
                throw new Error("Could not check active journey.");
            }

            const journeyData = await journeyResponse.json();
            const journey = journeyData.journey;

            const existingBox = document.getElementById(
                "journeyDemoAlert"
            );

            if (!journey) {
                currentJourneyId = null;

                if (existingBox) {
                    existingBox.remove();
                }

                return;
            }

            currentJourneyId = journey.id;

            // First check whether an alert already exists.
            const alertResponse = await fetch(
                `/api/journeys/${journey.id}/demo-alert`
            );

            if (!alertResponse.ok) {
                throw new Error("Could not check existing demo alert.");
            }

            const alertData = await alertResponse.json();

            if (alertData.alert) {
                displayDemoAlert(alertData.alert);
                return;
            }

            // No existing alert: get the first saved trusted contact.
            const contact = getTrustedContact();

            if (!contact) {
                return;
            }

            // The backend enforces the five-minute grace period.
            const response = await fetch(
                `/api/journeys/${journey.id}/demo-alert`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        contact_name: contact.name,
                        contact_phone: contact.phone
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Could not generate demo alert."
                );
            }

            if (result.alert_created && result.alert) {
                displayDemoAlert(result.alert);
            }

        } catch (error) {

            console.error(
                "Journey demo alert error:",
                error
            );

        } finally {
            checking = false;
        }
    }

    // Check immediately and then every 15 seconds.
    checkJourneyAlert();

    setInterval(checkJourneyAlert, CHECK_INTERVAL);

});
