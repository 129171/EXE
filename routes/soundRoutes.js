const express = require("express");
const router = express.Router();
const soundController = require("../controllers/soundController");

router.get("/", soundController.getSounds);
router.get("/rain", soundController.getRainSound);
router.get("/soothing", soundController.getSoothingSound);
router.get("/ocean", soundController.getOceanSound);
router.get("/piano", soundController.getPianoSound);
router.get("/play/:id", soundController.getSoundById);

module.exports = router;
