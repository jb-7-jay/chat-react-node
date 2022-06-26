const {
  generateTokenController,
  createStreamController,
} = require("../controllers/videoController");

const router = require("express").Router();

router.post("/generate-token", generateTokenController);
router.get("/create-stream/:slug", createStreamController);

module.exports = router;
