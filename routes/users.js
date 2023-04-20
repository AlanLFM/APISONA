const User=require("../models/User")
const router=require("express").Router();
const bcrypt=require("bcrypt")

//Modificar
router.put("/:id", async(req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.getSalt(10);
                req.body.password=await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err)
            }
        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            });
            res.status(200).json("La cuenta ha sido modificada")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("Sólo puedes modificar tu cuenta")
    }
})
//Eliminar

router.delete("/:id", async(req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try{
            const user=await User.findByIdAndDelete(req.params.id);

            res.status(200).json("La cuenta ha sido eliminada correctamente")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("Sólo puedes eliminiar tu cuenta")
    }
})


//Consultar

router.get("/",async (req,res)=>{
    const userId=req.query.userId;
    const username=req.query.username;
    try {
        const user=userId 
        ? await User.findById(userId)
        : await User.findOne({username:username});
        const{password, updatedAt, ...other}=user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json("Error "+error)
    }
})


//Consultar 2

router.get("/:id",async (req,res)=>{
    const userId=req.query.userId;
    try {
        const user=userId 
        await User.findById(userId)
        const{password, updatedAt, ...other}=user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json("Error "+error)
    }
})


//Seguir

router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!==req.params.id)
    {
        try {
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                return res.status(200).json("El usuario ha sido seguido")
            }else{
                return res.status(403).jason("Ya sigues a este usuario")
            }
        } catch (err) {
            return res.status(500).json("Errror en algo que no se " + err);
        }
    }
    else{
        return res.status(403).json("No puedes seguirte a ti mismo")
    }
})

//Ya no seguir

router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!==req.params.id)
    {
        try {
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                return res.status(200).json("has dejado de seguir a este usuario")
            }else{
                return res.status(403).jason("Ya no sigues a este usuario")
            }
        } catch (err) {
            return res.status(500).json("Errror en algo que no se " + err);
        }
    }
    else{
        return res.status(403).json("No puedes no seguirte a ti mismo")
    }
})
module.exports = router