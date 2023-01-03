const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const path = require("path");

dotenv.config();

//Connecting to MongoDB through the secret URL
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, () => {
        console.log("Connected to Mongodb")
    });

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use('*', cors())
app.use(express.json()) //body parser when you make a post request
app.use(helmet());
app.use(morgan("common"))

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)

const port = process.env.PORT || 8800;

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}  `);
})