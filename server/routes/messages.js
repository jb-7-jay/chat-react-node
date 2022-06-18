const {
  createGroup,
  getUserGroups,
  sendMessageInGroup,
  getAllMessageGroup,
} = require("../controllers/groupController");
const { addMessage, getMessages } = require("../controllers/messageController");
const { route } = require("./auth");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

router.post("/group/create/:userId", createGroup);
router.get("/group/:userId", getUserGroups);
router.post("/group/send", sendMessageInGroup);
router.get("/group/msg/:groupId", getAllMessageGroup);

module.exports = router;
