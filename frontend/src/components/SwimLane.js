import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Paper, Typography, Box, TextField } from '@mui/material';
import TodoModal from './TodoModal';
import TodoItem from './TodoItem';
import '../css/SwimLane.css';  // Import the scoped CSS file

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
              <TodoItem
                key={todo._id}
                todo={todo}
                index={index}
                handleTodoCompletion={handleTodoCompletion}
                handleTodoDoubleClick={handleTodoDoubleClick}
                deleteTodo={deleteTodo}
              />
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
