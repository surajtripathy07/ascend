import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Box } from '@mui/material';
import TodoModalContent from './TodoModalContent';
import { fetchChildren, addTodo, updateTodo, deleteTodo as apiDeleteTodo } from '../utils/api';
import '../css/TodoModal.css';  // Import the scoped CSS file

const TodoModal = ({ open, handleClose, todo, onSave, parentTodo, updateLane, deleteTodo }) => {
  const [description, setDescription] = useState(todo.description);
  const [children, setChildren] = useState([]);
  const [newChildTitle, setNewChildTitle] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [childForMenu, setChildForMenu] = useState(null);

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

  const handleSave = async () => {
    try {
      const updatedTodo = { ...todo, description };
      await updateTodo(updatedTodo);
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
      const response = await addTodo(newChildTodo);
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

  // const handleSaveChild = async (updatedChild) => {
  //   try {
  //     await updateTodo(updatedChild);
  //     setChildren(children.map(c => (c._id === updatedChild._id ? updatedChild : c)));
  //     setSelectedChild(updatedChild);
  //     updateLane(updatedChild); // Update the parent component's state
  //   } catch (error) {
  //     console.error('Error saving child todo:', error);
  //   }
  // };

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
      await updateTodo(updatedChild);
      setChildren(children.map(c => (c._id === updatedChild._id ? updatedChild : c)));
      handleMenuClose();
      updateLane(updatedChild); // Update the parent component's state
    } catch (error) {
      console.error('Error moving todo to lane:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await apiDeleteTodo(id);
      if (id === todo._id) {
        handleClose();
      } else {
        setChildren(children.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <TodoModalContent
          todo={todo}
          handleSave={handleSave}
          handleMenuClick={handleMenuClick}
          handleMenuClose={handleMenuClose}
          handleMoveToLane={handleMoveToLane}
          handleDeleteTodo={handleDeleteTodo}
          parentTodo={parentTodo}
          anchorEl={anchorEl}
          children={children}
          handleAddChild={handleAddChild}
          handleChildCompletion={handleChildCompletion}
          handleChildDoubleClick={handleChildDoubleClick}
          setNewChildTitle={setNewChildTitle}
          newChildTitle={newChildTitle}
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
          childModalOpen={childModalOpen}
          setChildModalOpen={setChildModalOpen}
          handleCloseChildModal={handleCloseChildModal}
        />
      </Box>
    </Modal>
  );
};

export default TodoModal;
