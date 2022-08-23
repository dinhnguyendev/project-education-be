const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ERROR = require('../message/Error');
const User = require('../models/User');
const SUCCESS = require('../message/Success');
class UserController{
    async get(req,res){
       return res.status(200).json("success helo word !!!")
    }
    async register(req,res){
        const {username,password,email,phone}= await req.body;
        if(username && password && email && phone){
            // const salt = await bcrypt.genSalt(10);
            // const hashed = await bcrypt.hash(password, salt);
            const data=await new User({
                username,
                password,
                phone,
                email,
            })
             const result=await data.save();
             return res.status(200).json(result)
        }else{
            return res.status(400).json(ERROR.BATCHREQUEST)   
        }
    }
    async login(req,res){
        const {phone,password}= await req.body;
        if(phone && password){
            const customer=await User.findOne({phone});
            if (!customer) {
                return res.status(404).json(ERROR.PHONENUMBEREXIT);
            }
            if ( password != customer.password) {
                return res.status(404).json(ERROR.WRONGPASSWORD);
            }
            console.log(customer);
            const tokensign = jwt.sign({
                id: customer._id,
                role: customer.role
            }, process.env.JWT_ACCESS_TOKEN,
                { expiresIn: "365d" }
            );
            res.cookie("token", tokensign, {
                httpOnly: true,
                secure: false,
                path: "/",
                samesite: "strict"
            });
            return res.status(200).json(SUCCESS.LOGIN)   
        }else{
            return res.status(400).json(ERROR.BATCHREQUEST)   
        }
    }
    async get(req,res){
        
    }
}

module.exports = new UserController;