const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../../db/connectDB");


const signup = async (req , res) => {
    const {username , email ,password } = req.body;
    try {
        const db = getDB();

        const [existing] = await db.query("SELECT * FROM admin_users WHERE email = ?" , [email]);

        if(existing.length > 0){
            return res.status(409).json({
                code : 409,
                success : false,
                message : "User already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password , 10);

        await db.query("INSERT INTO admin_users (username , email , password , role) VALUE (?, ?, ?, ?)" , [
            username,
            email,
            hashPassword,
            "admin"
        ]);

        return res.status(200).json({
            code : 200,
            message: "Sign up successfully",
            user: {
                username,
                email,
                password: hashPassword
            }
        })


    } catch (error) {
        return res.status(400).json({
            code: 400,
            message: "Something went wrong. Please check the password and email!",
            error: error.message,
        });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const db = getDB()
    
    
        const [users] = await db.query("SELECT * FROM admin_users WHERE email = ?", [email]);
    
        if (users.length == 0) {
            return res.status(401).json({
                code: 401,
                success: false,
                message: "Invalid email or password."
            });
        }
    
        const user = users[0];
    
        const match = await bcrypt.compare(password , user.password)
    
        if (!match) {
            return res.status(401).json({
                success : false,
                message : "Invalid email or password."
            })
        }

        const token = jwt.sign(
            {
                id : user.id,
                email : user.email,
                name : user.username
            },
            process.env.JWT_SECRET
            // {
            //     expiresIn : "1d"
            // }
        )
    
    
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user : {
                id : user.id,
                email : user.email,
                name : user.username
            }
        })
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            success : false,
            massage : "Server error"
        })
    }
}

module.exports = {
    login,
    signup
}