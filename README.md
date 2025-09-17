# TextLens - Document Chat Bot

A modern web application that allows you to upload documents (PDFs, text files) and chat with them using AI powered by Ollama and Mistral.

## Features

- **Document Upload**: Drag and drop or click to upload PDF and text files
- **AI Chat**: Ask questions about your documents using Mistral via Ollama
- **Conversation History**: Maintains context throughout your chat session
- **Modern UI**: Clean, responsive interface with dark mode support
- **Free & Local**: Uses Ollama with Mistral for completely free, local AI processing

## Prerequisites

Before running this application, you need to have Ollama installed and running with the Mistral model:

### 1. Install Ollama

Visit [https://ollama.ai](https://ollama.ai) and install Ollama for your operating system.

### 2. Pull the Mistral Model

```bash
ollama pull mistral
```

### 3. Start Ollama Service

```bash
ollama serve
```

The Ollama service will run on `http://localhost:11434` by default.

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd textlens
```

2. **Quick Setup (Recommended):**
```bash
npm run setup
```
This will install dependencies AND download all lightweight AI models automatically.

3. **Manual Setup:**
```bash
# Install dependencies
npm install

# Download lightweight models
npm run setup-models

# Copy environment configuration
cp .env.local.example .env.local
```

4. (Optional) Modify `.env.local` if your Ollama service runs on a different URL or port.

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a Document**: 
   - Drag and drop a PDF or text file onto the upload area
   - Or click the upload area to browse and select a file

2. **Start Chatting**: 
   - Once your document is processed, you can start asking questions
   - The AI will use the document content to answer your questions
   - Previous conversation context is maintained

3. **Clear Session**: 
   - Click the X button in the document header to clear the current document and start over

## Supported File Types

- PDF files (.pdf)
- Text files (.txt)
- Microsoft Word documents (.doc, .docx)

## Configuration

You can customize the application by modifying the `.env.local` file:

- `OLLAMA_URL`: The URL where your Ollama service is running (default: http://localhost:11434)
- `OLLAMA_MODEL`: The Ollama model to use (default: mistral)

## Troubleshooting

### Ollama Connection Issues

If you see "Ollama service is not available" errors:

1. Make sure Ollama is installed and running:
   ```bash
   ollama serve
   ```

2. Verify the Mistral model is available:
   ```bash
   ollama list
   ```

3. If the model isn't listed, pull it:
   ```bash
   ollama pull mistral
   ```

### Document Processing Issues

- Ensure your PDF files are not password-protected
- Large documents may take longer to process
- Very large documents may be truncated due to context limits

## Development

This project is built with:

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **pdf-parse** - PDF text extraction
- **Ollama** - Local AI inference

## License

This project is open source and available under the MIT License.