import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { TodoContext } from '../context/TodoContext';
import { Box } from '@mui/material';
import axios from 'axios';
import SwimLane from './SwimLane';
import '../css/SwimLanes.css';  // Import the new CSS file

const SwimLanes = () => {
  const { state, dispatch } = useContext(TodoContext);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/todos');
        dispatch({ type: 'SET_TODOS', payload: response.data });
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [dispatch]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceLane = state.lanes[source.droppableId];
    const destinationLane = state.lanes[destination.droppableId];
    const [movedItem] = sourceLane.items.splice(source.index, 1);

    movedItem.lane = destination.droppableId;
    movedItem.type = destination.droppableId === 'Today' ? 'todo' : 'goal';

    destinationLane.items.splice(destination.index, 0, movedItem);

    const updatedLanes = {
      ...state.lanes,
      [source.droppableId]: sourceLane,
      [destination.droppableId]: destinationLane
    };

    dispatch({
      type: 'UPDATE_LANES',
      payload: updatedLanes
    });

    try {
      await axios.put('http://localhost:5000/update-lanes', { lanes: updatedLanes });
    } catch (error) {
      console.error('Error updating lanes:', error);
    }
  };

  const handleAddTodo = async (lane, newTodoItem) => {
    try {
      const response = await axios.post('http://localhost:5000/todos', newTodoItem);
      dispatch({ type: 'ADD_TODO', payload: response.data });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleAddTodoInline = (lane, title) => {
    const newTodoItem = { title, description: '_(Add description here..)', type: lane === 'Today' ? 'todo' : 'goal', isCompleted: false, lane };
    handleAddTodo(lane, newTodoItem);
  };

  const handleTodoCompletion = async (todo) => {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    try {
      await axios.put(`http://localhost:5000/todos/${todo._id}`, updatedTodo);
      dispatch({ type: 'SET_TODOS', payload: state.todos.map(t => (t._id === todo._id ? updatedTodo : t)) });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const updateLane = (updatedTodo) => {
    const existingTodoIndex = state.todos.findIndex(t => t._id === updatedTodo._id);
    let updatedTodos;

    if (existingTodoIndex > -1) {
      updatedTodos = state.todos.map(t => (t._id === updatedTodo._id ? updatedTodo : t));
    } else {
      updatedTodos = [...state.todos, updatedTodo];
    }

    dispatch({ type: 'SET_TODOS', payload: updatedTodos });
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      const updatedTodos = state.todos.filter(t => t._id !== id);
      dispatch({ type: 'SET_TODOS', payload: updatedTodos });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <Box className="swimlane-container">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(state.lanes).map((lane) => (
          <Box key={lane} className="swimlane">
            <SwimLane
              lane={lane}
              items={state.lanes[lane].items}
              handleAddTodoInline={handleAddTodoInline} // Use handleAddTodoInline for inline addition
              handleTodoCompletion={handleTodoCompletion}
              updateTodo={updateLane}
              deleteTodo={deleteTodo}
            />
          </Box>
        ))}
      </DragDropContext>
    </Box>
  );
};

export default SwimLanes;
