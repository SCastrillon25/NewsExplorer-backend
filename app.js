const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { celebrate, Segments, errors } = require('celebrate');
const Joi = require('joi');


dotenv.config();


const usersRouter = require('./routes/users');
const newsRouter = require('./routes/articles');
const errorHandler = require('./middleware/errorHandler');
const { createUser, loguin } =require('./controllers/users');
const {requestLogger, errorLogger} = require('./middleware/logger');
const auth = require('./middleware/auth');


const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

const {
    PORT,
    MONGO_URL,
} = process.env;

mongoose.connect(MONGO_URL)
 .then(() => {
    console.log('Conectado a MongoDB')
 })
 .catch((error) => {
    console.error('Error al conectar a MongoDB', error)
 });



app.use(requestLogger);
 
app.post('/signup', 
     celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required().required(),
            username: Joi.string().required().max(30),
        }),
     }), 
     createUser);
app.post('/signin',
     celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required().required(),
        }),
     }) , loguin);

app.use('/users', auth, usersRouter);
app.use('/articles', auth, newsRouter);

app.use((req, res, next) => {
  const err = new Error('Recurso solicitado no encontrado');
  err.statusCode = 404;
  return next(err);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening at PORT ${PORT}`)
});