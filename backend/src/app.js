const express=require("express");
const cors=require("cors");
const passport = require("passport");
require("./config/passport");
const app=express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const healthroute=require("./routes/health.routes");
const authroute=require("./routes/auth.routes");
const testroute=require("./routes/test.routes");
const reviewroute=require("./routes/review.routes");
const analyticsroute=require("./routes/analytics.routes");
const auditroute=require("./routes/audit.routes");
const movieroute=require("./routes/movie.routes");

app.use("/api",healthroute);
app.use("/api/auth",authroute);
app.use("/api/test",testroute);
app.use("/api/review",reviewroute);
app.use("/api/analytics",analyticsroute);
app.use("/api/audit",auditroute);
app.use("/api/movie",movieroute);

module.exports=app;

//1. test test@gm.com 123 : viewer
//2. test2 test2@gm.com 123: viewer
//3. critic1 critic1@gmail.com 123 : critic
//4. critic2 critic2@gmail.com 123 : critic
//5. editor editor@gmail.com 123 : editor

//Critic, critic3@gmail.com, 123456789 