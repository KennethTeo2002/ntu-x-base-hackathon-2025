const postUrl = `http://localhost:3000/upload/${roomId}`;
const getUrl = `http://localhost:3000/room/${roomId}`;

// Make the POST request using fetch API
const postResponse = await fetch(postUrl, {
  method: "POST", // Specify the HTTP method as POST
  headers: {
    "Content-Type": "application/json", // Set content type to JSON
  },
  // Convert the data to JSON string for the request body
  body: JSON.stringify({ url: urlToUpload, text: textToUpload }),
});

const getResponse = await fetch(getUrl);
// Parse the JSON response from the server
const data = await response.json();
