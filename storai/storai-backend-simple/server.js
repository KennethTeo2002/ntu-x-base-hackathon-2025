// server.js - Improved with robust Sogni integration
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateSogniImage, fallbackImage } = require('./services/sogni');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Global variables
let gemini;
let stories = []; // Simple in-memory storage

// Environment check
console.log('🔍 Environment check:');
console.log('  GEMINI_APIKEY:', process.env.GEMINI_APIKEY ? '✅ Present' : '❌ Missing');
console.log('  SOGNI_USERNAME:', process.env.SOGNI_USERNAME ? '✅ Present' : '❌ Missing');
console.log('  SOGNI_PASSWORD:', process.env.SOGNI_PASSWORD ? '✅ Present' : '❌ Missing');

// Initialize AI services
async function initAI() {
  try {
    console.log('🚀 Setting up AI services...');
    
    // Setup Gemini
    gemini = new GoogleGenerativeAI(process.env.GEMINI_APIKEY);
    console.log('✅ Gemini ready');
    
    // Sogni will be initialized on first use (lazy loading)
    console.log('📝 Sogni will initialize on first image request');
    
  } catch (error) {
    console.error('❌ Failed to initialize AI:', error.message);
  }
}

// Generate story with Gemini
async function generateStory(prompt) {
  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const storyPrompt = `Write an engaging short story (about 200-250 words) based on this prompt: "${prompt}". 
    Make it creative, vivid, and compelling. Focus on strong imagery and emotion. 
    Just return the story content, no extra formatting or titles.`;
    
    const result = await model.generateContent(storyPrompt);
    const story = result.response.text();
    
    return story.trim();
  } catch (error) {
    console.log('❌ Error generating story:', error.message);
    return `Once upon a time, inspired by "${prompt}", an incredible adventure began. The story unfolded with mystery, wonder, and unexpected discoveries that would change everything...`;
  }
}

// Generate image with smart fallback
async function generateStoryImage(prompt, storyContent = '') {
  try {
    // Create a rich image prompt combining the original prompt and story context
    const imagePrompt = storyContent 
      ? `Illustration for story: ${prompt}. Scene: ${storyContent.substring(0, 100)}...`
      : `Beautiful illustration for: ${prompt}`;

    console.log('🎨 Generating image...');
    
    // Use the improved Sogni service with automatic fallback
    const imageUrl = await generateSogniImage(imagePrompt, {
      steps: 4,        // Low cost settings
      guidance: 1,     // Fast generation
      stylePrompt: 'digital art, illustration, fantasy art'
    });
    
    return imageUrl;
    
  } catch (error) {
    console.log('🔄 Using fallback image due to error:', error.message);
    return fallbackImage(prompt);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Stor.ai server is running!',
    services: {
      gemini: gemini ? 'ready' : 'not initialized',
      sogni: 'lazy-loaded'
    }
  });
});

// Generate story
app.post('/api/stories/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Story prompt is required and cannot be empty' 
      });
    }

    console.log(`📖 Generating story for: "${prompt}"`);
    
    // Generate story and image in parallel for better performance
    const [content, image_url] = await Promise.all([
      generateStory(prompt),
      generateStoryImage(prompt)
    ]);
    
    // Create story object
    const story = {
      id: Date.now().toString(),
      title: 'Generated Story',
      chapter: 0,
      content: content,
      image_url: image_url,
      prompt: prompt,
      type: 'original',
      created_at: new Date().toISOString()
    };
    
    console.log('✅ Story generated successfully');
    
    res.json({
      success: true,
      story: story
    });
    
  } catch (error) {
    console.error('❌ Story generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate story. Please try again.' 
    });
  }
});

// Generate next chapter
app.post('/api/stories/next-chapter', async (req, res) => {
  try {
    const { storyId, currentStory } = req.body;
    
    if (!currentStory) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current story data is required' 
      });
    }

    console.log(`📚 Generating next chapter for story: ${storyId}`);
    
    const nextChapterPrompt = `Continue this story with the next chapter:

Title: ${currentStory.title}
Current Chapter ${currentStory.chapter}: ${currentStory.content}

Write the next chapter (about 200-250 words) that continues the story naturally. 
Make it exciting and build on the existing narrative. Focus on character development and plot progression.`;
    
    // Generate next chapter content and image in parallel
    const [nextContent, image_url] = await Promise.all([
      generateStory(nextChapterPrompt),
      generateStoryImage(`${currentStory.prompt} - Chapter ${currentStory.chapter + 1}`, nextContent)
    ]);
    
    console.log('✅ Next chapter generated successfully');
    
    res.json({
      success: true,
      chapter: {
        chapter: currentStory.chapter + 1,
        content: nextContent,
        image_url: image_url
      }
    });
    
  } catch (error) {
    console.error('❌ Next chapter generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate next chapter. Please try again.' 
    });
  }
});

// Save story
app.post('/api/stories/save', async (req, res) => {
  try {
    const { story } = req.body;
    
    if (!story) {
      return res.status(400).json({ 
        success: false, 
        message: 'Story data is required' 
      });
    }
    
    // Add to our simple storage with metadata
    const savedStory = {
      ...story,
      savedAt: new Date().toISOString(),
      id: story.id || Date.now().toString()
    };
    
    stories.push(savedStory);
    
    console.log(`💾 Story saved: "${story.title || 'Untitled'}" (ID: ${savedStory.id})`);
    
    res.json({
      success: true,
      message: 'Story saved to your library!',
      savedStory: savedStory
    });
    
  } catch (error) {
    console.error('❌ Save story error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save story. Please try again.' 
    });
  }
});

// Get library
app.get('/api/stories/library', (req, res) => {
  try {
    // Demo stories for showcase
    const demoStories = [
      {
        id: 'demo1',
        title: 'The Enchanted Forest',
        description: 'A magical journey through mystical woods',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
        type: 'demo'
      },
      {
        id: 'demo2', 
        title: 'Cosmic Adventure',
        description: 'An epic space exploration saga',
        image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop&auto=format',
        type: 'demo'
      },
      {
        id: 'demo3',
        title: 'Ocean Mysteries',
        description: 'Deep sea discoveries and ancient secrets',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&auto=format',
        type: 'demo'
      }
    ];
    
    // Format saved stories for library display
    const savedStories = stories.map(story => ({
      id: story.id,
      title: story.title || 'Generated Story',
      description: story.content ? story.content.substring(0, 100) + '...' : 'A generated story',
      image: story.image_url,
      type: 'saved',
      savedAt: story.savedAt,
      chapter: story.chapter || 0
    }));
    
    console.log(`📚 Library requested: ${demoStories.length} demo + ${savedStories.length} saved stories`);
    
    res.json({
      success: true,
      stories: {
        demo: demoStories,
        saved: savedStories,
        total: demoStories.length + savedStories.length
      }
    });
    
  } catch (error) {
    console.error('❌ Library fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load library. Please try again.' 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Start server
async function startServer() {
  await initAI();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Stor.ai Server running on http://localhost:${PORT}`);
    console.log('📚 Available endpoints:');
    console.log('  POST /api/stories/generate - Generate new story');
    console.log('  POST /api/stories/next-chapter - Generate next chapter');
    console.log('  POST /api/stories/save - Save story to library');
    console.log('  GET  /api/stories/library - Get story library');
    console.log('  GET  /api/health - Health check');
    console.log('\n✨ Ready for hackathon demo!\n');
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Stor.ai server...');
  process.exit(0);
});

startServer().catch(error => {
  console.error('💥 Failed to start server:', error);
  process.exit(1);
});

