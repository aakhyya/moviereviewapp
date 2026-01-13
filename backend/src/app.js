const express=require("express");
const cors=require("cors");
const app=express();
const healthroute=require("./routes/health.routes");
const authroute=require("./routes/auth.routes")

app.use(express.json());
app.use(cors());


app.use("/api",healthroute);

app.use("/api/auth",authroute);
module.exports=app;

//1. test test@gmail.com 12345
//2. test1 test1@gmail.com 12345