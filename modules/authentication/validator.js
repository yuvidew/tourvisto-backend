const {
    body,
    validationResult,
    param,
    query
} = require("express-validator");
module.exports = {
    validatorSignUp: [
            body("username")
                .trim()
                .notEmpty()
                .withMessage("Username is required")
                .isLength({
                    min: 3
                })
                .withMessage("Username must be at least 3 characters long."),
    
            body("email")
                .trim()
                .isEmail()
                .withMessage("Invalid email format."),
    
            body("password")
                .trim()
                .isLength({
                    min: 8
                })
                .withMessage("Password must be at least 8 characters long."),
    
            (req, res, next) => {
                const error = validationResult(req);
    
                if (!error.isEmpty())
                    return res.status(400).send({
                        code: 400,
                        message: error.array()[0].msg,
                    });
    
                next();
            },
        ],
    
        validatorSignIn : [
            body("email")
            .trim()
            .isEmail()
            .withMessage("Invalid email format."),
    
            body("password")
                .trim()
                .isLength({
                    min: 8
                })
                .withMessage("Password is required."),
    
            (req, res, next) => {
                const error = validationResult(req);
    
                if (!error.isEmpty())
                    return res.status(400).send({
                        code: 400,
                        message: error.array()[0].msg,
                    });
    
                next();
            },
        ],
}