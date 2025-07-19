const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
app.use(cors({
  origin: 'https://phenomenal-jalebi-1bb3ab.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
  text: String,
  content: String,
  dueDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['onTime', 'late', 'notCompleted'], default: null }
});
const Task = mongoose.model('Task', taskSchema);

// Auth Middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).send('Invalid token');
  }
}

// Nodemailer Setup (Optional for reminders)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

function sendReminder(to, taskText, dueDate) {
  transporter.sendMail({
    from: `Task Manager <${process.env.SENDER_EMAIL}>`,
    to,
    subject: '📌 Task Reminder',
    html: `<p>Hey! Reminder: <strong>${taskText}</strong> is due on ${new Date(dueDate).toLocaleDateString()}</p>`
  });
}

// Auth Routes
app.post('/signup', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.post('/login', async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.status(401).send('Invalid');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// Task Routes
app.post('/tasks', auth, async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.id });
  res.json(task);
});

app.get('/tasks', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

app.delete('/tasks/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

app.patch('/tasks/:id/status', auth, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.get('/stats', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  const stats = {};

  tasks.forEach(task => {
    if (!task.dueDate || !task.status) return;

    const month = new Date(task.dueDate).toLocaleString('default', { month: 'long' });
    stats[month] = stats[month] || { onTime: 0, late: 0, notCompleted: 0 };
    stats[month][task.status]++;
  });

  res.json(stats);
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));
