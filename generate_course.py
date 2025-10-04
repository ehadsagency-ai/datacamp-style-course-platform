import os
import json
import re

def parse_notebook(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        nb = json.load(f)

    title = os.path.basename(filepath).replace('.ipynb', '').replace('_', ' ').replace('#', '')
    description = f"Learn from notebook: {title}"

    initial_code = ""
    hints = []
    solution = ""

    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            code = ''.join(cell['source'])
            if not initial_code:
                initial_code = code
            else:
                solution = code
        elif cell['cell_type'] == 'markdown':
            text = ''.join(cell['source'])
            if 'hint' in text.lower() or 'indice' in text.lower():
                hints.append(re.sub(r'#+\s*', '', text).strip())

    if not hints:
        hints = ["Try to understand the code.", "Look at the imports.", "Check the output."]

    return {
        'title': title,
        'description': description,
        'initialCode': initial_code,
        'hints': hints[:3],  # limit to 3
        'solution': solution
    }

def generate_course(data_paths):
    levels = {}

    for level_num, path in enumerate(data_paths, 1):
        level_key = f'level{level_num}'
        exercises = []

        if os.path.exists(path):
            for file in os.listdir(path):
                if file.endswith('.ipynb'):
                    nb_path = os.path.join(path, file)
                    try:
                        exercise = parse_notebook(nb_path)
                        exercises.append(exercise)
                    except json.JSONDecodeError as e:
                        print(f"Invalid JSON in {nb_path}: {e}")
                    except Exception as e:
                        print(f"Error parsing {nb_path}: {e}")

        levels[level_key] = {
            'title': f'Level {level_num}: {path.split("/")[-1].replace("_", " ").replace("Level_", "").replace("_", " ")}',
            'content': f'Advanced content from {path.split("/")[-1]}',
            'exercises': exercises
        }

    return levels

def get_course_data(data_paths=None):
    if data_paths is None:
        data_paths = [
            '/Users/deo_metoyer/Library/Mobile Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/Data_Analyst/Level_1_Python_Fundamentals',
            '/Users/deo_metoyer/Library/Mobile Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/Data_Analyst/Level_2_Data_Processing',
            '/Users/deo_metoyer/Library/Mobile Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/Data_Analyst/Level_3_Data_Visualization',
            '/Users/deo_metoyer/Library/Mobile Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/Data_Analyst/Level_4_Machine_Learning',
            '/Users/deo_metoyer/Library/Mobile Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/Data_Analyst/Level_5_Advanced_Topics'
        ]
    return generate_course(data_paths)

if __name__ == '__main__':
    course = get_course_data()

    with open('course_data.json', 'w', encoding='utf-8') as f:
        json.dump(course, f, indent=2, ensure_ascii=False)

    print("Course data generated in course_data.json")