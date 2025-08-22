import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SogniClient } from "@sogni-ai/sogni-client";

dotenv.config();

// dotenv.config({
//   path: ".\\.env",
// });

const port = process.env.PORT || 5000;
const SOGNIUSERNAME = process.env.SOGNI_USERNAME;
const SOGNIPASSWORD = process.env.SOGNI_PASSWORD;

const getImageUrls = async (imagePromptText) => {
  const cleanedPrompt = imagePromptText.replace(/[\[\]]/g, "");
  const options = {
    appId: "your-app-id", // Required, must be unique string, UUID is recommended
    network: "fast", // Network to use, 'fast' or 'relaxed'
  };
  const client = await SogniClient.createInstance(options);
  // Login to Sogni account and establish WebSocket connection to Supernet
  await client.account.login(SOGNIUSERNAME, SOGNIPASSWORD);
  // Now wait until list of available models is received.
  // This step is only needed if you want to create project immediately.
  await client.projects.waitForModels();

  const mostPopularModel = client.projects.availableModels.reduce((a, b) =>
    a.workerCount > b.workerCount ? a : b
  );
  // You can get list of available models any time from `client.projects.availableModels`
  const project = await client.projects.create({
    modelId: mostPopularModel.id,
    steps: 20,
    guidance: 7.5,
    positivePrompt: cleanedPrompt,
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
  // console.log("Image URLs:", imageUrls);
  return imageUrls;
};

const generateStoryPart = async (currentStoryContext, userChoice) => {
  // Construct the prompt for the Gemini API
  let promptText = `You are a "Choose Your Own Adventure" story generator.
        Continue the story based on the context provided. After each story segment,
        always provide exactly 2 or 3 distinct choices for the user to make.
        Format your response as follows:
        ---STORY_START---
        [Your generated story segment here, limit it to between 2 and 4 sentences. Make it engaging!]
        ---CHOICES_START---
        1. [Choice Option 1]
        2. [Choice Option 2]
        3. [Choice Option 3 - Optional, provide 2 or 3 total]
        ---END---

        Current Story Context:
        ${currentStoryContext}`;

  if (userChoice) {
    promptText += `\nUser's last choice: "${userChoice}"`;
  } else {
    promptText += `\nThis is the beginning of the story.`;
  }

  // Construct the payload for the Gemini API call
  const payload = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 500,
    },
  };

  const apiKey = process.env.GEMINI_APIKEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  const MAX_RETRIES = 5;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      attempts++;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error: ${response.status} - ${
            errorData.error.message || response.statusText
          }`
        );
      }

      const result = await response.json();
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const rawText = result.candidates[0].content.parts[0].text;
        // Parse the raw text into story content and choices
        console.log("gemini produced \n%s", rawText);
        const { story, choices } = parseGeminiResponse(rawText);
        const sogniPrompt = await generateImagePrompt(story);
        const imageURL = await getImageUrls(sogniPrompt);
        return { storyline: story, imageURL: imageURL, choices: choices };
      } else {
        console.warn(
          "Gemini API response structure unexpected:",
          result,
          "retrying"
        );
      }
    } catch (error) {
      console.error("Failed to fetch from Gemini API:", error);
    }
    if (attempts < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
    }
  }
};
const parseGeminiResponse = (rawText) => {
  let story = "An error occurred while parsing the story.";
  let choices = [];

  // Regular expressions to extract story and choices based on defined delimiters
  const storyMatch = rawText.match(
    /---STORY_START---\s*([\s\S]*?)\s*---CHOICES_START---/
  );
  const choicesMatch = rawText.match(
    /---CHOICES_START---\s*([\s\S]*?)\s*---END---/
  );

  if (storyMatch && storyMatch[1]) {
    story = storyMatch[1].trim();
  }

  if (choicesMatch && choicesMatch[1]) {
    // Split choices by new line and filter out empty strings
    choices = choicesMatch[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && /^\d+\./.test(line)) // Ensure it's a numbered choice
      .map((line) => line.replace(/^\d+\.\s*/, "")); // Remove the numbering (e.g., "1. ")
  }
  return { story, choices };
};

const generateImagePrompt = async (currentStoryContext) => {
  // Construct the prompt for the Gemini API
  let promptText = `You are a "Choose Your Own Adventure" story generator.
        Based on the current story segment, give me a relevant shortened prompt input that I can use to generate a picture with 
        Format your response as follows:
        [short prompt description about story segment]

        Current Story Context:
        ${currentStoryContext}`;

  // Construct the payload for the Gemini API call
  const payload = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 500,
    },
  };

  const apiKey = process.env.GEMINI_APIKEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  const MAX_RETRIES = 5;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      attempts++;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error: ${response.status} - ${
            errorData.error.message || response.statusText
          }`
        );
      }

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const rawText = result.candidates[0].content.parts[0].text;
        return rawText;
      } else {
        console.warn(
          "Gemini API response structure unexpected:",
          result,
          "retrying"
        );
      }
    } catch (error) {
      console.error("Failed to fetch from Gemini API:", error);
    }
    if (attempts < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
    }
  }
};

const app = express();
app.use(express.json());
app.use(cors());
const stories = {};

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/", (req, res) => {
  console.log("Received a GET request to root");
  res.send("Hello, World!");
});

// Delete stories every 3 hours
const CLEAR_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours
setInterval(() => {
  // Clear the storyUrls object, effectively deleting all stories and their contents
  for (const key in storyUrls) {
    delete stories[key];
  }
  console.log(
    `[${new Date().toLocaleString()}] All stories automatically cleared.`
  );
}, CLEAR_INTERVAL_MS);

// Generate a story: TODO @Kenneth
app.post("/generate", async (req, res) => {
  console.log("Received request to generate a story");
  const { prompt, choice } = req.body;
  const story = await generateStoryPart(prompt, choice);
  return res.status(200).json({
    payload: story,
  });
});

app.post("/create-story/:storyId", (req, res) => {
  const { title, originalPrompt } = req.body;
  if (stories[req.params.storyId]) {
    res.status(400).json({
      message: `Story with ID ${req.params.storyId} already exists.`,
    });
  } else {
    stories[req.params.storyId] = {
      title: title,
      originalPrompt: originalPrompt,
      chapters: [],
    };
    console.log(
      `Story with ID ${req.params.storyId} created successfully with title "${title}".`
    );
    res.status(201).json({
      message: `Story with ID ${req.params.storyId} created successfully.`,
    });
  }
});

/**
 * @route POST /upload-url/:roostoryIdmId
 * @description Allows users to upload a URL to a specific story ID using a URL parameter for storyId.
 * @param {string} storyId - The ID of the story to which the URL will be submitted (from URL params).
 * @body {string} url - The URL to be submitted (from request body).
 * @body {string} paragraph - The accompanying paragraph text.
 * @returns {object} - Confirmation message or error.
 */
app.post("/upload/:storyId", (req, res) => {
  // Destructure storyId from URL parameters
  const { storyId } = req.params;
  // Destructure url from the request body
  const { url, text } = req.body;

  // Validate if both storyId (from params) and url (from body) are provided
  if (!storyId || !url || !text) {
    // If not, send a 400 Bad Request status with an error message
    return res.status(400).json({
      message: "Both storyId (in URL) and url (in body) are required.",
    });
  }
  console.log("RECEIVED UPLOAD REQ TO STORY " + storyId);
  console.log(stories[storyId]);

  // Check if the storyId already exists in our storage
  if (!stories[storyId]) {
    // If not, initialize an empty array for this new story ID
    stories[storyId] = [];
  }

  // Add the submitted URL to the array for the specified storyId
  stories[storyId].chapters.push({ url, text });

  // Send a success response with a 201 Created status
  console.log(`URL '${url}' added to stories '${storyId}'.`);
  res.status(201).json({
    message: `URL '${url}' submitted successfully to stories '${storyId}'.`,
  });
});

/**
 * @route GET /story-urls/:storyId
 * @description Retrieves all URLs and paragraphs submitted to a particular story ID.
 * @param {string} storyId - The ID of the story whose URLs are to be retrieved.
 * @returns {object} - An array of URLs or an error message.
 */
app.get("/story/:storyId", (req, res) => {
  // Extract storyId from the URL parameters
  const { storyId } = req.params;

  // Retrieve URLs and texts for the given storyId from our storage
  const urlsAndTexts = stories[storyId];

  // Check if any URLs and texts exist for the specified storyId
  if (!urlsAndTexts || urlsAndTexts.length === 0) {
    // If no data is found, send a 404 Not Found status
    return res.status(404).json({
      message: `No URLs and accompanying text found for story '${storyId}'.`,
    });
  }

  // If data is found, send it in the response with a 200 OK status
  res.status(200).json(stories[storyId]);
});
