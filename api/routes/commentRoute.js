const express = require("express");
const {
    createComment,
    getComments,
} = require("../controllers/commentController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getcomments/:postId", getComments);

module.exports = router;
