const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const mongoDb = `mongodb+srv://${process.env.MONGO_URL}`;
mongoose.connect(
  mongoDb,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, client) => {
    if (err) {
      console.log(err);
      return;
    }
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
const Post = mongoose.model(
  "Post",
  new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: { type: String, required: true },
  })
);
const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  })
);

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(session({ secret: "dogs", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use("/public/stylesheets", express.static("./public/stylesheets"));
app.use("/public/images/", express.static("./public/images"));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// app.post("/create-post:id", (req, res, next) => {
//   console.log("are we firing?");
//   const post = new Post({
//     postTitle: req.body.postTitle,
//     postBody: req.body.postBody,
//     username: username,
//   }).save((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

app.post("/create-post", (req, res, next) => {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
    user: req.user,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/sign-up", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
});
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/sign-up", (req, res) => res.render("sign-up-form"));
app.get("/create-post", (req, res) => {
  res.render("create-post-form", { user: req.user });
});
app.get("/log-out", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});
app.listen(8080, () => console.log("app listening on port 8080!"));
module.exports = app;
