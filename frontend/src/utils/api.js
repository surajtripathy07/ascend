import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5921',
});

export const fetchTodos = async () => {
  try {
    const response = await api.get('/todos');
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const addTodo = async (newTodoItem) => {
  try {
    const response = await api.post('/todos', newTodoItem);
    return response.data;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (todo) => {
  try {
    const response = await api.put(`/todos/${todo._id}`, todo);
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const updateLanes = async (lanes) => {
  try {
    await api.put('/update-lanes', { lanes });
  } catch (error) {
    console.error('Error updating lanes:', error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    await api.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const fetchChildren = async (parentId) => {
  try {
    await api.get(`/todos/children/${parentId}`);
  } catch (error) {
    console.error('Error fetchChildren todo:', error);
    throw error;
  }
};

