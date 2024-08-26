const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
    createPost,
    getposts,
    deletePost,
    updatepost,
} = require("../controllers/postController");

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getposts", getposts);
router.delete("/delete/:postId/:userId", verifyToken, deletePost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

module.exports = router;
