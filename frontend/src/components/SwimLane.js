import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, Box, TextField, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import { Delete, DragIndicator } from '@mui/icons-material';
import TodoModal from './TodoModal';

const SwimLane = ({ lane, items, handleAddTodoInline, handleTodoCompletion, updateTodo, deleteTodo }) => {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const handleTodoDoubleClick = (todo) => {
    setSelectedTodo(todo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTodo(null);
  };

  const handleSave = (updatedTodo) => {
    updateTodo(updatedTodo);
    setSelectedTodo(updatedTodo); // Ensure the modal shows the updated description
  };

  const handleNewTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleNewTodoKeyPress = (e) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      handleAddTodoInline(lane, newTodo);
      setNewTodo('');
    }
  };

  return (
    <Paper elevation={3} className="swimlane">
      <Typography variant="h6" component="h3" className="swimlane-title">
        {lane}
      </Typography>
      <Droppable droppableId={lane}>
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps} padding={1} minHeight={100}>
            {items.map((todo, index) => (
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
            ))}
            {provided.placeholder}
            <Box className="new-todo-input">
              <TextField
                value={newTodo}
                onChange={handleNewTodoChange}
                onKeyPress={handleNewTodoKeyPress}
                placeholder={`Add new ${lane} todo...`}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        )}
      </Droppable>
      {selectedTodo && (
        <TodoModal
          open={modalOpen}
          handleClose={handleCloseModal}
          todo={selectedTodo}
          onSave={handleSave}
          updateLane={updateTodo} // Pass the updateLane function
          deleteTodo={deleteTodo}
        />
      )}
    </Paper>
  );
};

export default SwimLane;
