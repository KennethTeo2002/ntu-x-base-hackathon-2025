// Simple API service for Stor.ai frontend

const API_BASE_URL = "http://localhost:5000";

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: "Network error" };
  }
}

// API functions
export const ApiService = {
  // Generate a new story
  async generateStory(prompt) {
    return await apiCall("/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
  },

  // Save story to library
  async saveStory(story) {
    return await apiCall("/stories/save", {
      method: "POST",
      body: JSON.stringify({ story }),
    });
  },

  // Get user's library
  async getLibrary() {
    return await apiCall("/stories/library");
  },

  // Check if server is running
  async healthCheck() {
    return await apiCall("/health");
  },
};

export default ApiService;
