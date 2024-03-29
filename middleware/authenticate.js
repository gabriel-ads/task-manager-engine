const jwt = require("jsonwebtoken");
const { privateKey } = require("../globalVariables");

const authenticate = async (req, res, next) => {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const accessTokenDecoded = jwt.verify(accessToken, privateKey);
    req.user = accessTokenDecoded.user;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const refreshTokenDecoded = jwt.verify(refreshToken, privateKey);
      req.user = refreshTokenDecoded.user;
      const accessToken = jwt.sign(
        { user: refreshTokenDecoded.user },
        privateKey,
        {
          expiresIn: "1h",
        }
      );

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("authorization", accessToken);

      next();
    } catch (error) {
      console.log(error);
      return res.status(400).send("Invalid Token.");
    }
  }
};

module.exports = authenticate;
