const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const usersRouter = require('./routes/users');
const newsRouter = require('./routes/articles');
const { createUser, loguin } =require('./controllers/users');



const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPCIONS"],
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


app.post('/api/signup', createUser);
app.post('/api/signin', loguin);

app.use('/api/users', usersRouter);
app.use('/api/articles', newsRouter);



app.listen(PORT, () => {
    console.log(`App listenin at PORT ${PORT}`)
});