import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Box } from '@mui/material';
import TodoModalContent from './TodoModalContent';
import { fetchChildren, addTodo, updateTodo, deleteTodo as apiDeleteTodo } from '../utils/api';
import '../css/TodoModal.css';  // Import the scoped CSS file

const TodoModal = ({ open, handleClose, todo, handleSave, updateLane, deleteTodo, parentTodo }) => {
  const [description, setDescription] = useState(todo.description);
  const [children, setChildren] = useState([]);
  const [newChildTitle, setNewChildTitle] = useState('');
  const [childForMenu, setChildForMenu] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childModalOpen, setChildModalOpen] = useState(false);

  const fetchChildrenData = useCallback(async () => {
    try {
      const response = await fetchChildren(todo._id);
      setChildren(response);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  }, [todo._id]);

  useEffect(() => {
    if (open) {
      fetchChildrenData();
    }
  }, [open, fetchChildrenData]);

  const handleMenuClick = (event, child) => {
    setAnchorEl(event.currentTarget);
    setChildForMenu(child);  // Set the selected child for the menu action
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setChildForMenu(null);
  };

  const handleChildCompletion = async (child) => {
    const updatedChild = { ...child, isCompleted: !child.isCompleted };
    try {
      await updateTodo(updatedChild);
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

  const handleMoveToLane = async (lane) => {
    if (!childForMenu) return;
    try {
      const updatedChild = { ...childForMenu, lane, type: lane === 'Today' ? 'todo' : 'goal' };
      await updateTodo(updatedChild);
      setChildren(children.map(c => (c._id === updatedChild._id ? updatedChild : c)));
      handleMenuClose();
      updateLane(updatedChild); // Update the parent component's state
    } catch (error) {
      console.error('Error moving todo to lane:', error);
    }
  };

  const handleAddChild = async () => {
    if (!newChildTitle.trim()) return;
    try {
      const newChildTodo = {
        title: newChildTitle,
        description: '',
        isCompleted: false,
        parentId: todo._id,
        type: 'todo'
      };
      const response = await addTodo(newChildTodo);

      // Make sure the response contains the correct child todo
      if (response && response.data) {
        setChildren([...children, response.data]);  // Add new child to state
        setNewChildTitle('');
        updateLane(response.data);  // Update the parent component's state
      } else {
        console.error('Error: Add child response is invalid');
      }
    } catch (error) {
      console.error('Error adding child todo:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <TodoModalContent
          todo={todo}
          handleSave={handleSave}
          handleDeleteTodo={deleteTodo}
          handleAddChild={handleAddChild}
          children={children}
          setNewChildTitle={setNewChildTitle}
          newChildTitle={newChildTitle}
          handleMenuClick={handleMenuClick}
          anchorEl={anchorEl}
          handleMenuClose={handleMenuClose}
          handleMoveToLane={handleMoveToLane}
          handleChildCompletion={handleChildCompletion}
          handleChildDoubleClick={handleChildDoubleClick}
          handleCloseChildModal={handleCloseChildModal}
          parentTodo={parentTodo}
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
          childModalOpen={childModalOpen}
          updateLane={updateLane}
        />
      </Box>
    </Modal>
  );
};

export default TodoModal;
