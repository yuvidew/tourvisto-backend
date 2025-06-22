const { getDB } = require("../../db/connectDB");

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