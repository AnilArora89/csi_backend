import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import agencyRouter from "./agency/agencyRouter";
const app = express();
app.use(cors());
app.use(express.json());
//Routes setting

app.get('/', (req, res, next) => {
    res.json({ message: "WELCOME TO CSI" });
})

//user route setup
app.use('/api/users', userRouter);
app.use('/api/agency', agencyRouter);
//global error handler ( to handle eroors in request handlers)
app.use(globalErrorHandler);

export default app;


//global error handler is a middleware
//it should be at last of all routes

// never send err.stack on production as it contains vaious important info of server so never send it;
//globalErroHandler is a middleware so it is not called and just written as express automatically calls middleware