// saving images
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const app = express();

const port = process.env.PORT || 5000;

//image directory
const imagesDir = path.join(__dirname, "public/images");

// Function to read all file name in the directory
const readdir = (dirname) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (error, filenames) => {
      if (error) {
        reject(error);
      } else {
        resolve(filenames);
      }
    });
  });
};

//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/image", express.static(path.join(__dirname, "public/images")));

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//
const upload = multer({ storage: fileStorageEngine });

app.get("/images-list", (req, res) => {
  readdir(imagesDir).then((filenames) => res.json({ images: filenames }));
});

// upload single image
app.post("/single", upload.single("image"), (req, res) => {});

// upload multiple images
app.post("/multiple", upload.array("images", 3), (req, res) => {
  console.log(req.files);
  res.send("multiple files uploaded");
});

app.listen(port, () => console.log("server started"));
