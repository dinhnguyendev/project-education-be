const jwt = require("jsonwebtoken");
const ERROR = require("../message/Error");

const MiddleWare = {
  verifiToken: async (req, res, next) => {
    const token = await req.headers.authorization;
    console.log(req.headers);
    console.log(token);
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, customer) => {
        if (err) {
          return res.status(401).json(ERROR.TOKENERROR);
        }
        req.customer = customer;
        next();
      });
    } else {
      res.status(403).json(ERROR.AUTHENTICATION);
    }
  },

  //   AdminToken: (req, res, next) => {
  //     MiddlewareController.verifiToken(req, res, () => {
  //       if (req.customer.admin) {
  //         next();
  //       } else {
  //         res.status(403).json("you are is ADMIN !!!");
  //       }
  //     });
  //   },
};
module.exports = MiddleWare;
