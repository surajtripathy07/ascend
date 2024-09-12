import React, { useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box, Typography, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import { Delete, DragIndicator } from '@mui/icons-material';
import '../css/TodoItem.css';  // Import the scoped CSS file

const TodoItem = ({ todo, index, handleTodoCompletion, handleTodoDoubleClick, deleteTodo }) => {
  const clickTimeoutRef = useRef(null);  // Ref to track single click timeout

  const handleClick = (e) => {
    e.stopPropagation();

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    clickTimeoutRef.current = setTimeout(() => {
      handleTodoCompletion(todo);
    }, 200);
  };

  const handleDoubleClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    handleTodoDoubleClick(todo);
  };

  return (
    <Draggable key={todo._id} draggableId={todo._id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="todo-item"
          style={{ ...provided.draggableProps.style }}
          onDoubleClick={handleDoubleClick}  // Trigger double-click action
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={todo.isCompleted}
                onClick={handleClick}  // Handle single click for checkbox
              />
            }
            label={
              <Typography
                variant="body1"
                className="todo-text"
                style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}
                onDoubleClick={handleDoubleClick}  // Handle double-click on text
              >
                {todo.title}
              </Typography>
            }
          />
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => deleteTodo(todo._id)}>
              <Delete />
            </IconButton>
            <IconButton
              {...provided.dragHandleProps}
              aria-label="drag"
              style={{ cursor: 'grab' }}
            >
              <DragIndicator />
            </IconButton>
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export default TodoItem;
