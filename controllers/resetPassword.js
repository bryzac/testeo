const resetPasswordRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilities/sendEmail');


resetPasswordRouter.post('/', async (request, response) => {
    const { email } = request.body;
    const user = await User.findOne({ email });
    if (!user) {
        return response.status(400).json({ error: 'El usaurio no existe' })
    }

    const userForToken = {
        id: user.id
    }

    const resetToken = jwt.sign(userForToken, process.env.ACCES_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    // Enviar correo
    const subjectEmail = 'Recuperar contraseña';
    const htmlBody = 'recuperar tu contraseña';
    const url = `resetPassword/${resetToken}`;
    sendEmail(user.name, user.email, subjectEmail, htmlBody, url);

    return response.sendStatus(200);
});

resetPasswordRouter.get('/:token', async (request, response) => {
    try {
        const token = await request.params.token;
        return response.sendStatus(200);
    } catch (error) {
        // await axios.get('/api/logout');
        // window.location.pathname = '/login';
        console.log(error);
        return response.status(404).json({ error: 'Token no encontrado' });
    }
});

resetPasswordRouter.patch('/:token', async (request, response) => {
    const token = await request.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
    const id = decodedToken.id;
    const { password } = request.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await User.findByIdAndUpdate(id, { passwordHash });
    return response.sendStatus(200);
});

    

module.exports = resetPasswordRouter;