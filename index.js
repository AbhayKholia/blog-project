import express, { Router } from 'express'
import mongoose from'mongoose'
import dotenv from 'dotenv'
import router from './routes/routes.js';
import cors from 'cors'
import bodyParser from 'body-parser';


const PORT = 8000;
const app = express();

dotenv.config()

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;


const connectDb = async (USERNAME,PASSWORD) => {
    try {
        await mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.rreg3vq.mongodb.net/Cluster0?retryWrites=true&w=majority`);
        console.log(`db connected ${mongoose.connection.host}`);
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1); // Exit process with failure
    }
};
connectDb(USERNAME , PASSWORD);

app.use(cors())
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use('/' , router)



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
