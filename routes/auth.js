const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult}  = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/fetchUser')

// to create auth Token
const JWT_SECRET = 'Ashh$$$';

// * Route 1
// send a POST req to create a user (AUTH not required)
router.post('/createuser',[
    // check validations as many as you want
    body('email','enter valid email').isEmail(),
    body('password','password must be more than 5 chars').isLength({ min: 5 }),
    body('name','enter a valid name').isLength({ min: 2 })
],  async (req,res)=>{

  let obj = {
    success: false,
    authtoken: null,
    error: null
  }

    // get if there are any erros inside errors list
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          obj.error = "Sorry user with this email already exists"
          return res.status(400).json(obj)
        }
        
        // create a encrypted password by adding wxtra chars (salt) using bcrypt.js
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
    
        // Create a new user
        user = await User.create({
          name: req.body.name,
          password: secPass,
          email: req.body.email,
        })

        // create auth 
        const data = {
          user: {
            id: user.id
          }
        }
        obj.authtoken = jwt.sign(data, JWT_SECRET);
        obj.success = true
        // res.json(user)
        res.json(obj)
        
      } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

// * Route 2
// authentication login end point no login required
router.post('/login',[
  // check validations as many as you want and if returns error do not bother the server
  body('email','enter valid email').isEmail(),
  body('password','password must be more than 5 chars').exists(),
],  async (req,res)=>{

  let obj = {
    success: false,
    authtoken: null,
    error: null
  }
  
  // get if there are any erros inside errors list
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success:obj.success, errors: errors.array() });
  }

  const {email, password} = req.body;
  try{
    // finding the use rfrom the Data
    let user = await User.findOne({email:email})
    if(!user){
      obj.error = "Enter valid Credentials"
      return res.status(400).json(obj)
    }

    let passwordCompared = await bcrypt.compare(password,user.password)
    if(!passwordCompared){
      obj.error = "Enter valid Credentials"
      return res.status(400).json(obj)
    }

    const data = {
      user:{
        id: user.id
      }
    }
     
    // aurhenticate 
    obj.authtoken = jwt.sign(data, JWT_SECRET);
    obj.success = true
    // res.json(user)
    res.json(obj)
  }
  catch(error){
    console.log(error.message)
     res.status(500).send("Internal Server Error")
  }
})

// * Route 3
// get the user details by sendidg the jwt token via post: login required
router.post('/getuser', fetchUser ,async (req,res)=> {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.json(user)
    
  } catch (error) {
    console.log(error.message)
    res.status(500).send("internal server error")
  }
})

module.exports = router;