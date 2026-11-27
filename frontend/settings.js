
document.addEventListener("DOMContentLoaded", () => {
    const settingsPage = document.getElementById("settings");

    if (!settingsPage) {
        console.error("SAKHI AI Settings page was not found.");
        return;
    }

    const STORAGE_KEY = "sakhiAppSettings";

    function loadSettings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (error) {
            console.error("Could not load settings:", error);
            return {};
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error("Could not save settings:", error);
            return false;
        }
    }

    // Apply the selected theme.
    function applyTheme(theme) {
        document.body.classList.toggle(
            "sakhi-dark-mode",
            theme === "dark"
        );
    }

    // Update the profile name and avatar.
    function updateProfileDisplay(name) {
        const displayName = name.trim() || "Sakhi";
        const firstLetter = displayName.charAt(0).toUpperCase();

        const welcomeName = document.querySelector(
            ".profile-info strong"
        );

        const profileAvatar = document.querySelector(
            ".profile-avatar"
        );

        if (welcomeName) {
            welcomeName.textContent = `Welcome, ${displayName}`;
        }

        if (profileAvatar) {
            profileAvatar.textContent = firstLetter;
        }
    }

    // Load saved preferences immediately.
    const savedSettings = loadSettings();
    const savedName = savedSettings.displayName || "Sakhi";
    const savedTheme = savedSettings.theme || "light";

    applyTheme(savedTheme);
    updateProfileDisplay(savedName);

    // Build the Settings page.
    settingsPage.innerHTML = `
        <div class="page-heading">
            <p class="eyebrow">PREFERENCES</p>
            <h1>Settings</h1>
            <p>Personalize your SAKHI AI experience.</p>
        </div>

        <div class="sakhi-settings-grid">

            <div class="panel sakhi-settings-card">
                <div class="sakhi-settings-heading">
                    <i data-lucide="user-round"></i>
                    <div>
                        <h2>Profile Settings</h2>
                        <p>Choose how your name appears in the application.</p>
                    </div>
                </div>

                <form id="profileSettingsForm">
                    <label for="sakhiProfileName">Display Name</label>

                    <input
                        type="text"
                        id="sakhiProfileName"
                        maxlength="40"
                        placeholder="Enter your name"
                        required
                    >

                    <button type="submit" class="primary-button">
                        Save Profile
                    </button>

                    <p id="profileSaveMessage"
                       class="settings-message"
                       aria-live="polite"></p>
                </form>
            </div>

            <div class="panel sakhi-settings-card">
                <div class="sakhi-settings-heading">
                    <i data-lucide="palette"></i>
                    <div>
                        <h2>Appearance</h2>
                        <p>Choose the theme you prefer.</p>
                    </div>
                </div>

                <div class="theme-options">
                    <label class="theme-option" for="lightTheme">
                        <input
                            type="radio"
                            name="sakhiTheme"
                            id="lightTheme"
                            value="light"
                        >
                        <span>
                            <i data-lucide="sun"></i>
                            <strong>Light Mode</strong>
                            <small>Bright and comfortable appearance</small>
                        </span>
                    </label>

                    <label class="theme-option" for="darkTheme">
                        <input
                            type="radio"
                            name="sakhiTheme"
                            id="darkTheme"
                            value="dark"
                        >
                        <span>
                            <i data-lucide="moon"></i>
                            <strong>Dark Mode</strong>
                            <small>A darker appearance for low-light use</small>
                        </span>
                    </label>
                </div>

                <p id="themeSaveMessage"
                   class="settings-message"
                   aria-live="polite"></p>
            </div>

            <div class="panel sakhi-settings-card">
                <div class="sakhi-settings-heading">
                    <i data-lucide="shield-check"></i>
                    <div>
                        <h2>Privacy & Security</h2>
                        <p>Quick access to your privacy preference.</p>
                    </div>
                </div>

                <p>
                    Discreet Mode changes the application's display
                    using the existing discreet-mode control.
                </p>

                <button type="button"
                        id="settingsDiscreetButton"
                        class="secondary-button">
                    <i data-lucide="eye-off"></i>
                    Toggle Discreet Mode
                </button>

                <p class="settings-note">
                    This does not hide the application from your browser
                    history or provide emergency protection.
                </p>
            </div>

            <div class="panel sakhi-settings-card">
                <div class="sakhi-settings-heading">
                    <i data-lucide="users"></i>
                    <div>
                        <h2>Trusted Contacts</h2>
                        <p>Manage your emergency contacts.</p>
                    </div>
                </div>

                <p>
                    Add, view, or remove trusted contacts from
                    Emergency Assistance.
                </p>

                <button type="button"
                        id="settingsContactsButton"
                        class="secondary-button">
                    <i data-lucide="phone"></i>
                    Manage Trusted Contacts
                </button>
            </div>

            <div class="panel sakhi-settings-card">
                <div class="sakhi-settings-heading">
                    <i data-lucide="info"></i>
                    <div>
                        <h2>About SAKHI AI</h2>
                        <p>Your personal safety companion.</p>
                    </div>
                </div>

                <p>
                    SAKHI AI is a student project designed to provide
                    safety awareness, educational guidance, and
                    AI-assisted support.
                </p>

                <div class="settings-about-details">
                    <p><strong>Project:</strong> SAKHI AI</p>
                    <p><strong>Full form:</strong> Smart Assistance and
                    Knowledge for Human Independence</p>
                    <p><strong>Version:</strong> Student Prototype</p>
                </div>

                <p class="settings-note">
                    SAKHI AI is not an emergency service and cannot
                    guarantee personal safety. Contact emergency
                    services if you are in immediate danger.
                </p>
            </div>

        </div>
    `;

    // Add Settings and theme styling.
    if (!document.getElementById("sakhiSettingsStyles")) {
        const style = document.createElement("style");
        style.id = "sakhiSettingsStyles";

        style.textContent = `
            .sakhi-settings-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 20px;
                margin-top: 24px;
            }

            .sakhi-settings-card {
                padding: 24px;
            }

            .sakhi-settings-heading {
                display: flex;
                align-items: flex-start;
                gap: 14px;
                margin-bottom: 20px;
            }

            .sakhi-settings-heading > i {
                width: 24px;
                height: 24px;
                color: #9474d4;
                flex-shrink: 0;
            }

            .sakhi-settings-heading h2 {
                margin: 0 0 6px;
            }

            .sakhi-settings-heading p,
            .sakhi-settings-card > p {
                color: #777386;
                line-height: 1.6;
            }

            .sakhi-settings-card form {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .sakhi-settings-card input[type="text"] {
                width: 100%;
                padding: 12px 14px;
                border: 1px solid #ded9e9;
                border-radius: 10px;
                font: inherit;
            }

            .sakhi-settings-card button {
                margin-top: 12px;
            }

            .settings-message {
                min-height: 20px;
                color: #39845b;
                font-size: 14px;
            }

            .settings-note {
                margin-top: 16px;
                font-size: 13px;
                color: #777386;
                line-height: 1.6;
            }

            .settings-about-details {
                padding: 12px 16px;
                background: rgba(148, 116, 212, 0.08);
                border-radius: 10px;
                margin-top: 14px;
            }

            .settings-about-details p {
                line-height: 1.6;
                overflow-wrap: anywhere;
            }

            .theme-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }

            .theme-option {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 14px;
                border: 1px solid #ded9e9;
                border-radius: 12px;
                cursor: pointer;
                transition: border-color 0.2s, background 0.2s;
            }

            .theme-option:has(input:checked) {
                border-color: #9474d4;
                background: rgba(148, 116, 212, 0.09);
            }

            .theme-option input {
                margin-top: 4px;
                accent-color: #9474d4;
            }

            .theme-option span {
                display: flex;
                flex-direction: column;
                gap: 7px;
            }

            .theme-option span i {
                width: 21px;
                height: 21px;
                color: #9474d4;
            }

            .theme-option small {
                color: #777386;
                line-height: 1.4;
            }

            /* SAKHI AI DARK MODE */

            body.sakhi-dark-mode {
                background: #171522 !important;
                color: #f2eff8 !important;
            }

            body.sakhi-dark-mode .main-content,
            body.sakhi-dark-mode .content-area,
            body.sakhi-dark-mode .page {
                background-color: #171522 !important;
                color: #f2eff8 !important;
            }

            body.sakhi-dark-mode .sidebar,
            body.sakhi-dark-mode .topbar {
                background-color: #211e2e !important;
                color: #f2eff8 !important;
                border-color: #393449 !important;
            }

            body.sakhi-dark-mode .panel,
            body.sakhi-dark-mode .feature-card,
            body.sakhi-dark-mode .sakhi-settings-card {
                background-color: #252234 !important;
                color: #f2eff8 !important;
                border-color: #393449 !important;
            }

            body.sakhi-dark-mode h1,
            body.sakhi-dark-mode h2,
            body.sakhi-dark-mode h3,
            body.sakhi-dark-mode h4,
            body.sakhi-dark-mode strong,
            body.sakhi-dark-mode label {
                color: #f2eff8;
            }

            body.sakhi-dark-mode p,
            body.sakhi-dark-mode span,
            body.sakhi-dark-mode .breadcrumb {
                color: #c7c0d5;
            }

            body.sakhi-dark-mode input:not([type="radio"]),
            body.sakhi-dark-mode textarea,
            body.sakhi-dark-mode select {
                background-color: #302b40 !important;
                color: #f2eff8 !important;
                border-color: #514962 !important;
            }

            body.sakhi-dark-mode .theme-option {
                background-color: #302b40;
                border-color: #514962;
            }

            body.sakhi-dark-mode .theme-option:has(input:checked) {
                border-color: #b49ae8;
                background-color: #3b3150;
            }

            body.sakhi-dark-mode .settings-about-details {
                background-color: #302b40;
            }

            body.sakhi-dark-mode .settings-note,
            body.sakhi-dark-mode .theme-option small {
                color: #bdb5cd;
            }

            body.sakhi-dark-mode .nav-item {
                color: #d5cee3;
            }

            body.sakhi-dark-mode .nav-item.active {
                background-color: #403451;
                color: #ffffff;
            }

            body.sakhi-dark-mode .empty-state,
            body.sakhi-dark-mode .feature-placeholder {
                color: #f2eff8;
            }

            @media (max-width: 760px) {
                .sakhi-settings-grid {
                    grid-template-columns: 1fr;
                }

                .theme-options {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // Profile settings.
    const nameInput = document.getElementById("sakhiProfileName");
    const profileForm = document.getElementById("profileSettingsForm");
    const saveMessage = document.getElementById("profileSaveMessage");

    nameInput.value = savedName;

    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const displayName = nameInput.value.trim();

        if (!displayName) {
            saveMessage.textContent = "Please enter a display name.";
            return;
        }

        const updatedSettings = {
            ...loadSettings(),
            displayName
        };

        if (saveSettings(updatedSettings)) {
            updateProfileDisplay(displayName);
            saveMessage.textContent = "Profile saved successfully!";
        } else {
            saveMessage.textContent = "Could not save your profile.";
        }
    });

    // Appearance settings.
    const lightTheme = document.getElementById("lightTheme");
    const darkTheme = document.getElementById("darkTheme");
    const themeMessage = document.getElementById("themeSaveMessage");

    lightTheme.checked = savedTheme !== "dark";
    darkTheme.checked = savedTheme === "dark";

    function changeTheme(theme) {
        applyTheme(theme);

        const updatedSettings = {
            ...loadSettings(),
            theme
        };

        if (saveSettings(updatedSettings)) {
            themeMessage.textContent =
                `${theme === "dark" ? "Dark" : "Light"} Mode saved!`;
        } else {
            themeMessage.textContent = "Could not save theme preference.";
        }
    }

    lightTheme.addEventListener("change", () => {
        if (lightTheme.checked) {
            changeTheme("light");
        }
    });

    darkTheme.addEventListener("change", () => {
        if (darkTheme.checked) {
            changeTheme("dark");
        }
    });

    // Discreet Mode.
    document.getElementById("settingsDiscreetButton")
        .addEventListener("click", () => {
            const discreetButton = document.getElementById("discreetButton");

            if (discreetButton) {
                discreetButton.click();
            } else {
                alert("Discreet Mode control could not be found.");
            }
        });

    // Trusted Contacts.
    document.getElementById("settingsContactsButton")
        .addEventListener("click", () => {
            const emergencyNavButton = document.querySelector(
                '.nav-item[data-page="emergency"]'
            );

            if (emergencyNavButton) {
                emergencyNavButton.click();
            }
        });

    // Render icons.
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
