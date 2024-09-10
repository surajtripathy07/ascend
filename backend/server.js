const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todo-app');

const Todo = require('./models/Todo');

app.post('/todos', async (req, res) => {
  const todo = new Todo({
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await todo.save();
  res.status(201).json(todo);
});

app.get('/todos', async (req, res) => {
  const todos = await Todo.find({ lane: { $ne: null } });
  res.send(todos);
});

app.get('/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.send(todo);
});

app.put('/todos/:id', async (req, res) => {
  console.log("Updating todo"+ req.body)
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(todo);
});

app.put('/update-lanes', async (req, res) => {
  const { lanes } = req.body;
  console.log("Updating lanes")
  try {
    for (const lane in lanes) {
      for (const item of lanes[lane].items) {
        const type = lane === 'Today' ? 'todo' : 'goal';
        await Todo.findByIdAndUpdate(item._id, { lane, type });
      }
    }
    res.status(200).send('Lanes updated');
  } catch (error) {
    res.status(500).send('Error updating lanes');
  }
});

app.get('/todos/children/:parentId', async (req, res) => {
  const { parentId } = req.params;
  const todos = await Todo.find({ parentId });
  res.send(todos);
});

app.delete('/todos/:id', async (req, res) => {
  const deleteTodoAndChildren = async (id) => {
    const todo = await Todo.findById(id);
    if (todo) {
      const children = await Todo.find({ parentId: todo._id });
      for (const child of children) {
        await deleteTodoAndChildren(child._id);
      }
      await Todo.findByIdAndDelete(id);
    }
  };

  try {
    await deleteTodoAndChildren(req.params.id);
    res.status(200).send('Todo and its children deleted');
  } catch (error) {
    res.status(500).send('Error deleting todo and its children');
  }
});

app.listen(5921, () => {
  console.log('Server is running on port 5921');
});

