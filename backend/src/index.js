const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/app_cicd';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando correctamente'
  });
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = await Task.create({
    title: req.body.title
  });

  res.status(201).json(task);
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conexión exitosa a MongoDB');

    app.listen(PORT, () => {
      console.log(`API escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();