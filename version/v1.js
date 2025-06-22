const express = require("express");
const router = require("../router/route");

const app = express(); 

app.use(express.json()); 
app.use("/v1", router); 

module.exports = app;