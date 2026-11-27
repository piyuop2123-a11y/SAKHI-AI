from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline


# ---------------------------------
# FILE PATHS AND SETTINGS
# ---------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "data" / "training_data.csv"

CATEGORIES = ["high", "medium", "low"]

CATEGORY_DESCRIPTIONS = {
    "high": "The text resembles examples labelled as urgent.",
    "medium": "The text resembles examples involving concern or discomfort.",
    "low": "The text resembles general safety questions or advice requests."
}

DISCLAIMER = (
    "This is an experimental text classifier, not a real-world danger detector. "
    "Its output is based on a small training dataset and may be incorrect. "
    "If you are in immediate danger, contact local emergency services."
)


# ---------------------------------
# LOAD AND VALIDATE DATASET
# ---------------------------------

def load_dataset():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Training dataset not found: {DATASET_PATH}"
        )

    data = pd.read_csv(DATASET_PATH)

    required_columns = {"text", "label"}

    if not required_columns.issubset(data.columns):
        raise ValueError(
            "The CSV file must contain 'text' and 'label' columns."
        )

    data = data.dropna(subset=["text", "label"]).copy()

    data["text"] = data["text"].astype(str).str.strip()
    data["label"] = data["label"].astype(str).str.strip().str.lower()

    data = data[
        (data["text"] != "") &
        (data["label"].isin(CATEGORIES))
    ]

    if data.empty:
        raise ValueError("The training dataset contains no valid examples.")

    if set(data["label"].unique()) != set(CATEGORIES):
        raise ValueError(
            "The dataset must contain high, medium, and low examples."
        )

    return data


# ---------------------------------
# CREATE MACHINE LEARNING MODEL
# ---------------------------------

def create_model():
    model = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                ngram_range=(1, 2),
                stop_words="english"
            )
        ),
        (
            "classifier",
            MultinomialNB()
        )
    ])

    return model


# ---------------------------------
# TRAIN AND EVALUATE MODEL
# ---------------------------------

def train_model():
    data = load_dataset()

    texts = data["text"]
    labels = data["label"]

    # Keep a small portion of the dataset for evaluation.
    X_train, X_test, y_train, y_test = train_test_split(
        texts,
        labels,
        test_size=0.20,
        random_state=42,
        stratify=labels
    )

    evaluation_model = create_model()
    evaluation_model.fit(X_train, y_train)

    predictions = evaluation_model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print("\n========== MODEL EVALUATION ==========")
    print(f"Evaluation accuracy: {accuracy * 100:.2f}%")

    print("\nClassification report:")
    print(
        classification_report(
            y_test,
            predictions,
            labels=CATEGORIES,
            zero_division=0
        )
    )

    print("Confusion matrix:")
    print(confusion_matrix(y_test, predictions, labels=CATEGORIES))

    # After evaluation, train the final model using all available examples.
    final_model = create_model()
    final_model.fit(texts, labels)

    print("\nFinal model trained using all dataset examples.")

    return final_model


# ---------------------------------
# LOAD MODEL
# ---------------------------------

model = train_model()


# ---------------------------------
# ANALYZE USER TEXT
# ---------------------------------

def analyze_text(user_text):
    if not isinstance(user_text, str) or not user_text.strip():
        return {
            "error": "Please enter a description of your situation."
        }

    cleaned_text = user_text.strip()

    predicted_category = model.predict([cleaned_text])[0]

    probabilities = model.predict_proba([cleaned_text])[0]

    confidence = float(max(probabilities)) * 100

    return {
        "category": predicted_category,
        "description": CATEGORY_DESCRIPTIONS[predicted_category],
        "confidence_percent": round(confidence, 2),
        "disclaimer": DISCLAIMER
    }


# ---------------------------------
# RUN A SIMPLE TEST
# ---------------------------------

if __name__ == "__main__":
    print("\n========== SAKHI AI TEXT ANALYZER ==========")

    while True:
        user_input = input(
            "\nDescribe a situation (or type 'exit' to stop): "
        )

        if user_input.strip().lower() == "exit":
            print("SAKHI AI test completed.")
            break

        result = analyze_text(user_input)

        print("\nAnalysis result:")

        for key, value in result.items():
            print(f"{key}: {value}")