const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Ashh$$$';

const fetchUser = (req,res,next)=>{
    // pass the auth token as a body
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error: "use a valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;   // pass the data as a req
        
    } catch (error) {
        res.setHeader("auth-token", token)
        console.log(error.message)
        res.status(500).json({error:"internal server error"})
    }
    next()
}

module.exports = fetchUser;