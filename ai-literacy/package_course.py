#!/usr/bin/env python3
"""Package AI Literacy course as SCORM 1.2 ZIP."""

import zipfile, os

HERE = os.path.dirname(os.path.abspath(__file__))
COURSE_DIR = HERE
OUTPUT = os.path.join(HERE, '..', 'ai_literacy_course.zip')
EXCLUDE = {__file__}

def main():
    with zipfile.ZipFile(OUTPUT, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(COURSE_DIR):
            # Skip .git
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for f in files:
                fp = os.path.join(root, f)
                if fp in EXCLUDE:
                    continue
                arcname = os.path.relpath(fp, COURSE_DIR)
                zf.write(fp, arcname)
                print(f'  Added: {arcname}')
    print(f'\n✅ Package created: {OUTPUT}')

if __name__ == '__main__':
    main()
