import React, { useEffect, useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { TodoContext } from '../context/TodoContext';
import { Box } from '@mui/material';
import SwimLane from './SwimLane';
import '../css/SwimLanes.css';  // Import the new CSS file
import { fetchTodos, addTodo, updateTodo, updateLanes, deleteTodo } from '../utils/api';

const SwimLanes = () => {
  const { state, dispatch } = useContext(TodoContext);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await fetchTodos();
        dispatch({ type: 'SET_TODOS', payload: todos });
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };

    loadTodos();
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
      await updateLanes(updatedLanes);
    } catch (error) {
      console.error('Error updating lanes:', error);
    }
  };

  const handleAddTodoInline = async (lane, title) => {
    const newTodoItem = { title, description: '', type: lane === 'Today' ? 'todo' : 'goal', isCompleted: false, lane };
    try {
      const addedTodo = await addTodo(newTodoItem);
      dispatch({ type: 'ADD_TODO', payload: addedTodo });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleTodoCompletion = async (todo) => {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    try {
      if (updatedTodo.isCompleted) {
        updatedTodo.completedAt = new Date();
      } else {
        updatedTodo.completedAt = null;
      }
      await updateTodo(updatedTodo);
      dispatch({ type: 'SET_TODOS', payload: state.todos.map(t => (t._id === updatedTodo._id ? updatedTodo : t)) });
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

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
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
              deleteTodo={handleDeleteTodo}
            />
          </Box>
        ))}
      </DragDropContext>
    </Box>
  );
};

export default SwimLanes;
