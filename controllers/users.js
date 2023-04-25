const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilities/sendEmail');

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
       return response.status(400).json({ error: 'Todos los espacios son requeridos' });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return response.status(400).json({ error: 'El email ya se encuentra en uso' });
      
    }


    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const newUser = new User({
        name,
        email,
        passwordHash,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser.id }, process.env.ACCES_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    // Enviar correo
    const subjectEmail = 'Verificación de usuario';
    const htmlBody = 'verificar tu correo';
    const url = `verify/${savedUser.id}/${token}`;
    sendEmail(savedUser.name, savedUser.email, subjectEmail, htmlBody, url);

    return response.status(201).json('Usuario creado. Por favor, verifica tu correo');
});


usersRouter.patch('/:id/:token', async (request, response) => {
  try {
    const token = request.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
    const id = decodedToken.id;
    await User.findByIdAndUpdate(id, { verified: true });
    return response.sendStatus(200)
  } catch (error) {
    //Encontrar el email del usaurio
    const id = request.params.id;
    const { email } = await User.findById(id);

    // Firmar el nuevo token
    const token = jwt.sign({ id: id }, process.env.ACCES_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    // Enviar correo
    const { name } = await User.findById(id);
    const subjectEmail = 'Verificación de usuario';
    const htmlBody = 'verificar tu correo';
    const url = `verify/${id}/${token}`;
    sendEmail(name, email, subjectEmail, htmlBody, url);
    
    return response.status(400).json({ error: 'El link ya expiró. Se ha enviado un nuevo link de verificación a su correo.' });
  }
  
});

module.exports = usersRouter;
