
document.addEventListener("DOMContentLoaded", function () {
    const scannerPage = document.getElementById("scanner");

    if (!scannerPage) {
        console.error("SAKHI AI: Scanner page element not found.");
        return;
    }

    // ==========================================
    // SCANNER STYLES
    // ==========================================

    const scannerStyles = document.createElement("style");

    scannerStyles.textContent = `
        .scanner-container {
            max-width: 900px;
        }

        .scanner-upload-area.hidden {
            display: none;
        }

        .scanner-card {
            background: #ffffff;
            border: 1px solid #eeeaf5;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
        }

        .scanner-card h2 {
            font-size: 17px;
            margin-bottom: 8px;
        }

        .scanner-subtitle {
            color: #898598;
            font-size: 12px;
            line-height: 1.7;
            margin-bottom: 20px;
        }

        .scanner-upload-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 180px;
            box-sizing: border-box;
            border: 2px dashed #d9cdef;
            border-radius: 13px;
            padding: 30px 15px;
            text-align: center;
            background: #fbfaff;
            cursor: pointer;
            transition: 0.2s;
        }

        .scanner-upload-area i {
            display: block;
            width: 32px;
            height: 32px;
            color: #8b5cf6;
            margin-bottom: 12px;
            flex-shrink: 0;
        }

        .scanner-upload-area:hover {
            border-color: #8b5cf6;
            background: #f8f5ff;
        }

        .scanner-upload-area h3 {
            font-size: 14px;
            margin-bottom: 7px;
        }

        .scanner-upload-area p {
            color: #898598;
            font-size: 11px;
            line-height: 1.6;
        }

        .scanner-file-input {
            display: none;
        }

        .scanner-preview {
            display: none;
            margin-top: 20px;
            text-align: center;
        }

        .scanner-preview.visible {
            display: block;
        }

        .scanner-preview img {
            max-width: 100%;
            max-height: 350px;
            object-fit: contain;
            border-radius: 12px;
            border: 1px solid #eeeaf5;
        }

        .scanner-file-name {
            color: #898598;
            font-size: 11px;
            margin-top: 9px;
            overflow-wrap: anywhere;
        }

        .scanner-actions {
            display: flex;
            gap: 10px;
            margin-top: 18px;
        }

        .scanner-button {
            flex: 1;
            padding: 13px;
            border: none;
            border-radius: 9px;
            background: #8b5cf6;
            color: white;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
        }

        .scanner-button:hover {
            background: #7542df;
        }

        .scanner-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .scanner-clear {
            padding: 13px 18px;
            border: 1px solid #e9e4f1;
            border-radius: 9px;
            background: white;
            color: #7542df;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }

        .scanner-error {
            display: none;
            margin-top: 15px;
            padding: 12px;
            border-radius: 9px;
            background: #fff0ef;
            color: #b42318;
            font-size: 12px;
            line-height: 1.6;
        }

        .scanner-error.visible {
            display: block;
        }

        .scanner-results {
            display: none;
        }

        .scanner-results.visible {
            display: block;
        }

        .scanner-measurements {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin: 18px 0;
        }

        .scanner-metric {
            padding: 15px 10px;
            border: 1px solid #eeeaf5;
            border-radius: 11px;
            background: #fbfaff;
        }

        .scanner-metric p {
            color: #898598;
            font-size: 10px;
            margin-bottom: 7px;
        }

        .scanner-metric strong {
            color: #7542df;
            font-size: 19px;
        }

        .scanner-observation {
            padding: 15px;
            margin-top: 12px;
            border-radius: 10px;
            border: 1px solid #eeeaf5;
            background: #fbfaff;
        }

        .scanner-observation.warning {
            border-left: 4px solid #e6a23c;
            background: #fffaf0;
        }

        .scanner-observation.info {
            border-left: 4px solid #8b5cf6;
        }

        .scanner-observation h3 {
            font-size: 13px;
            margin-bottom: 6px;
        }

        .scanner-observation p {
            color: #777386;
            font-size: 12px;
            line-height: 1.7;
        }

        .scanner-summary {
            padding: 14px;
            border-radius: 10px;
            background: #f1eaff;
            color: #6740bb;
            font-size: 12px;
            line-height: 1.7;
            margin-bottom: 15px;
        }

        .scanner-disclaimer {
            padding: 13px;
            margin-top: 18px;
            border-radius: 9px;
            background: #fff7e8;
            color: #76521b;
            font-size: 11px;
            line-height: 1.7;
        }

        .scanner-image-info {
            color: #898598;
            font-size: 11px;
            margin-top: 8px;
        }

        /* YOLO OBJECT DETECTION */

        .scanner-detection-section {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #eeeaf5;
        }

        .scanner-detection-section h3 {
            font-size: 15px;
            margin-bottom: 8px;
        }

        .scanner-detection-status {
            color: #898598;
            font-size: 12px;
            line-height: 1.7;
            margin-bottom: 15px;
        }

        .scanner-detection-count {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            border-radius: 10px;
            background: #f1eaff;
            color: #6740bb;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 16px;
        }

        .scanner-detection-image {
            display: none;
            width: 100%;
            max-height: 450px;
            object-fit: contain;
            border-radius: 12px;
            border: 1px solid #eeeaf5;
            background: #fbfaff;
            margin-bottom: 18px;
        }

        .scanner-detection-image.visible {
            display: block;
        }

        .scanner-detection-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin-top: 12px;
        }

        .scanner-detection-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border: 1px solid #eeeaf5;
            border-radius: 9px;
            background: #fbfaff;
            font-size: 12px;
        }

        .scanner-detection-item strong {
            color: #7542df;
            overflow-wrap: anywhere;
        }

        .scanner-detection-confidence {
            color: #898598;
            white-space: nowrap;
            font-size: 11px;
        }

        .scanner-detection-empty {
            padding: 14px;
            border-radius: 9px;
            background: #fbfaff;
            color: #777386;
            font-size: 12px;
            line-height: 1.7;
        }

        @media (max-width: 600px) {
            .scanner-measurements {
                grid-template-columns: 1fr;
            }

            .scanner-actions {
                flex-direction: column;
            }

            .scanner-detection-list {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(scannerStyles);

    // ==========================================
    // SCANNER PAGE HTML
    // ==========================================

    scannerPage.innerHTML = `
        <div class="page-heading">
            <p class="eyebrow">COMPUTER VISION + OPENCV + YOLO</p>
            <h1>Hazard Scanner</h1>
            <p>
                Upload an environmental photograph to examine its
                image quality and detect supported visible objects.
            </p>
        </div>

        <div class="scanner-container">

            <div class="scanner-card">

                <h2>Upload an image</h2>

                <p class="scanner-subtitle">
                    Choose a photograph of an environment, road,
                    walkway or other location you want to examine.
                </p>

                <label
                    class="scanner-upload-area"
                    for="scannerFile"
                    id="scannerUploadArea"
                >
                    <i data-lucide="image-plus" size="32"></i>

                    <h3>Choose an image to scan</h3>

                    <p>
                        Click here to select an image from your device.
                        <br>
                        JPG, JPEG, PNG or WEBP — Maximum 5 MB.
                    </p>
                </label>

                <input
                    type="file"
                    id="scannerFile"
                    class="scanner-file-input"
                    accept="image/jpeg,image/png,image/webp"
                >

                <div class="scanner-preview" id="scannerPreview">
                    <img
                        id="scannerPreviewImage"
                        alt="Selected environmental photograph preview"
                    >

                    <p
                        class="scanner-file-name"
                        id="scannerFileName"
                    ></p>
                </div>

                <div class="scanner-actions">
                    <button
                        type="button"
                        class="scanner-button"
                        id="scannerScanButton"
                        disabled
                    >
                        <i data-lucide="scan-search"></i>
                        Analyze Image
                    </button>

                    <button
                        type="button"
                        class="scanner-clear"
                        id="scannerClearButton"
                    >
                        Clear
                    </button>
                </div>

                <div
                    class="scanner-error"
                    id="scannerError"
                    role="alert"
                ></div>

            </div>

            <div
                class="scanner-results scanner-card"
                id="scannerResults"
                aria-live="polite"
            >

                <p class="eyebrow">IMAGE ANALYSIS REPORT</p>

                <h2>Scan Results</h2>

                <p
                    class="scanner-image-info"
                    id="scannerImageInfo"
                ></p>

                <div
                    class="scanner-summary"
                    id="scannerSummary"
                ></div>

                <h3>Image Measurements</h3>

                <div class="scanner-measurements">

                    <div class="scanner-metric">
                        <p>Brightness</p>
                        <strong id="scannerBrightness">--</strong>
                    </div>

                    <div class="scanner-metric">
                        <p>Contrast</p>
                        <strong id="scannerContrast">--</strong>
                    </div>

                    <div class="scanner-metric">
                        <p>Sharpness</p>
                        <strong id="scannerSharpness">--</strong>
                    </div>

                </div>

                <div class="scanner-detection-section">

                    <p class="eyebrow">YOLO COMPUTER VISION</p>

                    <h3>Object Detection Results</h3>

                    <p
                        class="scanner-detection-status"
                        id="scannerDetectionStatus"
                    ></p>

                    <div
                        class="scanner-detection-count"
                        id="scannerDetectionCount"
                    >
                        Objects detected: --
                    </div>

                    <img
                        id="scannerDetectionImage"
                        class="scanner-detection-image"
                        alt="Image annotated with YOLO object detection boxes"
                    >

                    <div
                        id="scannerDetectionList"
                        class="scanner-detection-list"
                    ></div>

                </div>

                <h3 style="margin-top: 24px;">Observations</h3>

                <div id="scannerObservations"></div>

                <div
                    class="scanner-disclaimer"
                    id="scannerDisclaimer"
                ></div>

            </div>

        </div>
    `;

    // ==========================================
    // ELEMENT REFERENCES
    // ==========================================

    const scannerFile = document.getElementById("scannerFile");
    const scannerUploadArea = document.getElementById("scannerUploadArea");
    const scannerPreview = document.getElementById("scannerPreview");
    const scannerPreviewImage = document.getElementById("scannerPreviewImage");
    const scannerFileName = document.getElementById("scannerFileName");

    const scannerScanButton = document.getElementById("scannerScanButton");
    const scannerClearButton = document.getElementById("scannerClearButton");

    const scannerError = document.getElementById("scannerError");
    const scannerResults = document.getElementById("scannerResults");

    const scannerImageInfo = document.getElementById("scannerImageInfo");
    const scannerSummary = document.getElementById("scannerSummary");

    const scannerBrightness = document.getElementById("scannerBrightness");
    const scannerContrast = document.getElementById("scannerContrast");
    const scannerSharpness = document.getElementById("scannerSharpness");

    const scannerObservations = document.getElementById("scannerObservations");
    const scannerDisclaimer = document.getElementById("scannerDisclaimer");

    const scannerDetectionStatus = document.getElementById(
        "scannerDetectionStatus"
    );

    const scannerDetectionCount = document.getElementById(
        "scannerDetectionCount"
    );

    const scannerDetectionImage = document.getElementById(
        "scannerDetectionImage"
    );

    const scannerDetectionList = document.getElementById(
        "scannerDetectionList"
    );

    // ==========================================
    // FILE VALIDATION AND PREVIEW
    // ==========================================

    let selectedImage = null;
    let previewUrl = null;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    scannerFile.addEventListener("change", function () {
        scannerError.textContent = "";
        scannerError.classList.remove("visible");
        scannerResults.classList.remove("visible");

        const file = scannerFile.files[0];

        if (!file) {
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            showError("Please select a JPG, PNG or WEBP image.");
            resetSelectedImage();
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showError("Image size must be smaller than 5 MB.");
            resetSelectedImage();
            return;
        }

        selectedImage = file;

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        previewUrl = URL.createObjectURL(file);

        scannerPreviewImage.src = previewUrl;

        scannerFileName.textContent =
            `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

        scannerPreview.classList.add("visible");

        // Hide upload box after selecting an image.
        scannerUploadArea.classList.add("hidden");

        scannerScanButton.disabled = false;
    });

    // ==========================================
    // DISPLAY ERROR
    // ==========================================

    function showError(message) {
        scannerError.textContent = message;
        scannerError.classList.add("visible");
    }

    // ==========================================
    // RESET IMAGE SELECTION
    // ==========================================

    function resetSelectedImage() {
        selectedImage = null;
        scannerFile.value = "";

        scannerPreview.classList.remove("visible");
        scannerUploadArea.classList.remove("hidden");

        scannerScanButton.disabled = true;

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }

        scannerPreviewImage.removeAttribute("src");
        scannerFileName.textContent = "";
    }

    // ==========================================
    // DISPLAY OBSERVATIONS
    // ==========================================

    function displayObservations(observations) {
        scannerObservations.innerHTML = "";

        observations.forEach(function (observation) {
            const card = document.createElement("div");

            card.className =
                `scanner-observation ${observation.severity || "info"}`;

            const heading = document.createElement("h3");
            heading.textContent = observation.title || "Observation";

            const description = document.createElement("p");
            description.textContent = observation.description || "";

            card.appendChild(heading);
            card.appendChild(description);

            scannerObservations.appendChild(card);
        });
    }

    // ==========================================
    // DISPLAY YOLO OBJECT DETECTION
    // ==========================================

    function displayObjectDetection(detection) {
        scannerDetectionList.innerHTML = "";

        scannerDetectionImage.classList.remove("visible");
        scannerDetectionImage.removeAttribute("src");

        if (!detection) {
            scannerDetectionStatus.textContent =
                "Object detection information was not included in the server response.";

            scannerDetectionCount.textContent = "Objects detected: --";

            scannerDetectionList.textContent =
                "No object detection data is available.";

            return;
        }

        scannerDetectionStatus.textContent =
            detection.message || "Object detection analysis completed.";

        if (!detection.available) {
            scannerDetectionCount.textContent =
                "Object detection unavailable";

            scannerDetectionList.textContent =
                detection.message || "The object detection model is unavailable.";

            return;
        }

        const detections = Array.isArray(detection.detections)
            ? detection.detections
            : [];

        const totalObjects = Number(detection.total_objects) || 0;

        scannerDetectionCount.textContent =
            `Objects detected: ${totalObjects}`;

        // Display annotated image returned by the backend.
        if (
            typeof detection.annotated_image === "string" &&
            detection.annotated_image.length > 0
        ) {
            scannerDetectionImage.src =
                `data:image/jpeg;base64,${detection.annotated_image}`;

            scannerDetectionImage.classList.add("visible");
        }

        if (detections.length === 0) {
            const emptyMessage = document.createElement("div");

            emptyMessage.className = "scanner-detection-empty";

            emptyMessage.textContent =
                "No supported objects were detected above the model's confidence threshold. This does not mean the image contains no objects.";

            scannerDetectionList.appendChild(emptyMessage);

            return;
        }

        detections.forEach(function (item) {
            const detectionItem = document.createElement("div");

            detectionItem.className = "scanner-detection-item";

            const objectName = document.createElement("strong");

            objectName.textContent =
                item.label || "Unknown object";

            const confidence = document.createElement("span");

            confidence.className = "scanner-detection-confidence";

            const confidenceValue = Number(item.confidence);

            confidence.textContent = Number.isFinite(confidenceValue)
                ? `${confidenceValue.toFixed(2)}% confidence`
                : "Confidence unavailable";

            detectionItem.appendChild(objectName);
            detectionItem.appendChild(confidence);

            scannerDetectionList.appendChild(detectionItem);
        });
    }

    // ==========================================
    // IMAGE ANALYSIS REQUEST
    // ==========================================

    scannerScanButton.addEventListener("click", async function () {
        if (!selectedImage) {
            showError("Please select an image first.");
            return;
        }

        scannerError.textContent = "";
        scannerError.classList.remove("visible");

        scannerResults.classList.remove("visible");

        scannerScanButton.disabled = true;
        scannerScanButton.textContent = "Analyzing Image...";

        try {
            const formData = new FormData();

            formData.append("image", selectedImage);

            const response = await fetch("/api/scan-image", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to analyze the image."
                );
            }

            // Display image information.
            scannerImageInfo.textContent =
                `Image dimensions: ${data.image.width} × ${data.image.height} pixels`;

            // Display summary.
            scannerSummary.textContent =
                data.summary || "Image analysis completed.";

            // Display measurements.
            scannerBrightness.textContent =
                data.measurements?.brightness ?? "--";

            scannerContrast.textContent =
                data.measurements?.contrast ?? "--";

            scannerSharpness.textContent =
                data.measurements?.sharpness ?? "--";

            // Display YOLO object detection results.
            displayObjectDetection(data.object_detection);

            // Display observations.
            displayObservations(data.observations || []);

            // Display disclaimer.
            scannerDisclaimer.textContent =
                data.disclaimer || "";

            // Show result card.
            scannerResults.classList.add("visible");

            scannerResults.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } catch (error) {
            console.error("Hazard Scanner error:", error);
            showError(error.message || "An unexpected error occurred.");
        } finally {
            scannerScanButton.disabled = !selectedImage;

            scannerScanButton.innerHTML =
                '<i data-lucide="scan-search"></i> Analyze Image';

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    });

    // ==========================================
    // CLEAR SCANNER
    // ==========================================

    scannerClearButton.addEventListener("click", function () {
        resetSelectedImage();

        scannerResults.classList.remove("visible");

        scannerError.classList.remove("visible");
        scannerError.textContent = "";

        scannerObservations.innerHTML = "";
        scannerSummary.textContent = "";
        scannerImageInfo.textContent = "";
        scannerDisclaimer.textContent = "";

        scannerBrightness.textContent = "--";
        scannerContrast.textContent = "--";
        scannerSharpness.textContent = "--";

        scannerDetectionStatus.textContent = "";
        scannerDetectionCount.textContent = "Objects detected: --";
        scannerDetectionList.innerHTML = "";

        scannerDetectionImage.classList.remove("visible");
        scannerDetectionImage.removeAttribute("src");
    });

    // ==========================================
    // INITIALIZE
    // ==========================================

    if (window.lucide) {
        window.lucide.createIcons();
    }
});