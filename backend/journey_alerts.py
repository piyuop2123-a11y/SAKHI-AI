
from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request

from database import db, Journey, JourneyAlert

journey_alerts_bp = Blueprint(
    "journey_alerts",
    __name__
)

# Demo grace period: 5 minutes after expected arrival.
GRACE_PERIOD_MINUTES = 5

@journey_alerts_bp.route(
    "/api/journeys/<int:journey_id>/demo-alert",
    methods=["POST"]
)
def create_demo_journey_alert(journey_id):

    journey = db.session.get(Journey, journey_id)

    if journey is None:
        return jsonify({
            "success": False,
            "error": "Journey not found."
        }), 404

    # Return the existing alert instead of creating duplicates.
    existing_alert = JourneyAlert.query.filter_by(
        journey_id=journey_id
    ).first()

    if existing_alert:
        return jsonify({
            "success": True,
            "alert_created": True,
            "message": "Demo alert already exists.",
            "alert": existing_alert.to_dict()
        }), 200

    if journey.status not in ["active", "overdue"]:
        return jsonify({
            "success": False,
            "error": "This journey is no longer active."
        }), 409

    now = datetime.utcnow()

    # Update journey status when expected arrival has passed.
    if now >= journey.expected_arrival:
        journey.status = "overdue"
        db.session.commit()

    alert_eligible_at = (
        journey.expected_arrival
        + timedelta(minutes=GRACE_PERIOD_MINUTES)
    )

    # Do not generate an alert before the grace period ends.
    if now < alert_eligible_at:
        remaining_seconds = int(
            (alert_eligible_at - now).total_seconds()
        )

        return jsonify({
            "success": True,
            "alert_created": False,
            "message": "Grace period is still active.",
            "remaining_seconds": remaining_seconds
        }), 200

    data = request.get_json(silent=True) or {}

    contact_name = data.get("contact_name", "")
    contact_phone = data.get("contact_phone", "")

    if not isinstance(contact_name, str):
        return jsonify({
            "success": False,
            "error": "Invalid trusted contact name."
        }), 400

    if not isinstance(contact_phone, str):
        return jsonify({
            "success": False,
            "error": "Invalid trusted contact phone number."
        }), 400

    contact_name = contact_name.strip()
    contact_phone = contact_phone.strip()

    if not contact_name or not contact_phone:
        return jsonify({
            "success": False,
            "error": "Please provide a trusted contact name and phone number."
        }), 400

    if len(contact_name) > 100 or len(contact_phone) > 20:
        return jsonify({
            "success": False,
            "error": "Trusted contact details are too long."
        }), 400

    message = (
     f"SAKHI AI - JOURNEY SAFETY ALERT\n\n"
     f"Hello,\n\n"
     f"The user was expected to reach {journey.destination}, "
     f"but has not confirmed their arrival yet.\n\n"
     f"The journey is now overdue. Please try calling the user "
     f"to check whether they have reached safely.\n\n"
     f"If you cannot reach them, consider contacting someone "
     f"nearby who may be able to help.\n\n"
     f"This is a simulated demo notification."
)

    alert = JourneyAlert(
        journey_id=journey.id,
        contact_name=contact_name,
        contact_phone=contact_phone,
        destination=journey.destination,
        message=message
    )

    try:
        db.session.add(alert)
        db.session.commit()

    except Exception:
        db.session.rollback()

        # Another request may have created the alert first.
        existing_alert = JourneyAlert.query.filter_by(
            journey_id=journey_id
        ).first()

        if existing_alert:
            return jsonify({
                "success": True,
                "alert_created": True,
                "message": "Demo alert already exists.",
                "alert": existing_alert.to_dict()
            }), 200

        return jsonify({
            "success": False,
            "error": "Could not create the demo alert."
        }), 500

    return jsonify({
        "success": True,
        "alert_created": True,
        "message": "Demo alert generated successfully.",
        "alert": alert.to_dict()
    }), 201

@journey_alerts_bp.route(
    "/api/journeys/<int:journey_id>/demo-alert",
    methods=["GET"]
)
def get_demo_journey_alert(journey_id):

    alert = JourneyAlert.query.filter_by(
        journey_id=journey_id
    ).first()

    if alert is None:
        return jsonify({
            "success": True,
            "alert": None
        }), 200

    return jsonify({
        "success": True,
        "alert": alert.to_dict()
    }), 200