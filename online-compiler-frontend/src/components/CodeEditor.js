import React from 'react';

const CodeEditor = ({ code, setCode, language }) => {
  const handleKeyDown = (e) => {
    // Handle Tab key: insert a tab character
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newCode = code.substring(0, selectionStart) + "\t" + code.substring(selectionEnd);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
      }, 0);
    }
    // Handle Enter key: auto-indent (with auto-closing curly brace for C, C++, Java)
    else if (e.key === 'Enter') {
      e.preventDefault();
      const { selectionStart } = e.target;
      // Get the current line's indentation by extracting leading whitespace
      const lastNewLine = code.lastIndexOf("\n", selectionStart - 1);
      const currentLine = code.substring(lastNewLine + 1, selectionStart);
      const indentMatch = currentLine.match(/^\s*/);
      let baseIndent = indentMatch ? indentMatch[0] : "";

      // For C, C++, or Java, check if the trimmed current line ends with '{'
      if ((language === "50" || language === "54" || language === "62") && currentLine.trim().endsWith("{")) {
        // Increase indentation by one level (using a tab)
        const extraIndent = "\t";
        const newIndent = baseIndent + extraIndent;
        // Insert a newline with the increased indent, then a newline with baseIndent plus the closing '}'
        const newCode = code.substring(0, selectionStart) +
          "\n" + newIndent + "\n" + baseIndent + "}" +
          code.substring(selectionStart);
        setCode(newCode);
        // Place the cursor in the middle (on the indented blank line)
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = selectionStart + 1 + newIndent.length;
        }, 0);
      } else {
        // For other cases, simply continue with the base indent
        let indentToInsert = baseIndent;
        // (Optional) For C++ you might want to adjust indentation based on net unmatched braces:
        if (language === "54") {
          const codeUpToCursor = code.substring(0, selectionStart);
          const openCount = (codeUpToCursor.match(/{/g) || []).length;
          const closeCount = (codeUpToCursor.match(/}/g) || []).length;
          let netIndent = openCount - closeCount;
          if (netIndent < 0) netIndent = 0;
          indentToInsert = "";
          for (let i = 0; i < netIndent; i++) {
            indentToInsert += "\t";
          }
        }
        const newCode = code.substring(0, selectionStart) + "\n" + indentToInsert + code.substring(selectionStart);
        setCode(newCode);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = selectionStart + 1 + indentToInsert.length;
        }, 0);
      }
    }
  };

  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      onKeyDown={handleKeyDown}
      rows="15"
      style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace' }}
      placeholder="Write your code here..."
    ></textarea>
  );
};

export default CodeEditor;
