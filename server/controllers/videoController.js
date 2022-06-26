const GroupMessage = require("../models/groupMessage");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

module.exports.generateTokenController = async (req, res, next) => {
  try {
    const appID = process.env.APP_ID;
    const appCertificate = process.env.APP_CERTIFICATE;
    const expirationTimeInSeconds = 36000;

    const uid = Math.floor(Math.random() * 10000000);

    const role =
      req.body.isPublisher || true ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const channel = req.body.channel;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

    console.log({
      appID,
      appCertificate,
      channel,
      uid,
      role,
      expirationTimestamp,
    });

    // if uid is 0 then  token is valid for all user otherwise token generated with whatever uid, should
    // be the same at client side 

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channel,
      0, // uid || 0
      RtcRole.PUBLISHER,
      expirationTimestamp
    );

    console.log("token", token);
    return res.status(200).json({ uid, token });
  } catch (ex) {
    next(ex);
  }
};

module.exports.createStreamController = async (req, res, next) => {
  try {
    const { slug = null } = req.body;

    if (slug) {
    }
    console.log("token", token);
    return res.status(200).json({ message: "ok" });
  } catch (ex) {
    next(ex);
  }
};
