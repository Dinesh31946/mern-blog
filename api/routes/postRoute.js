const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const { createPost, getposts } = require("../controllers/postController");

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getposts", getposts);

module.exports = router;
