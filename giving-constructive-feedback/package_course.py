import zipfile
import os

def create_package():
    output_filename = 'giving-constructive-feedback-cmi5.zip'
    directory = os.path.dirname(os.path.abspath(__file__))

    files_to_include = [
        'index.html',
        'cmi5-launch.js',
        'cmi5.xml',
    ]

    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_include:
            path = os.path.join(directory, file)
            if os.path.exists(path):
                zipf.write(path, file)
                print(f"  Added: {file}")
            else:
                print(f"  WARNING: {file} not found — skipping")

    print(f"\nSuccess! {output_filename} is ready for your portfolio.")
    print("Upload this ZIP to any cmi5-compatible LMS (Moodle, SAP SuccessFactors, Docebo, etc.)")

if __name__ == "__main__":
    create_package()
