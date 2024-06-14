import express from "express";

const app = express();


//Routes setting

app.get('/', (req,res,next) =>{
    res.json({message : "WELCOME TO CSI"});
})


export default app;