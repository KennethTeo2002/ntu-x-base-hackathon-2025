import dotenv from "dotenv";
import { SogniClient } from "@sogni-ai/sogni-client";

dotenv.config({
  path: ".\\.env",
});

const SOGNIUSERNAME = process.env.SOGNIUSERNAME;
const PASSWORD = process.env.PASSWORD;

console.log(SOGNIUSERNAME);
console.log(PASSWORD);

const options = {
  appId: "your-app-id", // Required, must be unique string, UUID is recommended
  network: "fast", // Network to use, 'fast' or 'relaxed'
};

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
  positivePrompt:
    "lieutenant Adnan Saidi's heroic last battle on Pasir Panjang against the japanese occupation",
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
// Now you can use image URLs to download images.
// Note that images will be available for 24 hours only!
console.log("Image URLs:", imageUrls);
