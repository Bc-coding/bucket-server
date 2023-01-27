const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  // app.get("/auth/google/callback", passport.authenticate("google"));
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    // middleware -- once passport authenticate the user, then we will redirect the user to the route /surveys
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(); // logout() is a function automatically attached to req by passport
    // when we call logout, it takes the cookie that contains the id and kills the id of the user
    // res.send(req.user);
    res.redirect("/");
  });

  // we can tell whether the user is logged in by this route
  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
