const express=require ("express");
const cors =require("cors");
const app=express();
const morgan=require("morgan");
const mongoose = require('mongoose');
const multer=require("multer")
const {appConfig}=require("../API/config")

const dotenv=require("dotenv");
const { default: helmet } = require("helmet");
const userRoute=require("./routes/users.js")
const authRoute=require("./routes/auth.js")
const postRoute=require("./routes/posts.js");
const path=require("path")
dotenv.config()

mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology:true, useNewUrlParser: true},);

//middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"))
app.use("/api/users", userRoute)

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images")
    },
    filename:(req, file, cb)=>{
        cb(null, req.body.name)
    }
})

const upload= multer({storage});

app.post("/api/upload", upload.single("file"), (req,res)=>{
    try {
        return res.status(200).json("File upload correctamente.")
    } catch (err) {
        console.log(" err" + err);
    }
})

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/auth", authRoute)

app.use("/api/posts", postRoute)





app.listen(9000, ()=>{
    console.log("Corriendo en el 9000");
})