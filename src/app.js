const express = require('express');
const healthRouter = require('./routes/health');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(tasksRouter);

module.exports = app;