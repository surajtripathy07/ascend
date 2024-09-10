import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box, Typography, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import { Delete, DragIndicator } from '@mui/icons-material';
import '../css/TodoItem.css';  // Import the scoped CSS file

const TodoItem = ({ todo, index, handleTodoCompletion, handleTodoDoubleClick, deleteTodo, provided }) => (
  <Draggable key={todo._id} draggableId={todo._id} index={index}>
    {(provided, snapshot) => (
      <Box
        ref={provided.innerRef}
        {...provided.draggableProps}
        className="todo-item"
        style={{ ...provided.draggableProps.style }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={todo.isCompleted}
              onChange={() => handleTodoCompletion(todo)}
            />
          }
          label={
            <Typography
              variant="body1"
              className="todo-text"
              style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}
              onDoubleClick={() => handleTodoDoubleClick(todo)}
            >
              {todo.title}
            </Typography>
          }
          onClick={(e) => e.stopPropagation()} // Stop the event from bubbling up to the Box
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

export default TodoItem;
