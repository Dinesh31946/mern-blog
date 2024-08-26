const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error");
const slugify = require("slugify");
const Post = require("../models/postModel");

const createPost = async (req, res, next) => {
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
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.title && { title: req.query.title }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    {
                        content: {
                            $regex: req.query.searchTerm,
                            $options: "i",
                        },
                    },
                    { slug: { $regex: req.query.searchTerm, $options: "i" } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPost = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.json({
            posts,
            totalPosts,
            lastMonthPost,
        });
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "You are not allowed to delete this post")
        );
    }
    try {
        const resposnse = await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json(req.params.postId);
    } catch (error) {
        next(error);
    }
};

const updatepost = async (req, res, next) => {
    const { title, content, category, image } = req.body;

    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "You are not allowed to update this post")
        );
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title,
                    content,
                    category,
                    image,
                },
            },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getposts,
    deletePost,
    updatepost,
};
