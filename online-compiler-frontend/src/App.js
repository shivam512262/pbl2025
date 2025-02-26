import React, { useState } from 'react';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import InputBox from './components/InputBox';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('71'); // Default: Python 3
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const runCode = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/run`,
        {
          source_code: code,
          language_id: parseInt(language),
          stdin: input,
        }
      );
      setOutput(response.data.stdout || response.data.stderr || 'Error running code');
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error: Could not connect to backend.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '20px' }}>
      {/* Left Side: Language chooser, Code editor, and Run button */}
      <div style={{ flex: 1, marginRight: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px' }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="71">Python 3</option>
            <option value="50">C</option>
            <option value="54">C++</option>
            <option value="62">Java</option>
          </select>
        </div>
        <CodeEditor code={code} setCode={setCode} language={language} />
        <button onClick={runCode} style={{ marginTop: '10px' }}>Run Code</button>
      </div>

      {/* Right Side: Input and Output Boxes */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, marginBottom: '10px' }}>
          <InputBox input={input} setInput={setInput} />
        </div>
        <div style={{ flex: 1 }}>
          <Output output={output} />
        </div>
      </div>
    </div>
  );
}

export default App;
