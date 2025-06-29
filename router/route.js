const express = require("express");
const {  validatorTripCreate } = require("../modules/validator");
const {login , signup} = require("../controller/admin/auth.controller")
const {signin:userSignIn , signup:userSignUp} = require("../controller/users/auth.controller")
const { createTrip , getTrips, getTripById, deleteTripById} = require("../controller/admin/trip.controller");
const { authenticate } = require("../authentication/authenticator");
const { validatorSignIn, validatorSignUp } = require("../modules/authentication/validator");

const router = express.Router();

/** sign in and sign up api routes for admin  */
router.post("/auth/sign-up" , validatorSignUp , signup);
router.post("/auth/sign-in" , validatorSignIn , login);

/**sign up and in api routes for app users */

router.post("/user/auth/sign-up" , validatorSignUp , userSignUp)
router.post("/user/auth/sign-in" , validatorSignIn , userSignIn)

/** CRUD ai for the trip  */

router.post("/trip/crate", validatorTripCreate, authenticate, createTrip);
router.get("/trip/get-all-trips"  , getTrips);
router.get("/trip/get-trip-by-id/:id", authenticate, getTripById);
router.delete("/trip/delete-trip-by-id/:id", authenticate , deleteTripById)


module.exports = router