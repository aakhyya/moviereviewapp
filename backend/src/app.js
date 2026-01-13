const express=require("express");
const cors=require("cors");
const app=express();
app.use(express.json());
app.use(cors());

const healthroute=require("./routes/health.routes");
const authroute=require("./routes/auth.routes");
const testroute=require("./routes/test.routes");

app.use("/api",healthroute);
app.use("/api/auth",authroute);
app.use("/api/test",testroute);
module.exports=app;

//1. test test@gmail.com 12345 : viewer
//2. test1 test1@gmail.com 12345 : viewer
//3. critic critic@gmail.com 123 : viewer
