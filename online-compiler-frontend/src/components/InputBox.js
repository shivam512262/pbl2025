import React from 'react';

const InputBox = ({ input, setInput }) => {
  return (
    <div>
      <h2>Input</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="10"
        style={{ width: '100%', resize: 'vertical' }}
        placeholder="Enter input for your code here..."
      ></textarea>
    </div>
  );
};

export default InputBox;
