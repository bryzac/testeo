const todolistRouter = require('express').Router();
const User = require('../models/user');
const Todolist = require('../models/todolist');

// todosRouter.get('/', async (request, response) => {
//     const cookies = request.cookies;
//     if (!cookies?.accessToken) {
//         await axios.get('/api/logout');
//         window.location.pathname = '/login';
//         return response.sendStatus(401);
//     }
// });

todolistRouter.get('/', async (request, response) => { 
    const user = request.user;
    const todolist = await Todolist.find({ user: user.id });
    return response.status(200).json(todolist);
});

todolistRouter.post('/', async (request, response) => { 
    const user = request.user;
    const { text } = request.body;
    const newTodo = new Todolist({
        text,
        checked: false,
        user: user._id
    });
    const savedTodo = await newTodo.save();
    console.log(savedTodo._id);
    user.todolist = user.todolist.concat(savedTodo._id);
    await user.save();

    return response.status(201).json(savedTodo);
});

todolistRouter.delete('/:id', async (request, response) => { 
    const user = request.user;
    await Todolist.findByIdAndDelete(request.params.id);

    user.todos = user.todos.pull(request.params.id);
    // user.todos = user.todos.filter(id => id.toString() !== request.params.id);
    await user.save();
    return response.sendStatus(204);
});


todolistRouter.patch('/:id', async (request, response) => { 
    const user = request.user;

    const { checked } = request.body;
    const { text } = request.body;

    await Todolist.findByIdAndUpdate(request.params.id, { checked });
    await Todolist.findByIdAndUpdate(request.params.id, { text });

    return response.sendStatus(200);
});

module.exports = todolistRouter;