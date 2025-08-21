import express from "express";
import dotenv from "dotenv";
import { SogniClient } from "@sogni-ai/sogni-client";

dotenv.config({
  path: ".\\.env",
});

const port = process.env.PORT || 5000;
const SOGNIUSERNAME = process.env.SOGNI_USERNAME;
const PASSWORD = process.env.SOGNI_PASSWORD;
const options = {
  appId: "your-app-id", // Required, must be unique string, UUID is recommended
  network: "fast", // Network to use, 'fast' or 'relaxed'
};

const getImageUrls = async () => {
  const client = await SogniClient.createInstance(options);
  // Login to Sogni account and establish WebSocket connection to Supernet
  await client.account.login(SOGNIUSERNAME, PASSWORD);
  // Now wait until list of available models is received.
  // This step is only needed if you want to create project immediately.
  const models = await client.projects.waitForModels();

  const mostPopularModel = client.projects.availableModels.reduce((a, b) =>
    a.workerCount > b.workerCount ? a : b
  );
  // You can get list of available models any time from `client.projects.availableModels`
  const project = await client.projects.create({
    modelId: mostPopularModel.id,
    steps: 20,
    guidance: 7.5,
    positivePrompt: "a robot eating a bowl of noodles in a futuristic city",
    negativePrompt:
      "malformation, bad anatomy, bad hands, missing fingers, cropped, low quality, bad quality, jpeg artifacts, watermark",
    stylePrompt: "realistic",
    numberOfImages: 1,
    tokenType: "spark",
  });

  project.on("progress", (progress) => {
    console.log("Project progress:", progress);
  });
  const imageUrls = await project.waitForCompletion();
  console.log("Image URLs:", imageUrls);
  return imageUrls;
};

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

// Delete rooms every 3 hours
const CLEAR_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours
setInterval(() => {
  // Clear the roomUrls object, effectively deleting all rooms and their contents
  for (const key in roomUrls) {
    delete rooms[key];
  }
  console.log(
    `[${new Date().toLocaleString()}] All rooms automatically cleared.`
  );
}, CLEAR_INTERVAL_MS);

// Generate a story: TODO @Kenneth
app.get("/generate", async (req, res) => {
  console.log("Received request to generate a story");
  const urls = await getImageUrls();
  return res.status(200).json({
    url: urls,
  });
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
