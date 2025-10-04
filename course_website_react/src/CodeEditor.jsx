import { useState } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ initialCode, onRun, onValidate }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');

  const runCode = () => {
    // Placeholder for now - simulate output
    setOutput('Code executed successfully!');
    onRun && onRun('success');
  };

  const validateCode = () => {
    // Simple validation
    const hasPrint = code.includes('print');
    onValidate && onValidate({ hasPrint });
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
        <button onClick={runCode} className="pixel-button px-4 py-2 bg-data-deep text-white">
          Run Code
        </button>
        <button onClick={validateCode} className="pixel-button px-4 py-2 bg-data-moss text-white">
          Validate
        </button>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default CodeEditor;
