const Group = require("../models/groupModel");
const GroupMessage = require("../models/groupMessage");

module.exports.createGroup = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { name, users } = req.body;

    if (!name || !userId || !users)
      return res.json({ message: "please provide all details" });

    let newGroup = new Group({
      name,
      admin: userId,
      users: [userId, ...users],
    });

    newGroup = await newGroup.save();

    return res.status(200).json(newGroup);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserGroups = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const allGroups = await Group.find({
      users: {
        $in: userId,
      },
    }).populate([
      {
        path: "admin",
        select: ["username", "email", "_id"],
      },
      {
        path: "users",
        select: ["username", "email", "_id"],
      },
    ]);
    return res.status(200).json(allGroups);
  } catch (ex) {
    next(ex);
  }
};

module.exports.sendMessageInGroup = async (req, res, next) => {
  try {
    const { sender, group, message } = req.body;

    if (!sender || !group || !message || !message.length)
      return res.json({ msg: "provide valid details" });

    // many validations needed

    let newGroupMessage = new GroupMessage({
      sender,
      group,
      message,
    });

    newGroupMessage = await newGroupMessage.save();

    return res.status(200).json(newGroupMessage);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessageGroup = async (req, res, next) => {
  try {
    const groupDetails = null;
    // const groupDetails = await Group.findById(req.params.groupId).populate({
    //   path: "admin",
    //   select: "name email",
    // });
    const allMessages = await GroupMessage.find({
      group: req.params.groupId,
    }).populate({ path: "sender", select: "username email _id" });

    return res.status(200).json({ groupDetails, allMessages });
  } catch (ex) {
    next(ex);
  }
};
