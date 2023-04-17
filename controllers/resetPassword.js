const resetPasswordRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');


resetPasswordRouter.post('/', async (request, response) => {
    const { email } = request.body;
    const user = await User.findOne({ email });
    console.log(email);
    if (!user) {
        return response.status(400).json({ error: 'El usaurio no existe' })
    }

    const userForToken = {
        id: user.id
    }

    const resetToken = jwt.sign(userForToken, process.env.ACCES_TOKEN_SECRET, {
        expiresIn: '1d'
    });


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: user.email, // list of receivers
        subject: 'Recuperar contraseña', // Subject line
        html: `<a href="${PAGE_URL}/resetPassword/${resetToken}">Recuperar contraseña</a>`, // html body
    });

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