// services/sogni.js - Clean, error-resilient Sogni integration
const { SogniClient } = require('@sogni-ai/sogni-client');

class SogniService {
  constructor() {
    this.client = null;
    this.isInitializing = false;
    this.initPromise = null;
  }

  // Initialize Sogni client (singleton pattern)
  async getClient() {
    if (this.client) return this.client;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._initializeClient();
    return this.initPromise;
  }

  async _initializeClient() {
    try {
      console.log('🔄 Initializing Sogni client...');
      
      const options = {
        appId: `storai-${Date.now()}`, // Unique app ID to avoid conflicts
        network: 'fast' // Use 'relaxed' for cheaper generation
      };

      this.client = await SogniClient.createInstance(options);
      await this.client.account.login(
        process.env.SOGNI_USERNAME, 
        process.env.SOGNI_PASSWORD
      );
      
      // Wait for models to be available
      await this.client.projects.waitForModels();
      
      console.log('✅ Sogni client ready');
      return this.client;
      
    } catch (error) {
      console.log('❌ Sogni initialization failed:', error.message);
      this.client = null;
      this.initPromise = null;
      throw error;
    }
  }

  // Smart model selection - prefer available models with good performance
  selectBestModel(availableModels) {
    if (!availableModels || availableModels.length === 0) {
      throw new Error('No Sogni models available');
    }

    // Sort by worker count (more workers = more reliable)
    const sortedModels = availableModels.sort((a, b) => b.workerCount - a.workerCount);
    return sortedModels[0];
  }

  // Generate image with comprehensive error handling
  async generateImage(prompt, options = {}) {
    try {
      const client = await this.getClient();
      const model = this.selectBestModel(client.projects.availableModels);

      // Conservative settings for hackathon (low cost, high reliability)
      const projectConfig = {
        modelId: model.id,
        positivePrompt: prompt,
        steps: options.steps || 4,           // Very low for cost efficiency
        guidance: options.guidance || 1,     // Low guidance for speed
        numberOfImages: 1,
        // DON'T set tokenType - let it use free tier
        ...(options.stylePrompt && { stylePrompt: options.stylePrompt }),
        ...(options.negativePrompt && { negativePrompt: options.negativePrompt })
      };

      console.log(`🎨 Generating image: "${prompt.substring(0, 50)}..."`);
      
      const project = await client.projects.create(projectConfig);
      
      // Optional: Listen to progress
      project.on('progress', (progress) => {
        console.log(`📊 Generation progress: ${progress}%`);
      });

      const imageUrls = await project.waitForCompletion();
      
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error('No images generated');
      }

      console.log('✅ Image generated successfully');
      return imageUrls[0];

    } catch (error) {
      const errorInfo = this.categorizeError(error);
      console.log(`❌ Sogni error [${errorInfo.type}]:`, errorInfo.message);
      
      // Re-throw with additional context
      const enhancedError = new Error(errorInfo.message);
      enhancedError.type = errorInfo.type;
      enhancedError.hint = errorInfo.hint;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  }

  // Categorize and provide helpful error messages
  categorizeError(error) {
    const status = error?.status;
    const code = error?.payload?.errorCode || error?.code;
    const message = error?.payload?.message || error?.message || String(error);

    // Insufficient funds
    if (code === 4024 || /insufficient funds/i.test(message)) {
      return {
        type: 'INSUFFICIENT_FUNDS',
        message: 'Sogni account has insufficient credits',
        hint: 'Try reducing steps/guidance, remove tokenType, or add credits to your Sogni account'
      };
    }

    // Project not found (usually follows insufficient funds)
    if (status === 404 || code === 102 || /project not found/i.test(message)) {
      return {
        type: 'PROJECT_NOT_FOUND',
        message: 'Project creation failed (likely due to insufficient funds)',
        hint: 'This usually happens when the debit fails. Check your Sogni account balance'
      };
    }

    // Connection issues
    if (code === 4028 || /too many accounts/i.test(message)) {
      return {
        type: 'CONNECTION_LIMIT',
        message: 'Too many concurrent connections for this Sogni account',
        hint: 'Wait a moment and try again, or use a different account'
      };
    }

    // Network/timeout issues
    if (/timeout|network|connection/i.test(message)) {
      return {
        type: 'NETWORK_ERROR',
        message: 'Network connection to Sogni failed',
        hint: 'Check your internet connection and try again'
      };
    }

    // Generic error
    return {
      type: 'UNKNOWN_ERROR',
      message: message || 'Unknown Sogni error occurred',
      hint: 'Check Sogni service status and your account settings'
    };
  }

  // Generate fallback image URL (Unsplash)
  getFallbackImage(prompt) {
    // Extract keywords from prompt for better image matching
    const keywords = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 3)
      .join(' ') || 'story illustration';

    const encodedKeywords = encodeURIComponent(keywords);
    
    // Use Unsplash with story-appropriate dimensions
    return `https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop&auto=format&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&keywords=${encodedKeywords}`;
  }

  // Main method with automatic fallback
  async generateImageWithFallback(prompt, options = {}) {
    try {
      return await this.generateImage(prompt, options);
    } catch (error) {
      console.log(`🔄 Falling back to Unsplash for: "${prompt.substring(0, 30)}..."`);
      return this.getFallbackImage(prompt);
    }
  }

  // Reset client (useful for testing or error recovery)
  reset() {
    this.client = null;
    this.initPromise = null;
    console.log('🔄 Sogni client reset');
  }
}

// Export singleton instance
const sogniService = new SogniService();

module.exports = {
  generateSogniImage: (prompt, options) => sogniService.generateImageWithFallback(prompt, options),
  generateSogniImageStrict: (prompt, options) => sogniService.generateImage(prompt, options),
  fallbackImage: (prompt) => sogniService.getFallbackImage(prompt),
  resetSogniClient: () => sogniService.reset()
};

