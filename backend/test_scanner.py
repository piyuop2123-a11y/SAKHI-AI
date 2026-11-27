
from pathlib import Path
from scanner_engine import analyze_image

print("\nSAKHI AI - YOLO OBJECT DETECTION TEST")

image_path = input("\nEnter image path: ").strip().strip('"')

path = Path(image_path)

if not path.exists():
    print("\nERROR: Image file not found.")
    raise SystemExit(1)

with open(path, "rb") as image_file:
    image_bytes = image_file.read()

result = analyze_image(image_bytes)

if "error" in result:
    print("\nERROR:", result["error"])
    raise SystemExit(1)

print("\nIMAGE MEASUREMENTS")
print(result["measurements"])

print("\nOBJECT DETECTION")

detection = result["object_detection"]

print("Available:", detection["available"])
print("Message:", detection["message"])
print("Total objects:", detection["total_objects"])

for item in detection["detections"]:
    print(
        f"- {item['label']} "
        f"({item['confidence']}% confidence)"
    )

if detection["annotated_image"]:
    import base64

    output_path = Path("detected_output.jpg")

    output_path.write_bytes(
        base64.b64decode(detection["annotated_image"])
    )

    print("\nAnnotated image saved to:", output_path.resolve())

print("\nOBSERVATIONS")

for item in result["observations"]:
    print("-", item["title"])
    print(" ", item["description"])

print("\nTEST COMPLETED")