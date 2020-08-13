const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const mapRoutes = require("./map");
const suggestionRoutes = require("./suggestion");
const chatRoutes = require("./chat");

router.use("/api/users", userRoutes);
router.use("/api/maps", mapRoutes);
router.use("/api/suggestions", suggestionRoutes);
router.use("/api/chats", chatRoutes);

module.exports = router;
