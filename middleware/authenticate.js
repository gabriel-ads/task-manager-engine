const jwt = require("jsonwebtoken");
const { privateKey } = require("../globalVariables");

const authenticate = async (req, res, next) => {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(accessToken, privateKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const decoded = jwt.verify(refreshToken, privateKey);
      const accessToken = jwt.sign({ user: decoded.user }, privateKey, {
        expiresIn: "1h",
      });

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Authorization", accessToken);

      next();
    } catch (error) {
      console.log(error);
      return res.status(400).send("Invalid Token.");
    }
  }
};

module.exports = authenticate;
