const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error");
const slugify = require("slugify");
const Post = require("../models/postModel");

const createPost = async (req, res, next) => {
    console.log(req.user);

    if (!req.user.isAdmin) {
        return next(
            errorHandler(403, "You do not have permission to create a post")
        );
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Please provide all required fields"));
    }

    const slug = slugify(req.body.title, {
        lower: true,
        strict: true,
    });
    const newPost = new Post({
        ...req.body,
        userId: req.user.id,
        slug,
        author: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
};
