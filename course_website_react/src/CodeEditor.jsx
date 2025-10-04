 import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ initialCode, onRun, onValidate, disableValidate = false }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/"
        });
        await pyodideInstance.loadPackage(['numpy', 'pandas']);
        setPyodide(pyodideInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        setOutput('Error: Failed to load Pyodide');
        setIsLoading(false);
      }
    };

    if (!window.loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js';
      script.onload = loadPyodide;
      document.head.appendChild(script);
    } else {
      loadPyodide();
    }
  }, []);

  const runCode = async () => {
    if (!pyodide) {
      setOutput('Pyodide is not loaded yet.');
      return;
    }

    try {
      // Capture stdout
      pyodide.runPython(`
import sys
from io import StringIO
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()
      `);

      // Run the user's code
      pyodide.runPython(code);

      // Get the captured output
      const result = pyodide.runPython('captured_output.getvalue()');

      // Restore stdout
      pyodide.runPython('sys.stdout = old_stdout');

      setOutput(result || 'Code executed successfully (no output)');
      onRun && onRun('success');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      onRun && onRun('error');
    }
  };

  const validateCode = () => {
    // Simple validation - check for basic Python syntax
    try {
      if (pyodide) {
        pyodide.runPython(code); // Try to compile
      }
      const hasPrint = code.includes('print');
      onValidate && onValidate({ hasPrint, valid: true });
    } catch (error) {
      onValidate && onValidate({ hasPrint: false, valid: false, error: error.message });
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
      />
      <div className="mt-4 flex gap-2">
        <button
          onClick={runCode}
          disabled={isLoading}
          className="pixel-button px-4 py-2 bg-data-deep text-white disabled:opacity-50"
        >
          {isLoading ? 'Loading Pyodide...' : 'Run Code'}
        </button>
        <button
          onClick={validateCode}
          disabled={disableValidate}
          className="pixel-button px-4 py-2 bg-data-moss text-white disabled:opacity-50"
        >
          Validate
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-bold mb-2">Terminal Output:</h3>
        <div className="terminal-output">{output}</div>
      </div>
    </div>
  );
}

export default CodeEditor;
