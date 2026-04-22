import zipfile
import os

def create_ielts_package():
    output_filename = 'ielts_speaking_masterclass.zip'
    directory = os.path.dirname(os.path.abspath(__file__))
    
    files_to_include = ['index.html', 'style.css', 'scorm_wrapper.js', 'imsmanifest.xml']
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_include:
            if os.path.exists(os.path.join(directory, file)):
                zipf.write(os.path.join(directory, file), file)
    
    print(f"Success! {output_filename} is ready for your portfolio.")

if __name__ == "__main__":
    create_ielts_package()
