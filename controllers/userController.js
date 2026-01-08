const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

BASEURL = "http://localhost:7005/uploads/";

const register = async (req, res) => {
  console.log(req.file,"req.file",req.body);
  let { name, email, password, contactNumber, address } = req.body;
  let imagePath = req.file ? req.file.filename : null;
  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      console.log(password);
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(req.body.password, salt);

      console.log("hashed password", password);
      const newUser = await User.create({
        name,
        email,
        password,
        contactNumber,
        address,
        imagePath,
      });

      await newUser.save();
      res.status(200).send({ msg: "Register successfully", success: true });
    }
    if (existingUser) {
      res.status(200).send({ msg: "User already exists", success: false });
    }
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
};

const login = async (req, res) => {

     console.log(req.body)
    const {email,password} = req.body
    try {
        const loggedUser = await User.findOne({email:email})
        console.log(loggedUser, "logged user")
        if(!loggedUser){    
           return  res.status(400).send({msg:"User not found",success:false})
        }
        if(await bcrypt.compare(password, loggedUser.password)){
            const payload = {id:loggedUser._id, role:loggedUser.role}
console.log(payload)
            const token = jwt.sign(payload, process.env.SECREAT_KEY, {expiresIn:'1d'})
            console.log(token,"token in controller")
           return res.status(200).send({msg:"Logged in succesfull", success:true,token:token})
        }else{
          return  res.status(400).send({msg:"password incorrect!!!"})
        }        
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
};

const getUserInfo = async (req, res) => {
     console.log(req.user,"In controller")
  try {
    const loggedUser = await User.findById(req.user.id)
        loggedUser.imagePath = BASEURL+loggedUser.imagePath

        console.log("------------------",loggedUser)
        res.status(200).send({user:loggedUser,success:true})
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
};

const doctorList = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
};

module.exports = { register, login, getUserInfo, doctorList };