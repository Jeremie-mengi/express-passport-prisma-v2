const express = require("express");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
const usersRouter = require("./routes/users");
const ordinateursRouter = require("./routes/ordinateurs");
const passport = require("passport");
const prisma = require("./db/prisma");
const LocalStrategy = require("passport-local").Strategy
const authRouters = require ("./routes/Auth")



const configPassport = new LocalStrategy({usernameField:"email", passwordField : "password"},
 async(email,password,done)=>{
 console.log({email, password});
  const user = await prisma.user.findFirst({where:{email}})
  if (!user){
    return done(null,false,{message:"User introuvable"})
  }
 console.log({user});
 bcrypt.compare(password, user.password, (Error, IsMatch)=>{
  if(Error){
    return done(Error)
  }
  if (!IsMatch){
    return done(null,false,{message : "Mot de passe incorrect"})
  }
  return done (null, user)
 })
})

passport.use(configPassport)

passport.serializeUser((user,done) => {
  done(null, user.id)
})
passport.deserializeUser((user,done) => {
  done(null, user)
})




dotenv.config();
const PORT = process.env.PORT;
const server = express();
server.use(passport.initialize())
server.use(express.json());

server.get("/", (req, res) => {
  res.send("DEV WEB C3");
});
server.use("/auth",authRouters )
server.use("/users", usersRouter);
server.use("/ordinateurs", ordinateursRouter);

server.listen(PORT, () => console.log(`Le serveur est lancé sur ${PORT}`));
