const express = require("express");
const { handleUserSignup, handleUserLogin } = require("../controllers/user");

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

// ✅ Logout
router.get("/logout", (req, res) => {
    res.clearCookie("token");   // remove JWT cookie
    return res.redirect("/login"); // redirect back to login page
});

module.exports = router;
