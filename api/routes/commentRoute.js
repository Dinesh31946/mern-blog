const express = require("express");
const {
    createComment,
    getComments,
    likeComment,
} = require("../controllers/commentController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getcomments/:postId", getComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);

module.exports = router;
