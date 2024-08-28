const express = require("express");
const {
    createComment,
    getComments,
    likeComment,
    editComment,
    deleteComment,
} = require("../controllers/commentController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getcomments/:postId", getComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);

module.exports = router;
