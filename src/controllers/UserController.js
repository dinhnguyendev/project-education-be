const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ERROR = require("../message/Error");
const User = require("../models/User");
const SUCCESS = require("../message/Success");
class UserController {
  async register(req, res) {
    const { username, password, email, phone } = await req.body;
    if (username && password && email && phone) {
      const checkEmail = await String(email).match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (!checkEmail) {
        return res.status(400).json(ERROR.EMAILNOTFOTMAT);
      }
      const Exist = await User.findOne({ phone });

      if (Exist) {
        return res.status(400).json(ERROR.PHONEISEXIST);
      } else {
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        const hashed = await bcrypt.hash(password, salt);
        const data = await new User({
          username,
          password: hashed,
          phone,
          email,
        });
        const result = await data.save();
        if (result) return res.status(200).json(SUCCESS.REGISTER);
      }
    } else {
      return res.status(400).json(ERROR.BATCHREQUEST);
    }
  }
  async login(req, res) {
    const { phone, password } = await req.body;
    if (phone && password) {
      const customer = await User.findOne({ phone });
      if (!customer) {
        return res.status(404).json(ERROR.PHONENUMBEREXIT);
      }
      const encodePassword = await bcrypt.compare(password, customer.password);
      if (!encodePassword) {
        return res.status(405).json(ERROR.WRONGPASSWORD);
      }
      const accessToken = jwt.sign(
        {
          id: customer._id,
          role: customer.role,
        },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: "365d" }
      );
      res.cookie("accessToken", accessToken, {
        // httpOnly: true,
        secure: false,
        path: "/",
        samesite: "strict",
      });
      const respon = {
        ...SUCCESS.LOGIN,
        data: {
          username: customer.username,
          email: customer.email,
          role: customer.role,
          phone: customer.phone,
          avatar: customer.avatar,
          _id: customer._id,
        },
      };
      return res.status(200).json(respon);
    } else {
      return res.status(400).json(ERROR.BATCHREQUEST);
    }
  }
  async get(req, res) {
    const token = await req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN,
        async (err, user) => {
          if (err) {
            return res.status(403).json(ERROR.TOKENERROR);
          }
          const users = await User.findOne({ _id: user.id });
          return res.status(200).json(users);
        }
      );
    } else {
      return res.status(403).json(ERROR.TOKENISNOTVALUE);
    }
  }
  async logout(req, res) {
    res.clearCookie("accessToken");
    res.status(200).json(SUCCESS.LOGOUT);
  }
}

module.exports = new UserController();
