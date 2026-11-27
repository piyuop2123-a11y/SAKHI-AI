
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


# ==========================================
# JOURNEY GUARDIAN DATABASE MODEL
# ==========================================

class Journey(db.Model):

    __tablename__ = "journeys"

    id = db.Column(db.Integer, primary_key=True)

    # User login will be connected later.
    user_id = db.Column(db.Integer, nullable=True)

    start_location = db.Column(db.String(200), nullable=False)

    destination = db.Column(db.String(200), nullable=False)

    expected_minutes = db.Column(db.Integer, nullable=False)

    started_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    expected_arrival = db.Column(db.DateTime, nullable=False)

    status = db.Column(
        db.String(30),
        nullable=False,
        default="active"
    )

    arrived_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):

        return {
            "id": self.id,
            "start_location": self.start_location,
            "destination": self.destination,
            "expected_minutes": self.expected_minutes,
            "started_at": self.started_at.isoformat(),
            "expected_arrival": self.expected_arrival.isoformat(),
            "status": self.status,
            "arrived_at": (
                self.arrived_at.isoformat()
                if self.arrived_at else None
            )
        }


# ==========================================
# DEMO JOURNEY ALERT DATABASE MODEL
# ==========================================

class JourneyAlert(db.Model):

    __tablename__ = "journey_alerts"

    id = db.Column(db.Integer, primary_key=True)

    # One simulated alert per journey.
    journey_id = db.Column(
        db.Integer,
        db.ForeignKey("journeys.id"),
        nullable=False,
        unique=True
    )

    contact_name = db.Column(
        db.String(100),
        nullable=False
    )

    contact_phone = db.Column(
        db.String(20),
        nullable=False
    )

    destination = db.Column(
        db.String(200),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    journey = db.relationship(
        "Journey",
        backref=db.backref(
            "demo_alert",
            uselist=False
        )
    )

    def to_dict(self):

        return {
            "id": self.id,
            "journey_id": self.journey_id,
            "contact_name": self.contact_name,
            "contact_phone": self.contact_phone,
            "destination": self.destination,
            "message": self.message,
            "created_at": self.created_at.isoformat(),
            "delivery_status": "SIMULATED - NOT SENT"
        }


# ==========================================
# AI ANALYSIS HISTORY DATABASE MODEL
# ==========================================

class AnalysisHistory(db.Model):

    __tablename__ = "analysis_history"

    id = db.Column(db.Integer, primary_key=True)

    # User login will be connected later.
    user_id = db.Column(db.Integer, nullable=True)

    # User's submitted situation description.
    description = db.Column(
        db.Text,
        nullable=False
    )

    # Machine Learning result.
    category = db.Column(
        db.String(30),
        nullable=False
    )

    confidence = db.Column(
        db.Float,
        nullable=False
    )

    # Expert System result.
    expert_title = db.Column(
        db.String(200),
        nullable=False
    )

    expert_suggestions = db.Column(
        db.Text,
        nullable=False
    )

    matched_conditions = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    def to_dict(self):

        return {
            "id": self.id,
            "description": self.description,
            "category": self.category,
            "confidence": self.confidence,
            "expert_title": self.expert_title,
            "expert_suggestions": self.expert_suggestions,
            "matched_conditions": self.matched_conditions,
            "created_at": self.created_at.isoformat()
        }
