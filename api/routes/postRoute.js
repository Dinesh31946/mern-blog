const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const { createPost } = require("../controllers/postController");

const router = express.Router();

router.post("/create", verifyToken, createPost);

module.exports = router;
