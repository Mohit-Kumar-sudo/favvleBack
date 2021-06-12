const jwt = require("jsonwebtoken");
const creteError = require("http-errors");
const { ObjectId } = require("mongodb");

const ACCESS_SECRET_KEY =
  "21ac597683751d25e6f093d43d48d372e609ba56611fae581aaf26252a8b2554";

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userId,
      };
      const secret = ACCESS_SECRET_KEY;
      const options = {
        expiresIn: "10s",
        issuer: "pickurpage.com",
        audience: userId,
      };
      jwt.sign(payload, secret, (err, token) => {
        if (err) {
          reject(creteError.InternalServerError());
        }
        resolve(token);
      });
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) {
      return next(creteError.Unauthorized());
    }
    const authHeader = req.headers["authorization"];

    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    jwt.verify(token, ACCESS_SECRET_KEY, (err, payload) => {
      if (err) {
        const message =
          err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(creteError.Unauthorized(message));
      }
      res.locals.userId = new ObjectId(payload.userId);
      next();
    });
  },
};
