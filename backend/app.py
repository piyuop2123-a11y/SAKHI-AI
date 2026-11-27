
import json
from datetime import datetime, timedelta
from pathlib import Path

from flask import (
    Flask,
    jsonify,
    request,
    send_from_directory
)

from werkzeug.exceptions import RequestEntityTooLarge

from config import (
    SECRET_KEY,
    SQLALCHEMY_DATABASE_URI,
    SQLALCHEMY_TRACK_MODIFICATIONS
)

from database import db, Journey, AnalysisHistory
from journey_alerts import journey_alerts_bp
from ai_engine import analyze_text
from expert_system import get_safety_advice, get_safety_plan
from scanner_engine import analyze_image
from gemini_ai import get_gemini_response

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"
DATA_DIR = BASE_DIR / "data"

DATA_DIR.mkdir(exist_ok=True)

app = Flask(__name__)

app.config["SECRET_KEY"] = SECRET_KEY
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = (
    SQLALCHEMY_TRACK_MODIFICATIONS
)

# Limit uploaded images to 5 MB.
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

db.init_app(app)
app.register_blueprint(journey_alerts_bp)


# ==========================================
# FRONTEND ROUTES
# ==========================================

@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:filename>")
def frontend_files(filename):

    allowed_files = {
    "style.css",
    "script.js",
    "history.js",
    "planner.js",
    "scanner.js",
    "chatbot.js",
    "emergency.js",
    "simulator.js",
    "settings.js",
    "journey-alerts.js"
   
}

    if filename not in allowed_files:
        return jsonify({"error": "File not found"}), 404

    return send_from_directory(FRONTEND_DIR, filename)


@app.route("/health")
def health():

    return jsonify({
        "application": "SAKHI AI",
        "status": "healthy"
    })


# ==========================================
# JOURNEY GUARDIAN API
# ==========================================

@app.route("/api/journeys", methods=["POST"])
def start_journey():

    data = request.get_json(silent=True) or {}

    start_location = str(
        data.get("start_location", "")
    ).strip()

    destination = str(
        data.get("destination", "")
    ).strip()

    expected_minutes = data.get("expected_minutes")

    if not start_location or not destination:

        return jsonify({
            "error": "Please enter both starting point and destination."
        }), 400

    try:
        expected_minutes = int(expected_minutes)

    except (TypeError, ValueError):

        return jsonify({
            "error": "Please enter a valid journey duration."
        }), 400

    if expected_minutes < 1 or expected_minutes > 1440:

        return jsonify({
            "error": "Journey duration must be between 1 and 1440 minutes."
        }), 400

    existing_journey = Journey.query.filter(
        Journey.status.in_(["active", "overdue"])
    ).order_by(Journey.id.desc()).first()

    if existing_journey:

        return jsonify({
            "error": "Please complete your current journey first."
        }), 409

    started_at = datetime.utcnow()

    expected_arrival = (
        started_at + timedelta(minutes=expected_minutes)
    )

    journey = Journey(
        start_location=start_location,
        destination=destination,
        expected_minutes=expected_minutes,
        started_at=started_at,
        expected_arrival=expected_arrival,
        status="active"
    )

    db.session.add(journey)
    db.session.commit()

    return jsonify({
        "message": "Journey started successfully.",
        "journey": journey.to_dict()
    }), 201


@app.route("/api/journeys/active", methods=["GET"])
def get_active_journey():

    journey = Journey.query.filter(
        Journey.status.in_(["active", "overdue"])
    ).order_by(Journey.id.desc()).first()

    if journey is None:
        return jsonify({"journey": None})

    if (
        journey.status == "active"
        and datetime.utcnow() >= journey.expected_arrival
    ):

        journey.status = "overdue"
        db.session.commit()

    return jsonify({"journey": journey.to_dict()})


@app.route(
    "/api/journeys/<int:journey_id>/complete",
    methods=["POST"]
)
def complete_journey(journey_id):

    journey = db.session.get(Journey, journey_id)

    if journey is None:

        return jsonify({
            "error": "Journey not found."
        }), 404

    if journey.status not in ["active", "overdue"]:

        return jsonify({
            "error": "This journey has already been completed or cancelled."
        }), 409

    journey.status = "completed"
    journey.arrived_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Arrival confirmed. Journey completed.",
        "journey": journey.to_dict()
    })


# ==========================================
# AI SITUATION ANALYZER API
# ==========================================

@app.route("/api/analyze", methods=["POST"])
def analyze_situation():

    data = request.get_json(silent=True) or {}

    user_text = data.get("text", "")

    result = analyze_text(user_text)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200


# ==========================================
# SAKHI AI CHATBOT API
# ==========================================

@app.route("/api/chat", methods=["POST"])
def chat_with_sakhi():

    data = request.get_json(silent=True) or {}

    message = data.get("message", "")
    chat_history = data.get("history", [])

    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "success": False,
            "error": "Please enter a message."
        }), 400

    if len(message) > 5000:
        return jsonify({
            "success": False,
            "error": "Message must be 5000 characters or fewer."
        }), 400

    if not isinstance(chat_history, list):
        chat_history = []

    # Keep only recent, valid conversation messages.
    valid_history = []

    for item in chat_history[-10:]:
        if not isinstance(item, dict):
            continue

        role = item.get("role")
        content = item.get("content")

        if (
            role in ("user", "assistant")
            and isinstance(content, str)
            and content.strip()
        ):
            valid_history.append({
                "role": role,
                "content": content[:5000]
            })

    result = get_gemini_response(
        message.strip(),
        valid_history
    )

    if not result.get("success"):
        return jsonify(result), 503

    return jsonify(result), 200

# ==========================================
# EXPERT SYSTEM API
# ==========================================

@app.route("/api/safety-advice", methods=["POST"])
def safety_advice():

    data = request.get_json(silent=True) or {}

    user_text = data.get("text", "")

    if not isinstance(user_text, str) or not user_text.strip():

        return jsonify({
            "error": "Please enter a situation."
        }), 400

    result = get_safety_advice(user_text)

    return jsonify(result), 200


# ==========================================
# SMART SAFETY PLANNER API
# ==========================================

@app.route("/api/safety-plan", methods=["POST"])
def create_safety_plan():

    data = request.get_json(silent=True) or {}

    activity = data.get("activity", "")
    transport = data.get("transport", "")
    time_of_day = data.get("time_of_day", "")

    if not all(
        isinstance(value, str) and value.strip()
        for value in [activity, transport, time_of_day]
    ):

        return jsonify({
            "error": "Please select an activity, transport method, and time."
        }), 400

    result = get_safety_plan(
        activity=activity,
        transport=transport,
        time_of_day=time_of_day
    )

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200


# ==========================================
# HAZARD SCANNER API
# ==========================================

@app.route("/api/scan-image", methods=["POST"])
def scan_image():

    # Check whether an image was uploaded.

    if "image" not in request.files:

        return jsonify({
            "error": "Please upload an image."
        }), 400

    uploaded_file = request.files["image"]

    if not uploaded_file.filename:

        return jsonify({
            "error": "No image was selected."
        }), 400

    # Check permitted image extensions.

    allowed_extensions = {
        "jpg",
        "jpeg",
        "png",
        "webp"
    }

    extension = uploaded_file.filename.rsplit(
        ".",
        1
    )[-1].lower() if "." in uploaded_file.filename else ""

    if extension not in allowed_extensions:

        return jsonify({
            "error": "Please upload a JPG, JPEG, PNG, or WEBP image."
        }), 400

    # Read the image into memory.
    # The uploaded image is not saved to disk.

    image_bytes = uploaded_file.read()

    if not image_bytes:

        return jsonify({
            "error": "The uploaded image is empty."
        }), 400

    # Analyze the image using OpenCV.

    result = analyze_image(image_bytes)

    if "error" in result:

        return jsonify(result), 400

    return jsonify(result), 200


@app.errorhandler(RequestEntityTooLarge)
def handle_large_upload(error):

    return jsonify({
        "error": "Image is too large. Please upload an image smaller than 5 MB."
    }), 413


# ==========================================
# INCIDENT HISTORY API
# ==========================================

@app.route("/api/history", methods=["POST"])
def save_analysis_history():

    data = request.get_json(silent=True) or {}

    description = data.get("description", "")
    analysis = data.get("analysis", {})
    advice = data.get("advice", {})

    if not isinstance(description, str) or not description.strip():

        return jsonify({
            "error": "A valid situation description is required."
        }), 400

    if len(description) > 2000:

        return jsonify({
            "error": "Description must be 2000 characters or fewer."
        }), 400

    if not isinstance(analysis, dict) or not isinstance(advice, dict):

        return jsonify({
            "error": "Analysis and advice results are required."
        }), 400

    category = analysis.get("category")

    if not isinstance(category, str) or not category.strip():

        return jsonify({
            "error": "The ML model did not return a valid category.",
            "received_category": category
        }), 400

    category = category.strip()

    if len(category) > 30:

        return jsonify({
            "error": "The analysis category is too long.",
            "received_category": category
        }), 400

    confidence = analysis.get(
        "confidence_percent",
        analysis.get("confidence")
    )

    try:
        confidence = float(confidence)

    except (TypeError, ValueError):

        return jsonify({
            "error": "Invalid confidence value.",
            "received_confidence": confidence
        }), 400

    if 0 <= confidence <= 1:
        confidence = confidence * 100

    if not 0 <= confidence <= 100:

        return jsonify({
            "error": "Confidence must be between 0 and 100.",
            "received_confidence": confidence
        }), 400

    expert_title = advice.get("title", "Safety advice")

    suggestions = advice.get("suggestions", [])
    conditions = advice.get("matched_conditions", [])

    if not isinstance(suggestions, list):
        suggestions = []

    if not isinstance(conditions, list):
        conditions = []

    try:

        record = AnalysisHistory(
            description=description.strip(),
            category=category,
            confidence=confidence,
            expert_title=str(expert_title)[:200],
            expert_suggestions=json.dumps(suggestions),
            matched_conditions=json.dumps(conditions)
        )

        db.session.add(record)
        db.session.commit()

        return jsonify({
            "message": "Analysis saved to Incident History.",
            "record": record.to_dict()
        }), 201

    except Exception as error:

        db.session.rollback()

        app.logger.exception(
            "Incident History database save failed."
        )

        return jsonify({
            "error": "Database error while saving analysis.",
            "details": str(error)
        }), 500


@app.route("/api/history", methods=["GET"])
def get_analysis_history():

    records = AnalysisHistory.query.order_by(
        AnalysisHistory.created_at.desc()
    ).all()

    history = []

    for record in records:

        item = record.to_dict()

        try:

            item["expert_suggestions"] = json.loads(
                item["expert_suggestions"]
            )

        except (TypeError, ValueError):

            item["expert_suggestions"] = []

        try:

            item["matched_conditions"] = json.loads(
                item["matched_conditions"]
            )

        except (TypeError, ValueError):

            item["matched_conditions"] = []

        history.append(item)

    return jsonify({
        "history": history,
        "total": len(history)
    })


# ==========================================
# START APPLICATION
# ==========================================

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)
