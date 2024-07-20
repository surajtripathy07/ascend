import React, { createContext, useReducer } from 'react';

const TodoContext = createContext();

const initialState = {
  todos: [],
  lanes: {
    Today: { id: 'Today', items: [] },
    Weekly: { id: 'Weekly', items: [] },
    Quarter: { id: 'Quarter', items: [] },
    Year: { id: 'Year', items: [] },
    LifeGoal: { id: 'LifeGoal', items: [] }
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      const updatedTodos = [...state.todos, action.payload];
      console.log('ADD_TODO updatedTodos:', updatedTodos);
      return { ...state, todos: updatedTodos, lanes: updateLanes(updatedTodos) };
    case 'SET_TODOS':
      console.log('SET_TODOS payload:', action.payload);
      return { ...state, todos: action.payload, lanes: updateLanes(action.payload) };
    case 'UPDATE_LANES':
      console.log('UPDATE_LANES payload:', action.payload);
      return { ...state, lanes: action.payload };
    default:
      return state;
  }
};

const updateLanes = (todos) => {
  const lanes = {
    Today: { id: 'Today', items: [] },
    Weekly: { id: 'Weekly', items: [] },
    Quarter: { id: 'Quarter', items: [] },
    Year: { id: 'Year', items: [] },
    LifeGoal: { id: 'LifeGoal', items: [] }
  };

  todos.forEach((todo) => {
    if (lanes[todo.lane]) {
      lanes[todo.lane].items.push(todo);
    }
  });

  console.log('Updated lanes:', lanes);
  return lanes;
};

const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

export { TodoContext, TodoProvider };

