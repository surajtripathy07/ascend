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

  return (
    <div onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          rows="10"
          style={{ width: '100%' }}
        />
      ) : (
        <ReactMarkdown>{text}</ReactMarkdown>
      )}
    </div>
  );
};

export default EditableMarkdown;

