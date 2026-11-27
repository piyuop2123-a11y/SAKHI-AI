
# ==========================================
# SAKHI AI - ADVANCED HAZARD SCANNER ENGINE
# ==========================================

import cv2
import numpy as np
import base64

# YOLO is optional until the dependency is installed.
try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO = None
    YOLO_AVAILABLE = False


# ==========================================
# YOLO MODEL CONFIGURATION
# ==========================================

MODEL_NAME = "yolov8n.pt"
CONFIDENCE_THRESHOLD = 0.35

# Load the model only once, not for every image.
yolo_model = None
model_load_error = None


def load_yolo_model():

    global yolo_model, model_load_error

    if not YOLO_AVAILABLE:
        return None

    if yolo_model is not None:
        return yolo_model

    if model_load_error is not None:
        return None

    try:
        print("Loading YOLO object detection model...")

        yolo_model = YOLO(MODEL_NAME)

        print("YOLO model loaded successfully.")

        return yolo_model

    except Exception as error:

        model_load_error = str(error)

        print("YOLO model could not be loaded:", error)

        return None


# ==========================================
# OBJECT DETECTION
# ==========================================

def detect_objects(image):

    """
    Detect common visible objects using a
    pre-trained YOLO model.

    Detection does not determine whether an
    object or person is dangerous.
    """

    model = load_yolo_model()

    if model is None:

        if not YOLO_AVAILABLE:
            message = (
                "YOLO is not installed. Install ultralytics "
                "to enable object detection."
            )
        else:
            message = (
                "The YOLO model could not be loaded. "
                "Check your internet connection and model installation."
            )

        return {
            "available": False,
            "message": message,
            "detections": [],
            "total_objects": 0,
            "annotated_image": None
        }

    try:

        results = model.predict(
            source=image,
            conf=CONFIDENCE_THRESHOLD,
            verbose=False
        )

        result = results[0]

        detections = []

        annotated_image = image.copy()

        if result.boxes is not None:

            for box in result.boxes:

                coordinates = (
                    box.xyxy[0].cpu().numpy().astype(int)
                )

                x1, y1, x2, y2 = coordinates.tolist()

                confidence = float(
                    box.conf[0].cpu().item()
                )

                class_id = int(
                    box.cls[0].cpu().item()
                )

                class_name = result.names[class_id]

                detections.append({

                    "label": class_name,

                    "confidence": round(
                        confidence * 100, 2
                    ),

                    "bounding_box": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2
                    }

                })

                # Draw a bounding box.

                cv2.rectangle(
                    annotated_image,
                    (x1, y1),
                    (x2, y2),
                    (150, 90, 245),
                    2
                )

                # Add object label.

                label = (
                    f"{class_name} "
                    f"{confidence * 100:.1f}%"
                )

                text_y = max(y1 - 10, 20)

                cv2.putText(
                    annotated_image,
                    label,
                    (x1, text_y),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    (150, 90, 245),
                    2,
                    cv2.LINE_AA
                )

        # Convert annotated image to JPEG and Base64.

        max_width = 1280

        display_image = annotated_image.copy()

        if display_image.shape[1] > max_width:

            scale = max_width / display_image.shape[1]

            new_width = max_width

            new_height = int(
                display_image.shape[0] * scale
            )

            display_image = cv2.resize(
                display_image,
                (new_width, new_height)
            )

        success, encoded_image = cv2.imencode(
            ".jpg",
            display_image,
            [cv2.IMWRITE_JPEG_QUALITY, 85]
        )

        annotated_base64 = None

        if success:

            annotated_base64 = base64.b64encode(
                encoded_image.tobytes()
            ).decode("utf-8")

        return {

            "available": True,

            "message": (
                "Object detection completed successfully."
            ),

            "total_objects": len(detections),

            "detections": detections,

            "annotated_image": annotated_base64

        }

    except Exception as error:

        return {

            "available": False,

            "message": (
                f"Object detection failed: {str(error)}"
            ),

            "total_objects": 0,

            "detections": [],

            "annotated_image": None

        }


# ==========================================
# IMAGE ANALYSIS
# ==========================================

def analyze_image(image_bytes):

    """
    Analyze an uploaded image using OpenCV
    and a pre-trained YOLO object detector.

    Measures:
        1. Brightness
        2. Contrast
        3. Sharpness
        4. Common visible object detection

    These measurements and detections do not
    determine whether a location is safe.
    """

    if not image_bytes:

        return {
            "error": "No image was provided."
        }

    try:

        # Convert uploaded bytes into an OpenCV image.

        image_array = np.frombuffer(
            image_bytes,
            dtype=np.uint8
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

        if image is None:

            return {
                "error": (
                    "Invalid image. Please upload a valid image."
                )
            }

        height, width = image.shape[:2]

        if width < 50 or height < 50:

            return {
                "error": "Image is too small to analyze."
            }

        # Convert image into grayscale.

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        # ======================================
        # 1. BRIGHTNESS ANALYSIS
        # ======================================

        brightness = float(
            np.mean(gray)
        )

        # ======================================
        # 2. CONTRAST ANALYSIS
        # ======================================

        contrast = float(
            np.std(gray)
        )

        # ======================================
        # 3. SHARPNESS ANALYSIS
        # ======================================

        laplacian = cv2.Laplacian(
            gray,
            cv2.CV_64F
        )

        sharpness = float(
            laplacian.var()
        )

        # ======================================
        # 4. OBJECT DETECTION
        # ======================================

        object_results = detect_objects(image)

        detections = object_results["detections"]

        # ======================================
        # GENERATE OBSERVATIONS
        # ======================================

        observations = []

        # Brightness observations.

        if brightness < 65:

            observations.append({
                "type": "low_light",
                "severity": "warning",
                "title": "Low image brightness",
                "description": (
                    "The uploaded image has relatively low average "
                    "brightness. Some environmental details may "
                    "be difficult to see."
                )
            })

        elif brightness > 220:

            observations.append({
                "type": "high_brightness",
                "severity": "info",
                "title": "High image brightness",
                "description": (
                    "The image is very bright. Some details may "
                    "be difficult to distinguish because of "
                    "overexposure."
                )
            })

        else:

            observations.append({
                "type": "brightness_normal",
                "severity": "info",
                "title": "Moderate image brightness",
                "description": (
                    "The image has a moderate average brightness level."
                )
            })

        # Contrast observations.

        if contrast < 25:

            observations.append({
                "type": "low_contrast",
                "severity": "warning",
                "title": "Low image contrast",
                "description": (
                    "The image has limited contrast. Objects and "
                    "environmental details may be difficult to distinguish."
                )
            })

        else:

            observations.append({
                "type": "contrast_adequate",
                "severity": "info",
                "title": "Image contrast",
                "description": (
                    "The image has a measurable difference between "
                    "lighter and darker areas."
                )
            })

        # Sharpness observations.

        if sharpness < 50:

            observations.append({
                "type": "possible_blur",
                "severity": "warning",
                "title": "Possible image blur",
                "description": (
                    "The image may be blurry or lack fine visual details. "
                    "Consider uploading a clearer photograph."
                )
            })

        else:

            observations.append({
                "type": "sharp_image",
                "severity": "info",
                "title": "Image sharpness",
                "description": (
                    "The image contains measurable edge detail."
                )
            })

        # Object detection observations.

        if object_results["available"]:

            if detections:

                detected_names = sorted(set(
                    item["label"] for item in detections
                ))

                observations.append({
                    "type": "objects_detected",
                    "severity": "info",
                    "title": "Visible objects detected",
                    "description": (
                        "The computer vision model detected: "
                        + ", ".join(detected_names)
                        + ". These are visual detections only and "
                        "do not indicate danger."
                    )
                })

            else:

                observations.append({
                    "type": "no_objects_detected",
                    "severity": "info",
                    "title": "No supported objects detected",
                    "description": (
                        "The model did not detect objects from its "
                        "supported categories with sufficient confidence. "
                        "This does not mean the image contains no objects."
                    )
                })

        # ======================================
        # FINAL RESULT
        # ======================================

        warnings = [
            item for item in observations
            if item["severity"] == "warning"
        ]

        return {

            "success": True,

            "image": {
                "width": width,
                "height": height
            },

            "measurements": {
                "brightness": round(brightness, 2),
                "contrast": round(contrast, 2),
                "sharpness": round(sharpness, 2)
            },

            "object_detection": object_results,

            "summary": (
                "Some image quality or visibility concerns were observed."
                if warnings
                else "No major image quality warnings were detected."
            ),

            "warning_count": len(warnings),

            "observations": observations,

            "disclaimer": (
                "This tool analyzes image brightness, contrast, "
                "sharpness and visible objects using computer vision. "
                "Object detection is limited to categories supported "
                "by the pre-trained model. It does not identify people, "
                "determine intentions, detect every environmental hazard, "
                "determine whether a location is safe, or predict "
                "real-world danger. Results may be affected by image "
                "quality, lighting and model limitations."
            )

        }

    except Exception as error:

        return {
            "error": f"Image analysis failed: {str(error)}"
        }


# ==========================================
# TEST THE HAZARD SCANNER
# ==========================================

if __name__ == "__main__":

    print("\n================================")
    print("   SAKHI AI ADVANCED HAZARD SCANNER")
    print("================================")

    print("\nScanner engine loaded successfully.")

    print("OpenCV version:", cv2.__version__)

    print("NumPy version:", np.__version__)

    print("\nSupported analysis:")
    print("1. Image brightness")
    print("2. Image contrast")
    print("3. Image sharpness")
    print("4. YOLO object detection")

    if YOLO_AVAILABLE:
        print("\nYOLO package: Installed")
        print("Model:", MODEL_NAME)
        print("The model will load when the first image is analyzed.")
    else:
        print("\nYOLO package: Not installed")
        print("Install it using: py -m pip install ultralytics")

    print("\nHazard Scanner engine is ready.")
