const express=require("express");
const cors=require("cors");
const app=express();
app.use(express.json());
app.use(cors());

const healthroute=require("./routes/health.routes");
const authroute=require("./routes/auth.routes");
const testroute=require("./routes/test.routes");
const reviewroute=require("./routes/review.routes");

app.use("/api",healthroute);
app.use("/api/auth",authroute);
app.use("/api/test",testroute);
app.use("/api/review",reviewroute);
module.exports=app;

//1. test test@gm.com 12345 : viewer
//2. critic1 critic1@gmail.com 123 : critic
//3. critic2 critic2@gmail.com 123 : critic
//4. editor editor@gmail.com 123 : editor
