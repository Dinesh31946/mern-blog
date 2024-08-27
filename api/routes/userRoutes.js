const express = require("express");
const {
    updateUser,
    deleteUser,
    signout,
    getAllUser,
    getUser,
} = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getallusers", verifyToken, getAllUser);
router.get("/:userId", getUser);

module.exports = router;
