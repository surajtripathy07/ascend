import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Menu, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import EditableMarkdown from './EditableMarkdown';
import { ArrowBack, MoreVert, Delete } from '@mui/icons-material';
import '../css/TodoModal.css';  // Import the scoped CSS file

const TodoModalContent = ({
  todo,
  handleSave,
  handleAddChild,
  handleChildCompletion,
  handleChildDoubleClick,
  handleMenuClick,
  handleMenuClose,
  handleMoveToLane,
  handleDeleteTodo,
  parentTodo,
  anchorEl,
  children = [], // Default to an empty array if undefined
  setNewChildTitle,
  newChildTitle,
  selectedChild,
  setSelectedChild,
  childModalOpen,
  setChildModalOpen,
  handleCloseChildModal,
  updateLane, // Added missing prop
  handleSaveChild, // Added missing prop
}) => {
  const [description, setDescription] = useState(todo.description);

  useEffect(() => {
    setDescription(todo.description);
  }, [todo]);

  return (
    <Box className="modal-content">
      <Box className="modal-header">
        <Typography variant="h6" component="h2">
          {todo.title}
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
      <EditableMarkdown text={description} onChange={setDescription} />
      <Button variant="contained" color="primary" onClick={() => handleSave({ ...todo, description })}>
        Save
      </Button>
      <Box className="modal-body">
        <Typography variant="h6" component="h4">
          Children
        </Typography>
        <TextField
          label="New Child Todo"
          value={newChildTitle}
          onChange={(e) => setNewChildTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddChild(newChildTitle);
              setNewChildTitle('');
            }
          }}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={() => { handleAddChild(newChildTitle); setNewChildTitle(''); }} fullWidth>
          Add Child Todo
        </Button>
        {children.length > 0 ? children.map(child => (
          <Box key={child._id} className="child-todo">
            <FormControlLabel
              control={
                <Checkbox
                  checked={child.isCompleted || false} // Safeguard for missing property
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
        )) : (
          <Typography>No children added yet.</Typography>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMoveToLane('Today')}>Move to Today</MenuItem>
          <MenuItem onClick={() => handleMoveToLane('Weekly')}>Move to Weekly</MenuItem>
          <MenuItem onClick={() => handleMoveToLane('Quarter')}>Move to Quarter</MenuItem>
          <MenuItem onClick={() => handleMoveToLane('Year')}>Move to Year</MenuItem>
          <MenuItem onClick={() => handleMoveToLane('LifeGoal')}>Move to LifeGoal</MenuItem>
        </Menu>
      </Box>
      {selectedChild && (
        <TodoModalContent
          open={childModalOpen}
          handleClose={handleCloseChildModal}
          todo={selectedChild}
          onSave={handleSaveChild}
          parentTodo={todo}
          updateLane={updateLane}
          deleteTodo={handleDeleteTodo}
        />
      )}
    </Box>
  );
};

export default TodoModalContent;
