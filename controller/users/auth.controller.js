const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../../db/connectDB");

/**
 * Handles app user signup.
 *
 * @async
 * @function signup
 * @param {import('express').Request} req - Express request object containing user details in the body.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The username of the new app user.
 * @param {string} req.body.email - The email address of the new app user.
 * @param {string} req.body.password - The password of the new app user.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response indicating the result of the signup operation.
 */

const signup = async (req , res) => {
    const {username , email , password} = req.body; 
    try {
        console.log(" sign up api is hit");
        const db = getDB();

        const [existing] = await db.query("SELECT * FROM app_users WHERE email = ?" , [email]);

        if (existing.length > 0) {
            return res.status(409).json({
                code : 409,
                success : false,
                message : "User already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password , 10);

        await db.query("INSERT INTO app_users (username , email , password , role) VALUE (?, ?, ?, ?)" , [
            username,
            email,
            hashPassword,
            "user"
        ])

        return res.status(200).json({
            code : 200,
            message : "Sign up successfully",
            user : {
                username , 
                email
            }
        })

    } catch (error) {
        return res.status(500).json({
            code: 400,
            message: "Something from the server!",
            error: error.message,
        });
    }
}

/**
 * Handles app user login.
 *
 * @async
 * @function login
 * @param {import('express').Request} req - Express request object containing user credentials in the body.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.email - The email address of the app user.
 * @param {string} req.body.password - The password of the app user.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response indicating the result of the login operation.
 */

const signin = async (req , res) => {
    const { email, password } = req.body;

    try {
        const db = getDB();

        const [users] = await db.query("SELECT * FROM app_users WHERE email = ?", [email]);

        if(users.length === 0){
            return res.status(401).json({
                code : 401,
                success : false,
                message : "Invalid email or password"
            })
        }

        const user = users[0];

        const match = await bcrypt.compare(password , user.password);

        if(!match){
            return res.status(401).json({
                success : false,
                message : "Invalid password."
            })
        }

        const token = jwt.sign(
            {
                id : user.id,
                email : user.email,
                name : user.username
            },
            process.env.JWT_SECRET
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
        return res.status(500).json({
            success : false,
            massage : "Something from the server!"
        })
    }
}

/**
 * Handles app user logout.
 *
 * @async
 * @function logout
 * @param {import('express').Request} req - Express request object containing user id in the params.
 * @param {Object} req.params - The request params.
 * @param {string|number} req.params.id - The id of the app user to logout.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response indicating the result of the logout operation.
 */

const logout = async (req , res) => {
    const {id} = req.params;

    try {
        const db = getDB();

        const [users] = await db.query("SELECT * FROM app_users WHERE id = ?", [id]);

        if (users.length == 0) {
            return res.status(401).json({
                code: 401,
                success: false,
                message: "This user is not exist in db."
            });
        }


        const [deletedUser] = await db.query('DELETE FROM app_users WHERE id = ? ' , [id])

        if(deletedUser.affectedRows === 0){
            return res.status(404).json({
                success : false,
                message : "User is not found!"
            })
        }

        return res.status(200).json({
            success : true,
            message : "User is logout successfully"
        })

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Something went wrong while delete the trip.",
            error: error.message,
        });
    }
}

module.exports = {
    signin,
    signup,
    logout
}