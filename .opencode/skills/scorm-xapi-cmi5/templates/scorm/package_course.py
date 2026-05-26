import zipfile
import os

def create_package():
    output_filename = '{{OUTPUT_ZIP}}'
    directory = os.path.dirname(os.path.abspath(__file__))

    files_to_include = [
        'index.html',
        'style.css',
        'scorm_wrapper.js',
        'imsmanifest.xml',
        {{EXTRA_FILES_LIST}}
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

if __name__ == "__main__":
    create_package()
