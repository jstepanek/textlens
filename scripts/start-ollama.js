const { spawn } = require('child_process');
const fs = require('fs');

async function checkOllamaInstalled() {
  return new Promise((resolve) => {
    const check = spawn('ollama', ['--version'], { stdio: 'pipe' });
    check.on('close', (code) => {
      resolve(code === 0);
    });
    check.on('error', () => {
      resolve(false);
    });
  });
}

async function checkModelExists(model) {
  return new Promise((resolve) => {
    const check = spawn('ollama', ['list'], { stdio: 'pipe' });
    let output = '';
    check.stdout.on('data', (data) => {
      output += data.toString();
    });
    check.on('close', () => {
      resolve(output.includes(model));
    });
    check.on('error', () => {
      resolve(false);
    });
  });
}

async function pullModel(model) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Pulling ${model} model...`);
    const pull = spawn('ollama', ['pull', model], { stdio: 'inherit' });
    pull.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${model} model ready!`);
        resolve();
      } else {
        reject(new Error(`Failed to pull ${model}`));
      }
    });
  });
}

async function startOllama() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Ollama service...');
    const ollama = spawn('ollama', ['serve'], { 
      stdio: 'pipe',
      detached: true
    });
    
    ollama.on('error', (err) => {
      reject(err);
    });
    
    // Give Ollama a moment to start
    setTimeout(() => {
      console.log('✅ Ollama service started!');
      resolve();
    }, 2000);
  });
}

async function setupOllama() {
  try {
    console.log('🔍 Checking Ollama installation...');
    
    const isInstalled = await checkOllamaInstalled();
    if (!isInstalled) {
      console.error('❌ Ollama is not installed. Please install it from https://ollama.ai');
      process.exit(1);
    }
    
    console.log('✅ Ollama is installed');
    
    const model = 'phi3';
    const modelExists = await checkModelExists(model);
    
    if (!modelExists) {
      await pullModel(model);
    } else {
      console.log(`✅ ${model} model already available`);
    }
    
    await startOllama();
    
  } catch (error) {
    console.error('❌ Error setting up Ollama:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupOllama();
}

module.exports = { setupOllama };
