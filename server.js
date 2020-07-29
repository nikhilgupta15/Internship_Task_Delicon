var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

var port = process.env.PORT || 5000;

var app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.ATLAS_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("mongoDB connected"))
  .catch((e) => console.log(e));

// mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("Mongo DB Connection Est. Yay!!");
// });

var userRouter = require("./routes/users");

app.use("/users", userRouter);

// if (process.env.NODE_ENV === "production") {
//   //set static folder
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }
app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
