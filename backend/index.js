import express from "express";

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
const rooms = {};

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/", (req, res) => {
  console.log("Received a GET request to root");
  res.send("Hello, World!");
});

/**
 * @route POST /upload-url/:roomId
 * @description Allows users to upload a URL to a specific room ID using a URL parameter for roomId.
 * @param {string} roomId - The ID of the room to which the URL will be submitted (from URL params).
 * @body {string} url - The URL to be submitted (from request body).
 * @body {string} paragraph - The accompanying paragraph text.
 * @returns {object} - Confirmation message or error.
 */
app.post("/upload/:roomId", (req, res) => {
  // Destructure roomId from URL parameters
  const { roomId } = req.params;
  // Destructure url from the request body
  const { url, text } = req.body;

  // Validate if both roomId (from params) and url (from body) are provided
  if (!roomId || !url || !text) {
    // If not, send a 400 Bad Request status with an error message
    return res.status(400).json({
      message: "Both roomId (in URL) and url (in body) are required.",
    });
  }

  // Check if the roomId already exists in our storage
  if (!rooms[roomId]) {
    // If not, initialize an empty array for this new room ID
    rooms[roomId] = [];
  }

  // Add the submitted URL to the array for the specified roomId
  rooms[roomId].push({ url, text });

  // Send a success response with a 201 Created status
  console.log(
    `URL '${url}' added to room '${roomId}'. Current URLs for room '${roomId}':`,
    rooms[roomId]
  );
  res.status(201).json({
    message: `URL '${url}' submitted successfully to room '${roomId}'.`,
  });
});

/**
 * @route GET /room-urls/:roomId
 * @description Retrieves all URLs and paragraphs submitted to a particular room ID.
 * @param {string} roomId - The ID of the room whose URLs are to be retrieved.
 * @returns {object} - An array of URLs or an error message.
 */
app.get("/room/:roomId", (req, res) => {
  // Extract roomId from the URL parameters
  const { roomId } = req.params;

  // Retrieve URLs and texts for the given roomId from our storage
  const urlsAndTexts = rooms[roomId];

  // Check if any URLs and texts exist for the specified roomId
  if (!urlsAndTexts || urlsAndTexts.length === 0) {
    // If no data is found, send a 404 Not Found status
    return res.status(404).json({
      message: `No URLs and accompanying text found for room '${roomId}'.`,
    });
  }

  // If data is found, send it in the response with a 200 OK status
  res.status(200).json({ roomId: roomId, entries: urlsAndTexts });
});
