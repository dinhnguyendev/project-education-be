const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ERROR = require('../message/Error');
const User = require('../models/User');
const SUCCESS = require('../message/Success');
class UserController{
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
        console.log(phone)
        console.log(password)
        if(phone && password){
            const customer=await User.findOne({phone});
            if (!customer) {
                return res.status(404).json(ERROR.PHONENUMBEREXIT);
            }
            if ( password != customer.password) {
                return res.status(404).json(ERROR.WRONGPASSWORD);
            }
            console.log(customer);
            const accessToken = jwt.sign({
                id: customer._id,
                role: customer.role
            }, process.env.JWT_ACCESS_TOKEN,
                { expiresIn: "365d" }
            );
            res.cookie("accessToken", accessToken, {
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
        const token =await req.headers['authorization'];
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN,async (err, user) => {
                if (err) {
                    return res.status(403).json(ERROR.TOKENERROR);
                }
                const users=await User.findOne({_id:user.id})
                return res.status(200).json(users);
                
            });
        }else{
            return res.status(403).json(ERROR.TOKENISNOTVALUE);

        }
    }
}

module.exports = new UserController;