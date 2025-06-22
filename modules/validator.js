const {
    body,
    validationResult,
    param,
    query
} = require("express-validator");


module.exports = {


    validatorTripCreate: [
        body("userId")
        .trim()
        .notEmpty()
        .withMessage("Username is required"),

        body("country")
        .trim()
        .notEmpty()
        .withMessage("Country is required"),

        body("duration")
        .trim()
        .notEmpty() 
        .withMessage("Duration is required"),

        body("group_type")
        .trim()
        .notEmpty() 
        .withMessage("Group type is required"),

        body("travel_style")
        .trim()
        .notEmpty() 
        .withMessage("Travel style is required"),

        body("interests")
        .trim()
        .notEmpty()
        .withMessage("Interests are required"),

        body("budget_estimate")
        .trim()
        .notEmpty()
        .withMessage("Budget estimate is required"),

        body("images")
        .trim()
        .notEmpty()
        .withMessage("Images are required"),

        body("result")
        .trim()
        .notEmpty() 
        .withMessage("Result is required"),

        (req, res, next) => {
            const error = validationResult(req);

            if (!error.isEmpty())
                return res.status(400).send({
                    code: 400,
                    message: error.array()[0].msg,
                });

            next();
        },
    ]
}