const postUrl = `http://localhost:5000/generate`;
// const getUrl = `http://localhost:3000/story/${storyId}`;
console.log(postUrl);
// Make the POST request using fetch API
fetch(postUrl, {
  method: "POST", // Specify the HTTP method as POST
  headers: {
    "Content-Type": "application/json", // Set content type to JSON
  },
  // Convert the data to JSON string for the request body
  body: JSON.stringify({
    prompt: "story about ww2 japanese occupation into singapore",
  }),
})
  .then((response) => response.json()) // Parse the JSON response
  .then((data) => console.log("Success:", data)) // Handle the server's response
  .catch((error) => console.error("Error:", error)); // Handle errors

// const getResponse = await fetch(getUrl);
// Parse the JSON response from the server
// const data = await response.json();
