const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/user");
const Resv = require("../models/reservation");
router.use(cors());

var jwtToken = process.env.SECRET_KEY || "random";

router.post("/register", (req, res) => {
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  };

  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then((user) => {
              res.json({ status: user.email + "Registered!" });
            })
            .catch((err) => {
              res.send("error: " + err);
            });
        });
      } else {
        res.json({ error: "User already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

router.post("/login", (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // Passwords match
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
          };
          let token = jwt.sign(payload, jwtToken, {
            expiresIn: 1440,
          });
          res.send(token);
        } else {
          // Passwords don't match
          res.json({ error: "User does not exist" });
        }
      } else {
        res.json({ error: "User does not exist" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

router.get("/profile", async (req, res) => {
  const id = req.query.id;
  const user = await User.findById(id);
  await Resv.find()
    .then((resv) => {
      var result = resv.filter((res) => {
        return res.id === user._id.toString();
      });
      res.json(result);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/profile/:id/add", (req, res) => {
  const id = req.body.userid;
  const customerName = req.body.customerName;
  const age = req.body.age;
  const gender = req.body.gender;
  const date = req.body.date;

  const newResv = new Resv({ id, customerName, gender, age, date });

  newResv
    .save()
    .then(() => res.json("Resv Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.delete("/profile/:id", (req, res) => {
  Resv.findByIdAndDelete(req.params.id)
    .then(() => res.json("Resv Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/:id", (req, res) => {
  Resv.findById(req.params.id)
    .then((resv) => res.json(resv))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/profile/update/:id", async (req, res) => {
  try {
    await Resv.findById(req.params.id)
      .then((resv) => {
        (resv.customerName = req.body.customerName), (resv.age = req.body.age);
        resv.gender = req.body.gender;
        resv.date = req.body.date;

        resv
          .save()
          .then(() => res.json("Resv Updated"))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
