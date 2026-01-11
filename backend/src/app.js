const express=require("express");
const cors=require("cors");
const app=express();
const healthroute=require("./routes/health.routes");
app.use(express.json());
app.use(cors());

app.use("/api",healthroute);
module.exports=app;