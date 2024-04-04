const passport = require("passport")
const jwt = require("jsonwebtoken")


function authUser(req, res, next){
    passport.authenticate("local", (err,user,info)=>{
    if (err){
        return res.status(500)
    }
    if (!user){
        return res.status(401).json({message :'identifiant incorrect'} )
    }
    const token = jwt.sign({id:user.id, role:user.role }, process.env.JWT_SECRET, {expiresIn : Date.now + 3*60*1000})
    res.status(200).json(token)
})(req, res, next)
}

module.exports = authUser;