const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
};

// Load Todo model
const Todo = require('./models/Todo');

// Route to create a new todo
app.post('/todos', async (req, res, next) => {
  try {
    const todo = new Todo({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    next(error); // Forward to error handler
  }
});

// Route to get all todos
app.get('/todos', async (req, res, next) => {
  try {
    const today = new Date();
    // Set the time to the beginning of the day (00:00:00)
    today.setHours(0, 0, 0, 0);

    const todos = await Todo.find({
      lane: { $ne: null },
      isDeleted: { $in: [false, null] },
      $or: [
        { completedAt: null },
        { completedAt: { $gte: today } }
       ]
    });
    res.status(200).json(todos);
  } catch (error) {
    next(error); // Forward to error handler
  }
});

// Route to get a todo by ID
app.get('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error); // Forward to error handler
  }
});

// Route to update a todo by ID
app.put('/todos/:id', async (req, res, next) => {
  try {
    console.log("Todo ID: ", req.params.id);
    console.log("Updating todo: ", req.body);
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error); // Forward to error handler
  }
});

// Route to update lanes
app.put('/update-lanes', async (req, res, next) => {
  const { lanes } = req.body;
  console.log("Updating lanes");
  try {
    for (const lane in lanes) {
      for (const item of lanes[lane].items) {
        const type = lane === 'Today' ? 'todo' : 'goal';
        await Todo.findByIdAndUpdate(item._id, { lane, type });
      }
    }
    res.status(200).send('Lanes updated');
  } catch (error) {
    next(error); // Forward to error handler
  }
});

// Route to get todos by parentId
app.get('/todos/children/:parentId', async (req, res, next) => {
  try {
    const { parentId } = req.params;
    const todos = await Todo.find({ parentId });
    res.status(200).json(todos);
  } catch (error) {
    next(error); // Forward to error handler
  }
});

// Route to delete a todo and its children
app.delete('/todos/:id', async (req, res, next) => {
  const deleteTodoAndChildren = async (id) => {
    const todo = await Todo.findById(id);
    if (todo) {
      const children = await Todo.find({ parentId: todo._id });
      for (const child of children) {
        await deleteTodoAndChildren(child._id);
      }
      const isDeleted = true;
      await Todo.findByIdAndUpdate(id, { isDeleted });
    }
  };

  try {
    await deleteTodoAndChildren(req.params.id);
    res.status(200).send('Todo and its children deleted');
  } catch (error) {
    next(error); // Forward to error handler
  }
});

// Error-handling middleware
app.use(errorHandler);

app.listen(5921, () => {
  console.log('Server is running on port 5921');
});
