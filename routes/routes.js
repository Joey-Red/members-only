// const express = require("express");
// var router = express.Router();
// const path = require("path");
// const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const bcrypt = require("bcryptjs");
// const dotenv = require("dotenv");
// const bodyParser = require("body-parser");

// const User = mongoose.model(
//   "User",
//   new Schema({
//     username: { type: String, required: true },
//     password: { type: String, required: true },
//   })
// );
// router.use(session({ secret: "dogs", resave: false, saveUninitialized: true }));
// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { message: "Incorrect username" });
//       }
//       bcrypt.compare(password, user.password, (err, res) => {
//         if (res) {
//           // passwords match! log user in
//           return done(null, user);
//         } else {
//           // passwords do not match!
//           return done(null, false, { message: "Incorrect password" });
//         }
//       });
//     });
//   })
// );
// router.use(passport.initialize());
// router.use(passport.session());

// router.post("/sign-up", (req, res, next) => {
//   bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
//     if (err) {
//       return next(err);
//     }
//     const user = new User({
//       username: req.body.username,
//       password: hashedPassword,
//     }).save((err) => {
//       if (err) {
//         return next(err);
//       }
//       res.redirect("/");
//     });
//   });
// });

// router.post(
//   "/log-in",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/",
//   })
// );

// // router.post("/create-post", (req, res) => {
// //   postsCollection
// //     .insertOne(req.body.messageTitle, req.body.textBody, new Date())
// //     .then((res) => {
// //       console.log(res);
// //     });
// //   console.log(res);
// //   res.redirect("/");
// // });
// // router.post("/create-post", (req, res) => {
// //   postsCollection
// //     .insertOne(req.body.messageTitle, req.body.textBody, new Date())
// //     .then((result) => {
// //       res.redirect("/");
// //     })
// //     .catch((error) => console.error(error));
// // });
// router.get("/", (req, res) => {
//   res.render("index", { user: req.user });
// });
// router.get("/create-post", (req, res) => {
//   res.render("create-post", { user: req.user });
// });

// router.get("/log-out", (req, res) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

// router.get("/sign-up", (req, res) => res.render("sign-up-form"));
// router.get("/create-post", (req, res) => res.render("create-post"));

// module.exports = router;
