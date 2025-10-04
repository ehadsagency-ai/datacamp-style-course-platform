import { useState, useEffect } from 'react'
import './App.css'
import CodeEditor from './CodeEditor.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('level1')
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem('progress') || '{}'))
  const [totalXP, setTotalXP] = useState(parseInt(localStorage.getItem('totalXP') || '0'))
  const [userLevel, setUserLevel] = useState(parseInt(localStorage.getItem('userLevel') || '1'))
  const [showLevelUp, setShowLevelUp] = useState(false)

  const XP_PER_EXERCISE = 100
  const XP_PER_LEVEL = 500

  // Calculate level from XP
  useEffect(() => {
    const calculatedLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1
    if (calculatedLevel > userLevel) {
      setUserLevel(calculatedLevel)
      localStorage.setItem('userLevel', calculatedLevel)
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
    }
  }, [totalXP, userLevel])

  const levels = {
    level1: {
      title: 'Level 1: Python Fundamentals',
      icon: '🐍',
      description: 'Master the basics of Python programming',
      videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', // Python Basics
      exercises: [
        {
          title: 'Hello, Data Analyst!',
          description: 'Print "Hello, Data Analyst!" to the console',
          xp: 100,
          initialCode: '# Write your code here\nprint("Hello, World!")',
          solution: 'print("Hello, Data Analyst!")',
          hints: [
            'Use the print() function',
            'Replace "World" with "Data Analyst"',
            'Make sure to use quotes around the text'
          ],
          validate: (output) => output.includes('Hello, Data Analyst!')
        },
        {
          title: 'Variables and Math',
          description: 'Create two variables (a=10, b=20) and print their sum',
          xp: 100,
          initialCode: '# Create variables and calculate\n',
          solution: 'a = 10\nb = 20\nprint(a + b)',
          hints: [
            'Create variable a with value 10',
            'Create variable b with value 20',
            'Use the + operator to add them',
            'Print the result'
          ],
          validate: (output) => output.includes('30')
        },
        {
          title: 'Working with Lists',
          description: 'Create a list with numbers [1, 2, 3, 4, 5] and print its length',
          xp: 100,
          initialCode: '# Create a list and get its length\n',
          solution: 'numbers = [1, 2, 3, 4, 5]\nprint(len(numbers))',
          hints: [
            'Create a list using square brackets []',
            'Use the len() function to get the length',
            'Print the result'
          ],
          validate: (output) => output.includes('5')
        }
      ]
    },
    level2: {
      title: 'Level 2: Data Processing',
      icon: '📊',
      description: 'Learn to manipulate data with Pandas',
      videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', // Pandas Tutorial
      exercises: [
        {
          title: 'Create Your First DataFrame',
          description: 'Create a pandas DataFrame with columns "name" and "age"',
          xp: 100,
          initialCode: 'import pandas as pd\n\n# Create a DataFrame\n',
          solution: 'import pandas as pd\n\ndata = {"name": ["Alice", "Bob"], "age": [25, 30]}\ndf = pd.DataFrame(data)\nprint(df)',
          hints: [
            'Import pandas as pd',
            'Create a dictionary with your data',
            'Use pd.DataFrame() to convert it',
            'Print the DataFrame'
          ],
          validate: (output) => output.includes('Alice') && output.includes('Bob')
        },
        {
          title: 'Filter Data',
          description: 'Create a DataFrame and filter rows where age > 25',
          xp: 150,
          initialCode: 'import pandas as pd\n\ndata = {"name": ["Alice", "Bob", "Charlie"], "age": [25, 30, 22]}\ndf = pd.DataFrame(data)\n\n# Filter the DataFrame\n',
          solution: 'import pandas as pd\n\ndata = {"name": ["Alice", "Bob", "Charlie"], "age": [25, 30, 22]}\ndf = pd.DataFrame(data)\nfiltered = df[df["age"] > 25]\nprint(filtered)',
          hints: [
            'Use boolean indexing with df[condition]',
            'The condition is df["age"] > 25',
            'Store the result and print it'
          ],
          validate: (output) => output.includes('Bob') && !output.includes('Charlie')
        }
      ]
    },
    level3: {
      title: 'Level 3: Data Visualization',
      icon: '📈',
      description: 'Create beautiful charts with Matplotlib',
      videoUrl: 'https://www.youtube.com/embed/UO98lJQ3QGI', // Matplotlib Tutorial
      exercises: [
        {
          title: 'Simple Plot',
          description: 'Create a simple line plot with matplotlib',
          xp: 150,
          initialCode: 'import matplotlib.pyplot as plt\nimport numpy as np\n\n# Create a simple plot\n',
          solution: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nx = [1, 2, 3, 4, 5]\ny = [1, 4, 9, 16, 25]\nplt.plot(x, y)\nplt.title("My First Plot")\nprint("Plot created!")',
          hints: [
            'Create two lists for x and y coordinates',
            'Use plt.plot(x, y) to create the plot',
            'Add a title with plt.title()',
            'Print a success message'
          ],
          validate: (output) => output.includes('Plot created')
        }
      ]
    },
    level4: {
      title: 'Level 4: Machine Learning',
      icon: '🤖',
      description: 'Build ML models with Scikit-learn',
      videoUrl: 'https://www.youtube.com/embed/7eh4d6sabA0', // Scikit-learn Tutorial
      exercises: [
        {
          title: 'Coming Soon',
          description: 'Machine learning exercises will be available soon!',
          xp: 200,
          initialCode: '# ML exercises coming soon!\nprint("Stay tuned!")',
          solution: 'print("Stay tuned!")',
          hints: ['This feature is under development'],
          validate: (output) => output.includes('Stay tuned')
        }
      ]
    },
    level5: {
      title: 'Level 5: Advanced Topics',
      icon: '🚀',
      description: 'Master PySpark, SQL, and more',
      videoUrl: null,
      exercises: [
        {
          title: 'Coming Soon',
          description: 'Advanced exercises will be available soon!',
          xp: 300,
          initialCode: '# Advanced exercises coming soon!\nprint("Keep learning!")',
          solution: 'print("Keep learning!")',
          hints: ['This feature is under development'],
          validate: (output) => output.includes('Keep learning')
        }
      ]
    }
  }

  const handleExerciseComplete = (levelKey, exerciseIndex, xp) => {
    const progressKey = `${levelKey}_${exerciseIndex}`

    // Check if already completed
    if (progress[progressKey]) {
      alert('You already completed this exercise!')
      return
    }

    // Mark as complete
    const newProgress = { ...progress, [progressKey]: true }
    setProgress(newProgress)
    localStorage.setItem('progress', JSON.stringify(newProgress))

    // Add XP
    const newXP = totalXP + xp
    setTotalXP(newXP)
    localStorage.setItem('totalXP', newXP)

    // Show success message
    alert(`🎉 Exercise Completed! +${xp} XP\n\nTotal XP: ${newXP}\nLevel: ${Math.floor(newXP / XP_PER_LEVEL) + 1}`)
  }

  const getProgressPercentage = () => {
    const totalExercises = Object.values(levels).reduce((sum, level) =>
      sum + (level.exercises?.length || 0), 0
    )
    const completedExercises = Object.keys(progress).length
    return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-bg-cream p-4">
      {/* Level Up Animation */}
      {showLevelUp && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-white px-8 py-4 rounded-lg shadow-2xl text-center z-50 animate-bounce">
          <h2 className="text-3xl font-bold">🎉 LEVEL UP! 🎉</h2>
          <p className="text-xl">You are now Level {userLevel}!</p>
        </div>
      )}

      {/* Header with XP Bar */}
      <div className="pixel-title text-center mb-4">
        <h1 className="text-4xl text-data-deep">📚 Data Analyst Course 📚</h1>
        <p className="text-data-moss">Interactive Learning Platform</p>
      </div>

      {/* XP Dashboard */}
      <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-purple-600">Level {userLevel}</span>
            <span className="text-gray-600">{totalXP} XP</span>
          </div>
          <span className="text-green-600 font-bold">{getProgressPercentage()}% Complete</span>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(totalXP % XP_PER_LEVEL) / XP_PER_LEVEL * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {XP_PER_LEVEL - (totalXP % XP_PER_LEVEL)} XP to next level
        </p>
      </div>

      {/* Level Tabs */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {Object.keys(levels).map(levelKey => (
          <button
            key={levelKey}
            onClick={() => setActiveTab(levelKey)}
            className={`pixel-button px-4 py-2 ${
              activeTab === levelKey
                ? 'bg-data-deep text-white'
                : 'bg-data-light text-data-deep'
            }`}
          >
            {levels[levelKey].icon} {levels[levelKey].title}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto bg-chart-beige p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl text-code-dark mb-2">
          {levels[activeTab].icon} {levels[activeTab].title}
        </h2>
        <p className="text-code-light mb-4">{levels[activeTab].description}</p>

        {/* Video Lesson */}
        {levels[activeTab].videoUrl && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">📹 Video Lesson</h3>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={levels[activeTab].videoUrl}
                title="Video Lesson"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Exercises */}
        {levels[activeTab].exercises && (
          <div className="exercises">
            <h3 className="text-xl font-bold mb-4">💪 Exercises</h3>
            {levels[activeTab].exercises.map((exercise, index) => {
              const isCompleted = progress[`${activeTab}_${index}`]

              return (
                <div
                  key={index}
                  className={`exercise mb-6 p-4 rounded border-2 ${
                    isCompleted
                      ? 'bg-green-50 border-green-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{exercise.title}</h4>
                      <p className="text-gray-600">{exercise.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-sm font-bold">
                        +{exercise.xp} XP
                      </span>
                      {isCompleted && <span className="text-2xl">✅</span>}
                    </div>
                  </div>

                  <CodeEditor
                    initialCode={exercise.initialCode}
                    hints={exercise.hints}
                    solution={exercise.solution}
                    onValidate={(output, code) => {
                      const isValid = exercise.validate(output, code)
                      if (isValid && !isCompleted) {
                        handleExerciseComplete(activeTab, index, exercise.xp)
                      }
                      return isValid
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="max-w-4xl mx-auto mt-6 text-center text-gray-600 text-sm">
        <p>
          Completed: {Object.keys(progress).length} exercises |
          Total XP: {totalXP} |
          Level: {userLevel}
        </p>
      </div>
    </div>
  )
}

export default App
