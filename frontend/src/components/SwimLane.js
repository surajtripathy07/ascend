import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, Box, TextField, Button, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import TodoModal from './TodoModal';
import { DragIndicator } from '@mui/icons-material';

const SwimLane = ({ lane, items, handleInputChange, handleAddTodo, laneInputs, handleTodoCompletion, updateTodo }) => {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <Paper elevation={3} className="swimlane">
      <Typography variant="h6" component="h3">
        {lane}
      </Typography>
      <TextField
        label={`Add to ${lane}`}
        value={laneInputs[lane]}
        onChange={(e) => handleInputChange(lane, e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleAddTodo(lane);
          }
        }}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={() => handleAddTodo(lane)} fullWidth>
        Add
      </Button>
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
                    onDoubleClick={() => handleTodoDoubleClick(todo)}
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
                        >
                          {todo.title}
                        </Typography>
                      }
                    />
                    <IconButton
                      {...provided.dragHandleProps}
                      aria-label="drag"
                      style={{ cursor: 'grab' }}
                    >
                      <DragIndicator />
                    </IconButton>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
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
        />
      )}
    </Paper>
  );
};

export default SwimLane;
