import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ initialCode, onRun, onValidate, hints = [], solution = '' }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Load Pyodide on component mount
  useEffect(() => {
    async function loadPyodideInstance() {
      try {
        const { loadPyodide } = await import('pyodide');
        const pyodideInstance = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/'
        });

        // Load common data science packages
        setOutput('Loading Python packages (numpy, pandas, matplotlib)...');
        await pyodideInstance.loadPackage(['numpy', 'pandas', 'matplotlib']);

        setPyodide(pyodideInstance);
        setLoading(false);
        setOutput('✅ Python environment ready! Write your code and click "Run Code".');
      } catch (error) {
        setOutput(`❌ Error loading Python: ${error.message}`);
        setLoading(false);
      }
    }

    loadPyodideInstance();
  }, []);

  const runCode = async () => {
    if (!pyodide) {
      setOutput('⏳ Python environment is still loading...');
      return;
    }

    setIsRunning(true);
    setOutput('🔄 Running code...');

    try {
      // Redirect stdout to capture print statements
      await pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
      `);

      // Run user code
      await pyodide.runPythonAsync(code);

      // Get captured output
      const stdout = pyodide.runPython('sys.stdout.getvalue()');

      if (stdout) {
        setOutput(`✅ Success!\n\n${stdout}`);
        onRun && onRun('success', stdout);
      } else {
        setOutput('✅ Code executed successfully! (No output)');
        onRun && onRun('success', '');
      }
    } catch (error) {
      const errorMsg = error.message || String(error);
      setOutput(`❌ Error:\n\n${errorMsg}`);
      onRun && onRun('error', errorMsg);
    } finally {
      setIsRunning(false);
    }
  };

  const validateCode = async () => {
    if (!pyodide) {
      setOutput('⏳ Python environment is still loading...');
      return;
    }

    setIsRunning(true);

    try {
      // Run the code first
      await pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
      `);

      await pyodide.runPythonAsync(code);
      const stdout = pyodide.runPython('sys.stdout.getvalue()');

      // Call validation callback with output
      if (onValidate) {
        const isValid = onValidate(stdout, code);
        if (isValid) {
          setOutput(`✅ Validation passed!\n\n${stdout}`);
        } else {
          setOutput(`⚠️ Validation failed. Check the requirements.\n\n${stdout}`);
        }
      }
    } catch (error) {
      setOutput(`❌ Error during validation:\n\n${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const showNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const toggleSolution = () => {
    if (!showSolution && solution) {
      setCode(solution);
      setShowSolution(true);
    } else {
      setCode(initialCode);
      setShowSolution(false);
      setCurrentHintIndex(-1);
    }
  };

  return (
    <div className="code-editor">
      <Editor
        height="300px"
        language="python"
        value={code}
        onChange={setCode}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />

      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={runCode}
          disabled={loading || isRunning}
          className="pixel-button px-4 py-2 bg-data-deep text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? '⏳ Running...' : '▶️ Run Code'}
        </button>

        <button
          onClick={validateCode}
          disabled={loading || isRunning}
          className="pixel-button px-4 py-2 bg-data-moss text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Validate
        </button>

        {hints.length > 0 && (
          <button
            onClick={showNextHint}
            disabled={currentHintIndex >= hints.length - 1}
            className="pixel-button px-4 py-2 bg-yellow-600 text-white disabled:opacity-50"
          >
            💡 Hint ({currentHintIndex + 1}/{hints.length})
          </button>
        )}

        {solution && (
          <button
            onClick={toggleSolution}
            className="pixel-button px-4 py-2 bg-purple-600 text-white"
          >
            {showSolution ? '🔄 Reset' : '👁️ Show Solution'}
          </button>
        )}
      </div>

      {currentHintIndex >= 0 && hints[currentHintIndex] && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="font-bold text-yellow-800">💡 Hint {currentHintIndex + 1}:</p>
          <p className="text-yellow-900">{hints[currentHintIndex]}</p>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded font-mono text-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-green-300">Output:</h3>
          {loading && <span className="text-yellow-400 text-xs">Loading Python...</span>}
        </div>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}

export default CodeEditor;
