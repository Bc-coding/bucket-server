// naming convention of the file
// - lower case for exporting a function
// - upper case for exporting a class

// next arg is called when our middlewares is completed (a done callback)
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({
      error: "You must log in",
    });
  }
  // if req.user exists, then proceed to the next middleware
  next();
};
