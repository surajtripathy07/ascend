import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const EditableMarkdown = ({ text, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
      {isEditing ? (
        <textarea
          value={value}
          onChange={handleChange}  // Update both local and parent state on each keystroke
          onBlur={handleBlur}  // Mark editing as done on blur
          autoFocus
          rows="10"
          style={{ width: '100%', padding: '10px', fontSize: '16px', lineHeight: '1.5' }}
        />
      ) : (
        <ReactMarkdown>{value || 'Click to edit...'}</ReactMarkdown>
      )}
    </div>
  );
};

export default EditableMarkdown;
