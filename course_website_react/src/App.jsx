import { useState, useEffect } from 'react'
import './App.css'
import CodeEditor from './CodeEditor.jsx'
import jsPDF from 'jspdf'

function App() {
  const [activeTab, setActiveTab] = useState('level1')
  const [progress, setProgress] = useState(JSON.parse(localStorage.getItem('progress') || '{}'))
  const [hints, setHints] = useState({}) // { 'level1_0': { show: false, current: 0 } }
  const [showSolutions, setShowSolutions] = useState({}) // { 'level1_0': true }
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      const apiBase = import.meta.env.VITE_API_BASE || '/api';
      fetch(`${apiBase}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setCourseData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching courses:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = () => {
    const apiBase = import.meta.env.VITE_API_BASE || '/api';
    fetch(`${apiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          setToken(data.access_token);
          localStorage.setItem('token', data.access_token);
        } else {
          alert('Login failed');
        }
      });
  };

  const exportProgress = () => {
    const data = JSON.stringify(progress, null, 2);
    navigator.clipboard.writeText(data).then(() => {
      alert('Progress copied to clipboard!');
    });
  };

  const importProgress = () => {
    const data = prompt('Paste your progress JSON:');
    if (data) {
      try {
        const imported = JSON.parse(data);
        setProgress(imported);
        localStorage.setItem('progress', JSON.stringify(imported));
        alert('Progress imported successfully!');
      } catch (e) {
        alert('Invalid JSON');
      }
    }
  };

  const isAllCompleted = () => {
    const allExercises = Object.values(levels).flatMap(level => level.exercises || []).length;
    return Object.keys(progress).length === allExercises;
  };

  const generateCertificate = () => {
    if (!isAllCompleted()) {
      alert('Complete all exercises to get your certificate!');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Certificate of Completion', 105, 50, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Data Analyst Course', 105, 70, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Congratulations! You have completed all levels.', 105, 90, { align: 'center' });
    doc.text(`Completed on: ${new Date().toLocaleDateString()}`, 105, 110, { align: 'center' });
    doc.save('certificate.pdf');
  };

  const levels = courseData || {}

  const handleExerciseComplete = (level, exerciseIndex) => {
    const newProgress = { ...progress, [`${level}_${exerciseIndex}`]: true }
    setProgress(newProgress)
    localStorage.setItem('progress', JSON.stringify(newProgress))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading courses...</div>
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
        <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-2xl mb-4">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full mb-2 p-2 border"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full mb-4 p-2 border"
          />
          <button onClick={handleLogin} className="pixel-button px-4 py-2 bg-blue-500 text-white">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <div className="flex justify-between items-center mb-8">
        <div className="pixel-title text-center flex-1">
          <h1 className="text-4xl text-data-deep">🌲 Data Analyst Course 🌲</h1>
          <p className="text-data-moss">Interactive Learning Platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportProgress}
            className="pixel-button px-3 py-1 bg-blue-500 text-white text-sm"
          >
            📤 Export Progress
          </button>
          <button
            onClick={importProgress}
            className="pixel-button px-3 py-1 bg-green-500 text-white text-sm"
          >
            📥 Import Progress
          </button>
          <a
            href="https://github.com/ehadsagency-ai/data-analyst-course-app/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-button px-3 py-1 bg-orange-500 text-white text-sm"
          >
            💬 Community
          </a>
          <button
            onClick={toggleTheme}
            className="pixel-button px-3 py-1 bg-gray-600 text-white text-sm"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
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
      
       <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-2xl text-code-dark mb-4">{levels[activeTab].title}</h2>
          <p className="text-code-light mb-4">{levels[activeTab].content}</p>
          <p className="text-code-light mb-2"><strong>Notebook Count:</strong> {levels[activeTab].notebook_count}</p>
          <p className="text-code-light mb-2"><strong>Duration:</strong> {levels[activeTab].duration}</p>
          <p className="text-code-light mb-2"><strong>Topics:</strong> {levels[activeTab].topics?.join(', ') || 'N/A'}</p>
          <p className="text-code-light mb-4"><strong>Key Notebooks:</strong> {levels[activeTab].key_notebooks?.join(', ') || 'N/A'}</p>
         {levels[activeTab].videoUrl && (
           <div className="mb-4">
             <iframe
               width="100%"
               height="315"
               src={levels[activeTab].videoUrl}
               title="Lesson Video"
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             ></iframe>
           </div>
         )}
        
        {levels[activeTab].exercises && (
          <div className="exercises mb-6">
            <h3 className="text-xl mb-2">Exercises</h3>
            {levels[activeTab].exercises.map((exercise, index) => {
              const hintKey = `${activeTab}_${index}`;
              const currentHint = hints[hintKey];
              return (
                <div key={index} className="exercise mb-6 p-4 rounded" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h4 className="font-bold">{exercise.title}</h4>
                  <p className="mb-2">{exercise.description}</p>
                  <div className="mb-2 flex gap-2">
                    {exercise.hints && (
                      <button
                        onClick={() => {
                          setHints(prev => ({
                            ...prev,
                            [hintKey]: {
                              show: !prev[hintKey]?.show,
                              current: prev[hintKey]?.current || 0
                            }
                          }));
                        }}
                        className="pixel-button px-3 py-1 bg-yellow-500 text-white text-sm"
                      >
                        💡 Hints
                      </button>
                    )}
                    {exercise.solution && (
                      <button
                        onClick={() => {
                          setShowSolutions(prev => ({
                            ...prev,
                            [hintKey]: !prev[hintKey]
                          }));
                        }}
                        className="pixel-button px-3 py-1 bg-red-500 text-white text-sm"
                      >
                        👁️ Show Solution
                      </button>
                    )}
                  </div>
                  {currentHint?.show && exercise.hints && (
                    <div className="mb-2 p-2 bg-yellow-100 rounded">
                      <p>{exercise.hints[currentHint.current]}</p>
                      {currentHint.current < exercise.hints.length - 1 && (
                        <button
                          onClick={() => {
                            setHints(prev => ({
                              ...prev,
                              [hintKey]: {
                                ...prev[hintKey],
                                current: prev[hintKey].current + 1
                              }
                            }));
                          }}
                          className="mt-1 text-sm text-blue-600 underline"
                        >
                          Next Hint
                        </button>
                      )}
                    </div>
                  )}
                  {showSolutions[hintKey] && exercise.solution && (
                    <div className="mb-2 p-2 bg-red-100 rounded">
                      <h5 className="font-bold">Solution:</h5>
                      <pre className="text-sm">{exercise.solution}</pre>
                    </div>
                  )}
                  <CodeEditor
                    initialCode={exercise.initialCode}
                    disableValidate={showSolutions[hintKey]}
                    onRun={(output) => {
                      // Simple validation: if code ran without error and has output
                      if (output && !output.includes('Error')) {
                        handleExerciseComplete(activeTab, index)
                        alert('Exercise completed!')
                      }
                    }}
                  />
                  {progress[`${activeTab}_${index}`] && <p className="completion-badge text-green-600 mt-2 text-lg">🎉 Completed! 🎉</p>}
                </div>
              );
            })}
          </div>
        )}
        
         <div className="mt-4 flex gap-2">
           <button className="pixel-button px-6 py-2 bg-data-moss text-white">
             Start Learning
           </button>
           {isAllCompleted() && (
             <button
               onClick={generateCertificate}
               className="pixel-button px-6 py-2 bg-purple-600 text-white"
             >
               🏆 Get Certificate
             </button>
           )}
         </div>
      </div>
    </div>
  )
}

export default App
