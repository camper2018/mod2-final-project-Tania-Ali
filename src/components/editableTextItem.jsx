import React, { useState, useRef, useEffect } from 'react';

const EditableTextItem = ({ initialText , className, handleEdit, id}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef(null);
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  const handleChange = (event) => {
    setText(event.target.value);
    // Debounce effect
    setTimeout(()=> {
      handleEdit(initialText, event.target.value, id);
    },2000)
   
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Save the changes or perform any required actions here
  };
   // Focus the input field when editing starts
   useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  return (
    <span onDoubleClick={handleDoubleClick} className={className}>
      {isEditing ? (
       <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          ref={inputRef}
          className="fw-bold h6"
        />
      ) : (
        <span>{text}</span>
      )}
    </span>
  );
};
export default EditableTextItem;