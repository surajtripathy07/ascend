import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Menu, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import EditableMarkdown from './EditableMarkdown';
import axios from 'axios';
import { ArrowBack, MoreVert } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const TodoModal = ({ open, handleClose, todo, onSave, parentTodo, updateLane }) => {
  const [description, setDescription] = useState(todo.description);
  const [children, setChildren] = useState([]);
  const [newChildTitle, setNewChildTitle] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [childForMenu, setChildForMenu] = useState(null);

  const fetchChildren = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/todos/children/${todo._id}`);
      setChildren(response.data);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  }, [todo._id]);

  useEffect(() => {
    setDescription(todo.description);
    if (open) {
      fetchChildren();
    }
  }, [todo, open, fetchChildren]);

  const handleSave = async () => {
    try {
      const updatedTodo = { ...todo, description };
      await axios.put(`http://localhost:5000/todos/${todo._id}`, updatedTodo);
      onSave(updatedTodo);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleAddChild = async () => {
    if (!newChildTitle.trim()) return;
    try {
      const newChildTodo = {
        title: newChildTitle,
        description: '_(Add description here..)',
        isCompleted: false,
        parentId: todo._id,
        type: 'todo'
      };
      const response = await axios.post('http://localhost:5000/todos', newChildTodo);
      setChildren([...children, response.data]);
      setNewChildTitle('');
      updateLane(response.data); // Update the parent component's state
    } catch (error) {
      console.error('Error adding child todo:', error);
    }
  };

  const handleChildCompletion = async (child) => {
    const updatedChild = { ...child, isCompleted: !child.isCompleted };
    try {
      await axios.put(`http://localhost:5000/todos/${child._id}`, updatedChild);
      setChildren(children.map(c => (c._id === updatedChild._id ? updatedChild : c)));
      updateLane(updatedChild); // Update the parent component's state
    } catch (error) {
      console.error('Error updating child todo:', error);
    }
  };

  const handleChildDoubleClick = (child) => {
    setSelectedChild(child);
    setChildModalOpen(true);
  };

  const handleCloseChildModal = () => {
    setChildModalOpen(false);
    setSelectedChild(null);
  };

  const handleSaveChild = (updatedChild) => {
    setChildren(children.map(c => (c._id === updatedChild._id ? updatedChild : c)));
    setSelectedChild(updatedChild);
    updateLane(updatedChild); // Update the parent component's state
  };

  const handleMenuClick = (event, child) => {
    setAnchorEl(event.currentTarget);
    setChildForMenu(child);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setChildForMenu(null);
  };

  const handleMoveToLane = async (lane) => {
    if (!childForMenu) return;
    try {
      const updatedChild = { ...childForMenu, lane, type: lane === 'Today' ? 'todo' : 'goal' };
      await axios.put(`http://localhost:5000/todos/${childForMenu._id}`, updatedChild);
      setChildren(children.filter(c => c._id !== childForMenu._id));
      handleMenuClose();
      updateLane(updatedChild); // Update the parent component's state
    } catch (error) {
      console.error('Error moving todo to lane:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="h2">
            {todo.title}
          </Typography>
          {parentTodo && (
            <IconButton onClick={handleCloseChildModal}>
              <ArrowBack />
            </IconButton>
          )}
        </Box>
        <EditableMarkdown text={description} onChange={setDescription} />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Box mt={4}>
          <Typography variant="h6" component="h4">
            Children
          </Typography>
          <TextField
            label="New Child Todo"
            value={newChildTitle}
            onChange={(e) => setNewChildTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddChild();
              }
            }}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddChild} fullWidth>
            Add Child Todo
          </Button>
          {children.map(child => (
            <Box key={child._id} mt={2} display="flex" alignItems="center" justifyContent="space-between">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={child.isCompleted}
                    onChange={() => handleChildCompletion(child)}
                  />
                }
                label={<Typography variant="body1">{child.title}</Typography>}
                onDoubleClick={() => handleChildDoubleClick(child)}
              />
              <IconButton onClick={(event) => handleMenuClick(event, child)}>
                <MoreVert />
              </IconButton>
            </Box>
          ))}
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
          <TodoModal
            open={childModalOpen}
            handleClose={handleCloseChildModal}
            todo={selectedChild}
            onSave={handleSaveChild}
            parentTodo={todo}
            updateLane={updateLane}
          />
        )}
      </Box>
    </Modal>
  );
};

export default TodoModal;
