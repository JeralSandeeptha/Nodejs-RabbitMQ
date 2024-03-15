const UserSchema = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const newUser = new UserSchema({
            username: username,
            password: password,
        });

        const user = await newUser.save();

        return res.status(201).json({
            statusCode: 201,
            message: "User save query was successful",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
                statusCode: 500,
                message: "User save query was failed",
                error: error.message
            });
    }
}
const getAllUsers = async (req, res) => {
    try {
        const users = await UserSchema.find();
        return res.status(200).json({
            statusCode: 200,
            message: "Get all users query was successful",
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Get all users query was failed",
            error: error.message
        });
    }
}
const getUser = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.params.userId);
        return res.status(200).json({
            statusCode: 200,
            message: "Get user query was successful",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Get user query was failed",
            error: error.message
        });
    }
}
const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserSchema.findByIdAndUpdate(
            req.params.userId,
            { $set: req.body },
            { new: true }
        );
        return res.status(201).json({
            statusCode: 201,
            message: "Update user query was successful",
            data: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Update user query was failed",
            error: error.message
        });
    }
}
const deleteUser = async (req, res) => {
    try {
        await UserSchema.findByIdAndDelete(req.params.userId);
        return res.status(204).json({
            statusCode: 204,
            message: "Delete user query was successful",
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Delete user query was failed",
            error: error.message
        });
    }
}

module.exports = {
    registerUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers
};