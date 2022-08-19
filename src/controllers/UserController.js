class UserController{
    async get(req,res){
       return res.status(200).json("success helo word !!!")
    }
}

module.exports = new UserController;