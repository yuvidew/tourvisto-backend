const { getDB } = require("../../db/connectDB");
/**
 * Creates a new trip and inserts it into the database.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing trip details.
 * @param {number} req.body.userId - The ID of the user creating the trip.
 * @param {string} req.body.country - The country of the trip.
 * @param {number} req.body.duration - The duration of the trip.
 * @param {string} req.body.group_type - The group type for the trip.
 * @param {string} req.body.travel_style - The travel style for the trip.
 * @param {string} req.body.interests - The interests for the trip.
 * @param {number} req.body.budget_estimate - The estimated budget for the trip.
 * @param {string} req.body.images - The images associated with the trip.
 * @param {string} req.body.result - The result or description of the trip.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response indicating success or failure.
 */


const createTrip = async (req, res) => {
    const {userId , country , duration , group_type , travel_style , interests , budget_estimate , images , result} = req.body;
    try {
        const db = getDB();

        const [rows] = await db.query("INSERT INTO trips (userId , country , duration , group_type , travel_style , interests , budget_estimate , images , result) VALUES ( ?,?,?,?,?,?,?,?,?)" , [
            userId , 
            country , 
            duration , 
            group_type , 
            travel_style , 
            interests , 
            budget_estimate , 
            images , 
            result
        ])

        if (rows.affectedRows == 0) {
            return res.status(400).json({
                success: false,
                message: "Failed to create trip. Please try again."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Trip created successfully.",
            tripId: rows.insertId
        })
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Something went wrong while creating the trip.",
            error: error.message,
        });
    }
}


/**
 * @function getTrips
 * @description Fetches all trips from the database.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * 
 * @returns {Promise<void>} Sends a JSON response with all trips or an error message
 */
const getTrips = async (req, res) => {
    try {
        const db = getDB();
        const [trips] = await db.query("SELECT * FROM trips");

        if (trips.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No trips found."
            });
        }

        return res.status(200).json({
            success: true,
            trips: trips
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Something went wrong while fetching trips.",
            error: error.message,
        });
    }
}

/**
 * @function getTripById
 * @description Fetches a single trip from the database using the trip ID from request parameters.
 * 
 * @param {import('express').Request} req - Express request object. Expects `req.params.id` to contain the trip ID.
 * @param {import('express').Response} res - Express response object.
 * 
 * @returns {Promise<void>} Sends a JSON response with the trip data or an error message.
 */

const getTripById = async (req, res) => {
    const tripId = req.params.id;
    try {
        const db = getDB();
        const [trip] = await db.query("SELECT * FROM trips WHERE id = ?", [tripId]);

        if (trip.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }

        return res.status(200).json({
            success: true,
            trip: trip[0]
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Something went wrong while fetching the trip.",
            error: error.message,
        });
    }
}

/**
 * @function deleteTripById
 * @description Deletes a specific trip from the database using the trip ID from request parameters.
 * 
 * @param {import('express').Request} req - Express request object. Expects `req.params.id` to contain the trip ID.
 * @param {import('express').Response} res - Express response object.
 * 
 * @returns {Promise<void>} Sends a JSON response indicating whether the trip was deleted or not found.
 */

const deleteTripById = async(req , res) => {
    const {id} = req.params;
    try {
        const db = getDB();

        if (!id) {
            return res.status(404).json({
                success : false,
                message : 'Trip id is required!'
            })
        }


        const [trip] = await db.query('DELETE FROM trips WHERE id = ?' , [id]);

        if(trip.affectedRows === 0) {
            return res.status(404).json({
                success : false,
                message : "Trip is not found!"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Trip is deleted successfully"
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
    createTrip,
    getTrips,
    getTripById,
    deleteTripById
};