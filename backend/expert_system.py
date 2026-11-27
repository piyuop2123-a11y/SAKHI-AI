
# ==========================================
# SAKHI AI - RULE BASED EXPERT SYSTEM
# + SMART SAFETY PLANNER
# ==========================================

# This module contains:
# 1. Rule-Based Expert System
# 2. Smart Safety Planner
#
# Both systems use predefined IF-THEN rules.


# ==========================================
# PART 1: EXPERT SYSTEM KNOWLEDGE BASE
# ==========================================

SAFETY_RULES = [

    {
        "condition": "immediate_threat",
        "keywords": [
            "attacked", "chasing me", "following me",
            "weapon", "threatening me", "trying to grab me",
            "force me", "trapped", "break into", "hurt me",
            "physical danger"
        ],
        "priority": 1,
        "title": "Immediate Safety Guidance",
        "suggestions": [
            "If possible, move towards a populated or secure location.",
            "Contact local emergency services if you are in immediate danger.",
            "Contact a trusted person when it is safe to do so.",
            "Avoid confronting the threatening person."
        ]
    },

    {
        "condition": "online_harassment",
        "keywords": [
            "online harassment", "unwanted messages",
            "suspicious message", "unknown number",
            "repeated calls", "private information",
            "sharing my photos", "cyberbullying",
            "fake account", "threatening messages"
        ],
        "priority": 2,
        "title": "Digital Safety Guidance",
        "suggestions": [
            "Avoid replying to suspicious or threatening messages.",
            "Save relevant messages and screenshots as evidence.",
            "Block and report the account or number where appropriate.",
            "Review your account privacy and security settings.",
            "Seek help from a trusted person or appropriate cybercrime reporting service."
        ]
    },

    {
        "condition": "unsafe_travel",
        "keywords": [
            "poorly lit street", "walking alone",
            "travelling alone", "unsafe bus stop",
            "isolated road", "dark road",
            "late at night", "unsafe route",
            "alone at night"
        ],
        "priority": 3,
        "title": "Travel Safety Guidance",
        "suggestions": [
            "Consider choosing a familiar and well-lit route.",
            "Where possible, travel with someone you trust.",
            "Keep your phone charged and accessible.",
            "Inform a trusted contact about your journey.",
            "Move towards a populated place if you feel uncomfortable."
        ]
    },

    {
        "condition": "privacy_concern",
        "keywords": [
            "live location", "location sharing",
            "privacy online", "personal information",
            "unknown link", "suspicious link",
            "password", "account hacked", "sharing my data"
        ],
        "priority": 4,
        "title": "Privacy Protection Guidance",
        "suggestions": [
            "Avoid sharing personal information with unknown people.",
            "Check which applications have access to your location.",
            "Do not open suspicious links or attachments.",
            "Use strong and unique passwords.",
            "Enable two-factor authentication where available."
        ]
    },

    {
        "condition": "general_safety",
        "keywords": [
            "safety tips", "emergency contacts",
            "safety checklist", "prepare for emergency",
            "personal safety", "safety precautions",
            "safety plan"
        ],
        "priority": 5,
        "title": "General Safety Guidance",
        "suggestions": [
            "Keep important emergency contacts accessible.",
            "Prepare a personal safety checklist.",
            "Keep your phone charged when travelling.",
            "Share journey details with a trusted contact when appropriate.",
            "Know how to contact local emergency services."
        ]
    }

]


# ==========================================
# PART 2: RULE MATCHING ENGINE
# ==========================================

def match_rules(user_text):

    if not isinstance(user_text, str) or not user_text.strip():
        return []

    text = user_text.lower()

    matched_rules = []

    for rule in SAFETY_RULES:

        for keyword in rule["keywords"]:

            if keyword in text:
                matched_rules.append(rule)
                break

    matched_rules.sort(
        key=lambda rule: rule["priority"]
    )

    return matched_rules


# ==========================================
# PART 3: EXPERT SYSTEM ANALYSIS
# ==========================================

def get_safety_advice(user_text):

    matched_rules = match_rules(user_text)

    if not matched_rules:

        return {
            "matched": False,
            "message": "No specific rule matched your description.",
            "title": "General Safety Reminder",
            "suggestions": [
                "Stay aware of your surroundings.",
                "Keep important emergency contacts accessible.",
                "Talk to someone you trust if you feel uncomfortable.",
                "Contact local emergency services if you are in immediate danger."
            ],
            "disclaimer": (
                "These are general suggestions generated using predefined rules. "
                "They do not assess actual danger or replace emergency services."
            )
        }

    all_suggestions = []

    for rule in matched_rules:

        for suggestion in rule["suggestions"]:

            if suggestion not in all_suggestions:
                all_suggestions.append(suggestion)

    return {
        "matched": True,
        "matched_conditions": [
            rule["condition"] for rule in matched_rules
        ],
        "title": matched_rules[0]["title"],
        "suggestions": all_suggestions,
        "disclaimer": (
            "Suggestions are generated using predefined IF-THEN rules. "
            "The system cannot verify a situation or guarantee safety. "
            "Contact local emergency services if you are in immediate danger."
        )
    }


# ==========================================
# PART 4: SMART SAFETY PLANNER
# ==========================================

# Activity-specific recommendations.

ACTIVITY_RULES = {

    "commute": {
        "title": "Daily Commute Safety Plan",
        "checklist": [
            "Keep your phone sufficiently charged.",
            "Keep important emergency contacts accessible.",
            "Check your route and transport timings.",
            "Keep your belongings secure.",
            "Inform a trusted person about your expected arrival when appropriate."
        ]
    },

    "solo_trip": {
        "title": "Solo Trip Safety Plan",
        "checklist": [
            "Research your destination and accommodation.",
            "Keep copies of important travel documents securely.",
            "Share your itinerary with someone you trust.",
            "Keep emergency contacts accessible.",
            "Keep some backup money and essential supplies.",
            "Check transport arrangements before departure."
        ]
    },

    "event": {
        "title": "Event Safety Plan",
        "checklist": [
            "Plan how you will travel to and from the event.",
            "Identify the venue's exits and help points.",
            "Keep your phone charged.",
            "Arrange a meeting point with your companions.",
            "Keep your personal belongings secure.",
            "Plan your return journey in advance."
        ]
    },

    "returning_home": {
        "title": "Returning Home Safety Plan",
        "checklist": [
            "Check your available transport options.",
            "Keep your phone charged and accessible.",
            "Choose a familiar route where practical.",
            "Inform a trusted person about your expected arrival.",
            "Keep emergency contacts accessible."
        ]
    }

}


# Transport-specific recommendations.

TRANSPORT_RULES = {

    "walking": [
        "Prefer familiar routes with adequate lighting.",
        "Stay aware of your surroundings.",
        "Identify nearby public places where you could seek assistance."
    ],

    "public_transport": [
        "Check the route, stops, and service timings.",
        "Wait in designated and reasonably populated areas.",
        "Keep your ticket or travel details accessible."
    ],

    "taxi": [
        "Use a reputable transport provider.",
        "Check the vehicle and booking details before entering.",
        "Share trip details with someone you trust when appropriate."
    ],

    "private_vehicle": [
        "Check fuel or battery level before departure.",
        "Check that the vehicle is in suitable working condition.",
        "Keep roadside assistance contacts accessible."
    ],

    "other": [
        "Confirm your transport arrangements before departure.",
        "Keep important travel details accessible."
    ]

}


# Time-specific recommendations.

TIME_RULES = {

    "day": [
        "Check your route and expected travel duration.",
        "Keep water and essential items available when needed."
    ],

    "night": [
        "Where practical, choose familiar and adequately lit routes.",
        "Check your return transport arrangements in advance.",
        "Keep your phone charged and accessible.",
        "Consider informing a trusted person about your journey."
    ]

}


# ------------------------------------------
# SAFETY PLAN GENERATOR
# ------------------------------------------

def get_safety_plan(activity, transport, time_of_day):

    """
    Generate a practical safety checklist using predefined rules.

    Accepted activity values:
        commute
        solo_trip
        event
        returning_home

    Accepted transport values:
        walking
        public_transport
        taxi
        private_vehicle
        other

    Accepted time values:
        day
        night
    """

    # Normalize user selections.

    activity = str(activity).strip().lower()
    transport = str(transport).strip().lower()
    time_of_day = str(time_of_day).strip().lower()

    # Validate selections.

    if activity not in ACTIVITY_RULES:
        return {
            "error": "Please select a valid activity."
        }

    if transport not in TRANSPORT_RULES:
        return {
            "error": "Please select a valid transport method."
        }

    if time_of_day not in TIME_RULES:
        return {
            "error": "Please select day or night."
        }

    # Generate checklist from matching rules.

    checklist = []

    all_recommendations = (
        ACTIVITY_RULES[activity]["checklist"]
        + TRANSPORT_RULES[transport]
        + TIME_RULES[time_of_day]
    )

    # Remove duplicate recommendations.

    unique_recommendations = []

    for recommendation in all_recommendations:

        if recommendation not in unique_recommendations:
            unique_recommendations.append(recommendation)

    # Assign checklist item IDs.

    for index, recommendation in enumerate(
        unique_recommendations,
        start=1
    ):

        checklist.append({
            "id": index,
            "task": recommendation,
            "completed": False
        })

    return {
        "success": True,
        "title": ACTIVITY_RULES[activity]["title"],
        "activity": activity,
        "transport": transport,
        "time_of_day": time_of_day,
        "total_tasks": len(checklist),
        "checklist": checklist,
        "disclaimer": (
            "This checklist contains general preventive suggestions. "
            "It cannot predict or guarantee safety. Adapt the suggestions "
            "to your circumstances and contact emergency services if needed."
        )
    }


# ==========================================
# PART 5: TEST THE EXPERT SYSTEM
# ==========================================

if __name__ == "__main__":

    print("\n================================")
    print("       SAKHI AI EXPERT SYSTEM")
    print("================================")

    while True:

        user_input = input(
            "\nDescribe your concern (or type 'exit'): "
        )

        if user_input.strip().lower() == "exit":
            print("\nExpert System test completed.")
            break

        result = get_safety_advice(user_input)

        print("\nAnalysis Result:")
        print("Title:", result["title"])

        print("\nMatched Conditions:")

        if result.get("matched_conditions"):

            for condition in result["matched_conditions"]:
                print("-", condition)

        else:
            print("No specific rule matched.")

        print("\nSuggested Actions:")

        for suggestion in result["suggestions"]:
            print("-", suggestion)

        print("\nDisclaimer:")
        print(result["disclaimer"])

    # Test Safety Planner separately.

    print("\n================================")
    print("       SAFETY PLANNER TEST")
    print("================================")

    plan = get_safety_plan(
        activity="solo_trip",
        transport="public_transport",
        time_of_day="night"
    )

    print("\nPlan:", plan["title"])

    print("\nChecklist:")

    for item in plan["checklist"]:
        print(f"{item['id']}. {item['task']}")
