import json
import os
import tempfile
from generate_course import get_course_data

def test_get_course_data():
    # Test with mock data paths (assuming they exist)
    data_paths = [
        '/Users/deo_metoyer/Library/Mobile Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/Data_Analyst/Level_1_Python_Fundamentals'
    ]
    course = get_course_data(data_paths)
    assert 'level1' in course
    assert 'exercises' in course['level1']
    assert len(course['level1']['exercises']) > 0
    print("Test passed: Course data generated successfully")

if __name__ == '__main__':
    test_get_course_data()