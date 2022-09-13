import dotenv from "dotenv"
dotenv.config()

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

const PORT = process.env.PORT || 5000;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.dqedcpu.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(URL).then(() => {
    console.log("Connected to database");
}).catch(err => {
    console.log(err)
})

app.use(express.json({ limit: "20mb", extended: true }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(cors());

app.get('/', (_req, res) => {
    res.send({"ok": "ok"});
})

const schema = new mongoose.Schema({
    data: Object,
    date: String,
    time: String
});

const Appointment = mongoose.model("Question", schema);

app.post('/add', (req, res) => {
    const { meta } = req.body

    const appointment = new Appointment(meta)

    appointment.save().then(data => {
        res.send(data);
    }).catch(err => {
        console.log(err)
        res.status(400).send("bad request")
    })
})

app.get('/getall', (_req, res) => {
    Appointment.find({}).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err)
        res.status(400).send("bad request")
    })
})

app.listen(PORT, () => {
    console.log(`Server starting in port: ${PORT}`)
})