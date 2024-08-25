const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
    createPost,
    getposts,
    deletePost,
} = require("../controllers/postController");

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getposts", getposts);
router.delete("/delete/:postId/:userId", verifyToken, deletePost);

module.exports = router;
