@echo off
echo Setting up TextLens AI Models...
echo This will download lightweight models to avoid system lag
echo.

REM Check if Ollama is installed
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ollama is not installed. Please install Ollama first:
    echo    Visit: https://ollama.ai
    echo    Or download from: https://github.com/ollama/ollama/releases
    pause
    exit /b 1
)

echo SUCCESS: Ollama found, downloading lightweight models...
echo.

REM Download lightweight models
echo Downloading TinyLlama (1.1B) - Fastest...
ollama pull tinyllama


echo Downloading Phi-3 Mini (3.8B) - Higher Quality...
ollama pull phi3

echo Downloading Gemma 2B (2B) - Google's model...
ollama pull gemma2:2b

echo Downloading Llama 3.2 1B (1B) - Meta's smallest...
ollama pull llama3.2:1b

echo.
echo SUCCESS: All lightweight models downloaded!
echo.
echo Available models:
echo    • TinyLlama (1.1B) - Fastest
echo    • Phi-3 Mini (3.8B) - Balanced (Recommended)
echo    • Gemma 2B (2B) - Google
echo    • Llama 3.2 1B (1B) - Meta
echo.
echo To start Ollama: ollama serve
echo Then visit: http://localhost:3000
echo.
echo Tip: Use Phi-3 Mini for the best balance of speed and quality!
pause
