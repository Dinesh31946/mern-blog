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

const getComments = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

const likeComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(errorHandler("Comment not found"));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

const editComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(errorHandler("Comment not found"));
        }
        if (comment.userId != req.user.id && !req.user.isAdmin) {
            return next(
                errorHandler("You are not allowed to edit this comment")
            );
        }
        if (content.trim() === comment.content.trim()) {
            return next(errorHandler("No changes made"));
        }
        const editedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                content,
            },
            { new: true }
        );
        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(errorHandler("Comment not found"));
        }
        if (comment.userId != req.user.id && !req.user.isAdmin) {
            return next(
                errorHandler("You are not allowed to delete this comment")
            );
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json("Comment deleted successfully");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComment,
    getComments,
    likeComment,
    editComment,
    deleteComment,
};
