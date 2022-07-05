const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const app = express();

dotenv.config();
const db = mongoose.connection;
const mongoDb = `mongodb+srv://${process.env.MONGO_URL}`;
mongoose.connect(
  mongoDb,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, client) => {
    if (err) {
      console.log(err);
      return;
    }
    postsCollection = db.collection("posts");
  }
);
// const postsCollection = db.collection("posts");
db.on("error", console.error.bind(console, "mongo connection error"));

// let db, postsCollection;

// mongo.connect(
//   `mongodb+srv://${process.env.MONGO_URL}`,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (err, client) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     db = client.db("test");
//     postsCollection = db.collection("posts");
//   }
// );

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  })
);
const Post = mongoose.model(
  "Post",
  new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/public/stylesheets", express.static("./public/stylesheets"));
app.use("/public/images/", express.static("./public/images"));
// app.use(express.static("./public"));
app.use(session({ secret: "dogs", resave: false, saveUninitialized: true }));
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

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
app.post("/create-post", (req, res, next) => {
  const user = new User({
    title: req.body.postTitle,
    body: erq.body.postBody,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// postsCollection.insert({ post });
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/log-out", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/sign-up", (req, res) => res.render("sign-up-form"));
app.get("/create-post", (req, res) => {
  res.render("create-post", { user: req.user });
});

app.listen(8080, () => console.log("app listening on port 8080!"));
module.exports = app;
