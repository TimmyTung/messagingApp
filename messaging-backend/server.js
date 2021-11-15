import express from "express";
import mongoose from "mongoose";
import People from "./peopleDB.js";
import Convos from "./convoDB.js";
import Pusher from "pusher";
import cors from "cors";

// app configuration
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1244902",
  key: "409ee1be60ed4493d67e",
  secret: "1616fccebe7bc21476b4",
  cluster: "us3",
  useTLS: true
});

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));

// middleware
app.use(express.json());
app.use(cors());

/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Header", "*");
  next();
});*/

// DB configuration
const connectionUrl =
  "mongodb+srv://admin:dAQWx1L9Ct1kHWM0@cluster0.ko4r6.mongodb.net/messaging?retryWrites=true&w=majority";

mongoose.connect(connectionUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("db is connected");

  //const msgCollection = db.collection("contents");
  //const msgStream = msgCollection.watch();

  const convoCollection = db.collection("convos");
  const convoStream = convoCollection.watch();

  convoStream.on("change", change => {
    //console.log("these are the changes: ", change);

    if (change.operationType === "insert") {
      const convoDetails = change.fullDocument;

      pusher.trigger("convos", "inserted", {
        _id: convoDetails._id,
        name: convoDetails.name,
        mess: Array
      });
    }
    if (change.operationType === "update") {
      const updatedMessage = change.updateDescription.updatedFields.mess;
      //console.log("updated descrip: ", updatedMessage);

      pusher.trigger("convos", "updated", {
        mess: updatedMessage
      });
    } else {
      console.log("error with Pusher ", change.operationType);
    }
  });
});

// api gets
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/convos/sync", (req, res) => {
  Convos.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/convos/:convoId", (req, res) => {
  var convoId = req.params.convoId;
  Convos.findOne({ _id: convoId }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/peoples/:email", (req, res) => {
  var email = req.params.email;
  People.findOne({ userEmail: email }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
// api posts
app.post("/convos/new", (req, res) => {
  const db = req.body;

  Convos.create(db, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/peoples/new", (req, res) => {
  const db = req.body;

  People.create(db, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//api patches
app.patch("/convos/:convoId", (req, res) => {
  var updateObject = req.body; // {last_name : "smith", age: 44}
  console.log(updateObject);
  var convoId = req.params.convoId;
  Convos.findOneAndUpdate({ _id: convoId }, { $set: updateObject })
    .then(() => {
      res.status(204).send({ message: "success" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.patch("/peoples/:email", (req, res) => {
  var updateObject = req.body; // {last_name : "smith", age: 44}
  console.log(updateObject);
  var email = req.params.email;
  People.findOneAndUpdate({ userEmail: email }, { $set: updateObject })
    .then(() => {
      res.sendStatus({ message: "success" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
