const jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if(!authHeader){
        return res.status(403).json({
            message: "You have no access to this endpoint"
        })
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, _res) => {
        if(err){
            console.log(err);
            return res.status(403).json({
                message: "Invalid token",
            })
        }
        console.log(_res);
        req.user = _res;
        next();
    })

}

module.exports = {
    auth
}