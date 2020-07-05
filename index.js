const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors());

app.get("/", (req,res) => {
    res.send("Gamefield Back-End!")
});

const routeUsers = require('./routes/users');
app.use("/api/users",routeUsers);

mongoose.connect(process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true }, () =>
        console.log("connected to database!")
    )
 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));