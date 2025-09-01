#!/usr/bin/env node

/**
 * LiteLLM Model Discovery Script
 * 
 * Checks what models are actually available in your LiteLLM instance
 * Run with: node check-models.js
 */

const path = require('path');

// Load environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });
} catch (e) {
  console.error('❌ dotenv not available. Make sure environment variables are set.');
  process.exit(1);
}

async function checkAvailableModels() {
  console.log('🔍 Checking available models in LiteLLM...\n');
  
  const apiBase = process.env.LITELLM_API_BASE;
  const apiKey = process.env.LITELLM_API_KEY;
  
  if (!apiBase || !apiKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - LITELLM_API_BASE:', apiBase || 'NOT SET');
    console.error('   - LITELLM_API_KEY:', apiKey ? 'SET' : 'NOT SET');
    process.exit(1);
  }
  
  console.log('📡 LiteLLM Configuration:');
  console.log('   - API Base:', apiBase);
  console.log('   - API Key:', apiKey.substring(0, 8) + '...');
  console.log();
  
  try {
    console.log('🚀 Fetching models from LiteLLM...');
    
    const response = await fetch(`${apiBase}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      process.exit(1);
    }
    
    const data = await response.json();
    console.log('✅ Successfully retrieved models!\n');
    
    // Display available models
    console.log('📋 Available Models:');
    console.log('='.repeat(50));
    
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((model, index) => {
        console.log(`${index + 1}. ${model.id}`);
        if (model.object) console.log(`   Type: ${model.object}`);
        if (model.created) console.log(`   Created: ${new Date(model.created * 1000).toISOString()}`);
        console.log();
      });
      
      console.log(`📊 Total models available: ${data.data.length}\n`);
      
      // Check if our configured models exist
      console.log('🔍 Checking configured models:');
      console.log('='.repeat(50));
      
      const configuredModels = {
        'AI_PRIMARY_MODEL': process.env.AI_PRIMARY_MODEL || 'gpt-4-turbo-preview',
        'AI_FALLBACK_MODEL': process.env.AI_FALLBACK_MODEL || 'claude-3-haiku', 
        'AI_IMAGE_MODEL': process.env.AI_IMAGE_MODEL || 'dall-e-3'
      };
      
      const availableModelIds = data.data.map(m => m.id);
      
      Object.entries(configuredModels).forEach(([envVar, modelId]) => {
        const isAvailable = availableModelIds.includes(modelId);
        console.log(`${isAvailable ? '✅' : '❌'} ${envVar}: ${modelId}`);
        
        if (!isAvailable) {
          // Suggest alternatives
          const suggestions = availableModelIds.filter(id => 
            id.toLowerCase().includes(modelId.split('-')[0]) ||
            (modelId.includes('claude') && id.includes('claude')) ||
            (modelId.includes('gpt') && id.includes('gpt')) ||
            (modelId.includes('dall-e') && id.includes('dall-e'))
          ).slice(0, 3);
          
          if (suggestions.length > 0) {
            console.log(`   💡 Suggested alternatives: ${suggestions.join(', ')}`);
          }
        }
      });
      
    } else {
      console.log('❌ Unexpected response format:', data);
    }
    
  } catch (error) {
    console.error('❌ Failed to fetch models:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('   🔍 Network issue - check your internet connection and API base URL');
    } else if (error.message.includes('401')) {
      console.error('   🔐 Authentication failed - check your API key');
    } else if (error.message.includes('timeout')) {
      console.error('   ⏱️  Request timeout - LiteLLM server may be slow');
    }
    
    process.exit(1);
  }
}

// Run the check
checkAvailableModels().catch(console.error);