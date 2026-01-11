require("dotenv").config();
const connectToMongoDB=require("./config/db")
const app=require("./app")
const PORT = process.env.PORT || 3001;

connectToMongoDB()
    .then(()=>{
        console.log("DB SERVER RUNNING.")
        app.listen(PORT, ()=>{
            console.log(`Server running on : ${PORT}`);
        })
    })
    .catch((err)=> console.log(`DB ERROR: ${err}`));


