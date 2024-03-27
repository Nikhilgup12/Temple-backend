const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "image.db");
const app = express();
app.use(express.json()); // Enables parsing of JSON data in requests
app.use(cors());
let db = null;

const initialize = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is started");
    });
  } catch (e) {
    console.log(`Error message: ${e.message}`);
    process.exit(1);
  }
};

initialize();

// Get all images (GET /image/)
app.get("/image/", async (request, response) => {
  const getQuery = `SELECT * FROM images`;
  const images = await db.all(getQuery);
  response.send(images);
});

// Get image by Id (GET /image/:imageId)
app.get("/image/:imageId", async (request, response) => {
  const { imageId } = request.params;
  const getQuery = `SELECT * FROM images WHERE id = ${imageId}`;
  const image = await db.get(getQuery);
  if (image) {
    response.send(image);
  } else {
    response.sendStatus(404); // Not Found response for missing image
  }
});

// Add a new image (POST /image/)
app.post("/image/", async (request, response) => {
  const addDetails = request.body;
  const { name, location, image_url, description } = addDetails;
  const addQuery = `INSERT INTO images (name, location, image_url, description)
                   VALUES ('${name}', '${location}', '${image_url}', '${description}')`;
  await db.run(addQuery);
  response.send("Image added successfully");
});

// Update image URL (PUT /image/:imageId)
app.put("/image/:imageId", async (request, response) => {
  const { imageId } = request.params;
  const updateDetails = request.body;
  const { image_url } = updateDetails;
  const updateQuery = `UPDATE images SET image_url = '${image_url}' WHERE id = ${imageId}`;
  await db.run(updateQuery);
  response.send("Image updated successfully");
});
