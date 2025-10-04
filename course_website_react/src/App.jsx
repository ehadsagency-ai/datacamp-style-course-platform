import { useState } from 'react'
import './App.css'
import CodeEditor from './CodeEditor.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('level1')
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem('progress') || '{}'))

  const levels = {
    level1: { 
      title: 'Level 1: Python Fundamentals', 
      content: 'Introduction to Python, data structures, etc.',
      exercises: [
        {
          title: 'Hello World',
          description: 'Print "Hello, Data Analyst!"',
          initialCode: 'print("Hello, World!")',
          validate: (result) => result.includes('Hello')
        }
      ]
    },
    level2: { 
      title: 'Level 2: Data Processing', 
      content: 'Data cleaning, manipulation, etc.',
      exercises: [
        {
          title: 'Create DataFrame',
          description: 'Create a pandas DataFrame with sample data',
          initialCode: 'import pandas as pd\ndf = pd.DataFrame({"name": ["Alice", "Bob"], "age": [25, 30]})\nprint(df)',
          validate: (result) => result.includes('DataFrame')
        }
      ]
    },
    level3: { title: 'Level 3: Data Visualization', content: 'Matplotlib, Seaborn, etc.' },
    level4: { title: 'Level 4: Machine Learning', content: 'Scikit-learn, models, etc.' },
    level5: { title: 'Level 5: Advanced Topics', content: 'PySpark, SQL, etc.' },
  }

  const handleExerciseComplete = (level, exerciseIndex) => {
    const newProgress = { ...progress, [`${level}_${exerciseIndex}`]: true }
    setProgress(newProgress)
    localStorage.setItem('progress', JSON.stringify(newProgress))
  }

  return (
    <div className="min-h-screen bg-bg-cream p-4">
      <div className="pixel-title text-center mb-8">
        <h1 className="text-4xl text-data-deep">🌲 Data Analyst Course 🌲</h1>
        <p className="text-data-moss">Interactive Learning Platform</p>
      </div>
      
      <div className="flex flex-wrap justify-center mb-8">
        {Object.keys(levels).map(level => (
          <button
            key={level}
            onClick={() => setActiveTab(level)}
            className={`pixel-button m-2 px-4 py-2 ${activeTab === level ? 'bg-data-deep text-white' : 'bg-data-light text-data-deep'}`}
          >
            {levels[level].title}
          </button>
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto bg-chart-beige p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl text-code-dark mb-4">{levels[activeTab].title}</h2>
        <p className="text-code-light mb-4">{levels[activeTab].content}</p>
        
        {levels[activeTab].exercises && (
          <div className="exercises mb-6">
            <h3 className="text-xl mb-2">Exercises</h3>
            {levels[activeTab].exercises.map((exercise, index) => (
              <div key={index} className="exercise mb-6 p-4 bg-white rounded">
                <h4 className="font-bold">{exercise.title}</h4>
                <p className="mb-2">{exercise.description}</p>
                <CodeEditor 
                  initialCode={exercise.initialCode}
                  onValidate={(validation) => {
                    if (exercise.validate(validation)) {
                      handleExerciseComplete(activeTab, index)
                      alert('Exercise completed!')
                    }
                  }}
                />
                {progress[`${activeTab}_${index}`] && <p className="text-green-600 mt-2">✅ Completed</p>}
              </div>
            ))}
          </div>
        )}
        
        <button className="pixel-button mt-4 px-6 py-2 bg-data-moss text-white">
          Start Learning
        </button>
      </div>
    </div>
  )
}

export default App
