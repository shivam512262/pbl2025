import React from 'react';

const Output = ({ output }) => {
  return (
    <div>
      <h2>Output:</h2>
      <pre style={{ background: '#f4f4f4', padding: '10px' }}>
        {output || 'No output.'}
      </pre>
    </div>
  );
};

export default Output;
