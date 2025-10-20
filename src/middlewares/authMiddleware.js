import passport from "passport";

export const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err)
      return res.status(500).json({ message: "Server error", error: err });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user; // attach user to request for later use
    next();
  })(req, res, next);
};
