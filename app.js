require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const resetPasswordRouter = require('./controllers/resetPassword');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const todosRouter = require('./controllers/todos');
const { userExtractor } = require('./middleware/auth');
const { MONGO_URI } = require('./config');

(async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado MongoDB');;
    } catch (error) {
        console.log(error);
    }
})();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Rutas frontend
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/resetPassword', express.static(path.resolve('views', 'resetPassword')));
app.use('/resetPassword/:token', express.static(path.resolve('views', 'resetPassword')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/images', express.static(path.resolve('img')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));
app.use('/todolist', express.static(path.resolve('views', 'todolist')));
app.use('/todos', express.static(path.resolve('views', 'todos')));

app.use(morgan('tiny'));

// Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/resetPassword', resetPasswordRouter);
app.use('/api/todos', userExtractor, todosRouter);


module.exports = app;
