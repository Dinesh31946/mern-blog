const Comment = require("../models/commentModel");
const { errorHandler } = require("../utils/error");

const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        if (userId != req.user.id) {
            next(errorHandler("You are not allowed to add a comment"));
        }
        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComment,
};
