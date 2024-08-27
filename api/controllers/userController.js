const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { errorHandler } = require("../utils/error");

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "You are not allowed to update this user")
        );
    }

    //initialize the empty update fields
    const updateFileds = {};

    if (req.body.password) {
        if (req.body.password.length < 8) {
            return next(
                errorHandler(400, "Password must be at least 8 characters long")
            );
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    //username update
    if (req.body.username) {
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
        updateFileds.username = req.body.username;
    }

    //Email update
    if (req.body.email) {
        updateFileds.email = req.body.email;
    }

    if (req.body.profilePicture) {
        updateFileds.profilePicture = req.body.profilePicture;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: updateFileds,
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
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
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

const getAllUser = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(
            errorHandler(403, "You are not allowed to access this information")
        );
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        const users = await User.find()
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const withoutPasswordUser = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUser = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users: withoutPasswordUser,
            totalUsers,
            lastMonthUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateUser,
    deleteUser,
    signout,
    getAllUser,
};
