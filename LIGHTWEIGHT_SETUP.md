# Lightweight AI Models Setup Guide

## 🚀 **Quick Start - No Lag Solution**

If Ollama is causing your computer to lag, here are lightweight alternatives:

## Option 1: Lightweight Ollama Models (Recommended)

### Install TinyLlama (1.1B parameters - Super Fast)
```bash
ollama pull tinyllama
```

### Other Lightweight Options:
```bash
# Phi-3 Mini (3.8B - Balanced speed/quality)
ollama pull phi3

# Gemma 2B (Google's efficient model)
ollama pull gemma2:2b

# Llama 3.2 1B (Meta's smallest model)
ollama pull llama3.2:1b
```

### Set Environment Variables:
Create a `.env.local` file:
```bash
# Use lightweight model
OLLAMA_MODEL=tinyllama
AI_PROVIDER=ollama
```

## Option 2: Cloud APIs (Zero Local Resources)

### OpenAI Setup:
1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to `.env.local`:
```bash
OPENAI_API_KEY=your_key_here
AI_PROVIDER=openai
```

### Anthropic Setup:
1. Get API key from [Anthropic](https://console.anthropic.com/)
2. Add to `.env.local`:
```bash
ANTHROPIC_API_KEY=your_key_here
AI_PROVIDER=anthropic
```

## Option 3: Optimize Ollama Performance

### Reduce Resource Usage:
```bash
# Set environment variables for lower resource usage
export OLLAMA_NUM_PARALLEL=1
export OLLAMA_MAX_LOADED_MODELS=1
export OLLAMA_MAX_QUEUE=1
```

### Use Quantized Models:
```bash
# Pull quantized versions (smaller, faster)
ollama pull tinyllama:latest
ollama pull phi3:latest
```

## 🎯 **Model Comparison**

| Model | Size | RAM Usage | Speed | Quality |
|-------|------|-----------|-------|---------|
| TinyLlama | 1.1B | ~1GB | ⚡⚡⚡ | ⭐⭐ |
| Phi-3 Mini | 3.8B | ~2GB | ⚡⚡ | ⭐⭐⭐ |
| Gemma 2B | 2B | ~1.5GB | ⚡⚡⚡ | ⭐⭐⭐ |
| Llama 3.2 1B | 1B | ~1GB | ⚡⚡⚡ | ⭐⭐ |
| Mistral | 7B | ~4GB | ⚡ | ⭐⭐⭐⭐ |

## 🔧 **Troubleshooting**

### If Ollama Still Lags:
1. **Try TinyLlama first** - it's the fastest
2. **Use Cloud APIs** - zero local resource usage
3. **Close other applications** to free up RAM
4. **Restart Ollama** after changing models

### Performance Tips:
- Use `tinyllama` for fastest responses
- Use `phi3` for better quality with moderate speed
- Use cloud APIs for best quality with no local lag

## 🚀 **Quick Commands**

```bash
# Start with TinyLlama (fastest)
ollama pull tinyllama
ollama serve

# Or use cloud API (no Ollama needed)
# Just set AI_PROVIDER=openai or anthropic in .env.local
```

The app will automatically detect your settings and use the appropriate model!
