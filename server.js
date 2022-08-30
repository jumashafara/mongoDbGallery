require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const imageModel = require("./models/image");
const app = express();

const port = process.env.PORT || 5000;

//connecting to mongoDB
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, UseUnifiedTopology: true },
  (error) => {
    console.log("Connected to mongoDB");
    app.listen(port, () => console.log("Server started"));
  }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setting ejs as template engine
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// handle images get tequest
app.get("/", (req, res) => {
  imageModel.find({}, (error, items) => {
    if (error) {
      console.log(err);
      res.status(500).send("An error occured", err);
    } else {
      res.render("imagesPage", { items: items });
    }
  });
});

//handle image get request
app.post("/", upload.single("image"), (req, res, next) => {
  const obj = {
    name: req.body.name,
    description: req.body.description,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.originalname)
      ),
      contentType: "image/png",
    },
  };

  imageModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/");
    }
  });
});
// //image directory
// const imagesDir = path.join(__dirname, "public/images");

// // Function to read all file name in the directory
// const readdir = (dirname) => {
//   return new Promise((resolve, reject) => {
//     fs.readdir(dirname, (error, filenames) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(filenames);
//       }
//     });
//   });
// };

// //middleware
// app.use(cors());
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/image", express.static(path.join(__dirname, "public/images")));

// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "public/images"));
//   },

//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// //
// const upload = multer({ storage: fileStorageEngine });

// app.get("/images-list", (req, res) => {
//   readdir(imagesDir).then((filenames) => res.json({ images: filenames }));
// });

// // upload single image
// app.post("/single", upload.single("image"), (req, res) => {});

// // upload multiple images
// app.post("/multiple", upload.array("images", 3), (req, res) => {
//   console.log(req.files);
//   res.send("multiple files uploaded");
// });

// app.listen(port, () => console.log("server started"));
