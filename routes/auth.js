const router=require("express").Router();
const User= require("../models/User")
const bcrypt=require("bcrypt");
const jsw=require("jsonwebtoken")

//Registro
router.post("/register", async (req,res)=>{
   
   try{
    //Genera nueva contra
    const salt= await bcrypt.genSalt(10);
    const hasedPassword=await bcrypt.hash(req.body.password, salt);

    const token=(user)=>{
        const token=jsw.sign(user, process.env.TOP_SECRET)
        return token
    }
    //Crea un  nuevo usuario
    const newUser=new User({
        username: req.body.username,
        email: req.body.email,
        password: hasedPassword,
        token: token(req.body.username)
       });
       //Guarda al usuario 
    const user= await newUser.save();
    res.status(200).json(user);
    
   }catch(err){
    console.log(err);
   }
});

/*
// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token,  user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

*/


//Login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
  
      const token = jsw.sign(
        { id: user._id, role: user.role },
        process.env.TOP_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(200).json({ token,  user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



router.get("/", (req,res)=> {
    res.send("Auths")
})

module.exports = router