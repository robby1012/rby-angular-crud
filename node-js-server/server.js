const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./app/config/db.config");
const app = express();
var corsOptions = {
  origin: ["http://localhost:8081"],
  credentials: true
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "rbystnl-session",
    secret: "COOKIE_SECRET",
    httpOnly: true
  })
);
const db = require("./app/models");
const Role = db.role;
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connection OK");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "MEAN CRUD APP TEST" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("Error Occured Please Check Query", err);
        }

        console.log("User Added");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("Error Occured Please Check Query", err);
        }

        console.log("Moderator Added");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("Error Occured Please Check Query", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
