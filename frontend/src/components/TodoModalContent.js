import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Menu, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import EditableMarkdown from './EditableMarkdown';
import TodoModal from './TodoModal';
import { ArrowBack, MoreVert, Delete } from '@mui/icons-material';
import '../css/TodoModal.css';  // Import the scoped CSS file

const TodoModalContent = ({
  todo,
  handleSave,
  handleDeleteTodo,
  handleAddChild,
  children = [],
  setNewChildTitle,
  newChildTitle,
  handleMenuClick,
  anchorEl,
  handleMenuClose,
  handleMoveToLane,
  handleChildCompletion,
  handleChildDoubleClick,
  handleCloseChildModal,
  parentTodo,
  selectedChild,
  setSelectedChild,
  childModalOpen,
  setChildModalOpen,
  updateLane,
}) => {
  const [description, setDescription] = useState(todo.description);

  // Ensure that the description is properly set when the todo changes
  useEffect(() => {
    if (todo && todo.description) {
      setDescription(todo.description);
    }
  }, [todo]);

  if (!todo) {
    // Ensure the todo exists before rendering to avoid undefined errors
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="modal-content">
      <Box className="modal-header">
        <Typography variant="h6" component="h2">
          {todo.title || 'Untitled'}
        </Typography>
        <Box>
          <IconButton onClick={() => handleDeleteTodo(todo._id)}>
            <Delete />
          </IconButton>
          {parentTodo && (
            <IconButton onClick={handleCloseChildModal}>
              <ArrowBack />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Editable description */}
      <EditableMarkdown text={description} onChange={setDescription} />

      {/* Save Button */}
      <Button variant="contained" color="primary" onClick={() => handleSave({ ...todo, description }, false)}>
        Save
      </Button>

      <Box className="modal-body">
        <Typography variant="h6" component="h4">
          Children
        </Typography>

        {/* Add New Child Todo */}
        <TextField
          label="New Child Todo"
          value={newChildTitle}
          onChange={(e) => setNewChildTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newChildTitle.trim()) {
              handleAddChild(newChildTitle);
              setNewChildTitle('');  // Reset after adding
            }
          }}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (newChildTitle.trim()) {
              handleAddChild(newChildTitle);
              setNewChildTitle('');  // Clear the input field
            }
          }}
          fullWidth
        >
          Add Child Todo
        </Button>

        {/* List of Child Todos */}
        {children.length > 0 ? (
          children.map((child) => (
            child && (  // Ensure the child object is not undefined
              <Box key={child._id} className="child-todo">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!child.isCompleted}  // Safeguard for missing property
                      onChange={() => handleChildCompletion(child)}
                    />
                  }
                  label={
                    <Typography
                      variant="body1"
                      style={{ textDecoration: child.isCompleted ? 'line-through' : 'none' }}
                      onDoubleClick={() => handleChildDoubleClick(child)}
                    >
                      {child.title}
                    </Typography>
                  }
                />
                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => handleDeleteTodo(child._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={(event) => handleMenuClick(event, child)}>
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>
            )
          ))
        ) : (
          <Typography>No children added yet.</Typography>
        )}

        {/* Menu for Moving Todo */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleMoveToLane('Today')}>Move to Today</MenuItem>
          <MenuItem onClick={() => handleMoveToLane('Weekly')}>Move to Weekly</MenuItem>
          <MenuItem onClick={() => handleMoveToLane('Quarter')}>Move to Quarter</MenuItem>
          <MenuItem onClick={() => handleMoveToLane('Year')}>Move to Year</MenuItem>
          <MenuItem onClick={() => handleMoveToLane('LifeGoal')}>Move to LifeGoal</MenuItem>
        </Menu>
      </Box>

      {/* Child Modal for Selected Child */}
      {selectedChild && (
        <TodoModal
          open={childModalOpen}
          handleClose={handleCloseChildModal}
          todo={selectedChild}
          handleSave={handleSave}
          updateLane={updateLane}
          deleteTodo={handleDeleteTodo}
          parentTodo={todo}
        />
      )}
    </Box>
  );
};

export default TodoModalContent;
