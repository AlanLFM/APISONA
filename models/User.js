const mongoose=require("mongoose")
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:20,
        unique:true ,
    },
    role:{
      type:String,
      required:true,  
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        min:3,
    },
    coverPicture:{
        type:String,
        default:"",
    },
    followers:{
        type:Array,
        default: [],
    },
    followings:{
        type:Array,
        default: [],
    },
    desc:{
        type:String,
        max: 50,
    },
    city:{
        type:String,
        max:50,
    },
    from:{
        type:String,
        max:50,
    },
    token:{
        type:String,
        required: true,

    },
    relationship:{
        type:Number,
        enum: [1,2,3],
    },
},

{timestamps:true}
);

module.exports=mongoose.model("User",UserSchema)