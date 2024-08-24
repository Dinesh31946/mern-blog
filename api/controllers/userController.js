const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { errorHandler } = require("../utils/error");

const test = (req, res) => {
    res.status(200).json({
        message: "API Routes and Controllers are working!",
    });
};

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "You are not allowed to update this user")
        );
    }
    if (req.body.password) {
        if (req.body.password.length < 8) {
            return next(
                errorHandler(400, "Password must be at least 8 characters long")
            );
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
            errorHandler(
                400,
                "Username must be between 7 and 20 characters long"
            )
        );
    }
    if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
            errorHandler(
                400,
                "Username must contain only alphanumeric characters"
            )
        );
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "You are not allowed to delete this user")
        );
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User deleted successfully");
    } catch (error) {
        next(error);
    }
};

const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token", { path: "/" })
            .status(200)
            .json("User signed out successfully");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    test,
    updateUser,
    deleteUser,
    signout,
};
