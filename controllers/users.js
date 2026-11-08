const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');


const loguin = async (req,res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        const userFound = await User.findOne({email}).select('+password');
        if (!userFound) {
            throw new UnauthorizedError('usuario o contraseña incorrecto');
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            userFound.password, 
        )

        if (!isPasswordValid) {
            throw new UnauthorizedError('usuario o contraseña incorrecto');
        }

        const token = jwt.sign(
            {
                _id: userFound._id,
                username: userFound.username,
            },
            
                process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            },
        );

        return res.status(200).json({
            message: 'Token generado correctamente',
            token,
        })
    } catch(error) {
        return next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const {
            email,
            password,
            username,
        } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password : hash,
            username,
        });

        return res.status(201).send({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        });
    } catch (error) {
    if (error.code === 11000) {
      throw new ConflictError('El correo ya está registrado');
    }

    if (error.name === 'ValidationError') {
      throw new BadRequestError('Datos inválidos');
    }

    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            throw new NotFoundError('Usuario no encontrado');
        }

        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
}

module.exports =  {
    createUser,
    loguin,
    getCurrentUser,
};