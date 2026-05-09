const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  signup,
  login,
  getUsers,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", auth, getUsers);

module.exports = router;