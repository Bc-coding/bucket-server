const keys = require("../config/keys");
// const user = require("../schema/user");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
    // console.log(req.body);
    // anytime we reach out to another api its async, we will need a callback to deal with promise or async/await
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "$5 for 5 credits",
      source: req.body.id,
    });

    console.log(charge);

    // Access the current user's model by using req.user, this is facilitated by passport.js
    // 1. save 5 credits for the user, to persist the data in the database
    // 2. after successfully saved in the database, we will send the updated data to whoever sent the request
    req.user.credits += 5;

    const user = await req.user.save();

    res.send(user);
  });
};

// TODO: Checking if the user is not logged in as google user, can the credits still be persisted in the database?
