import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const EditableMarkdown = ({ text, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setValue(text); // Ensure value is updated when text prop changes
  }, [text]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(value); // Save the value when exiting edit mode
  };

  return (
    <div onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
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
