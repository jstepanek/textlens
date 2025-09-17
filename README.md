# TextLens - Document Chat Bot

A web application that allows you to upload documents (PDFs, text files) and chat with them using AI powered by Ollama and Phi-3.

## Features

- **Document Upload**: Drag and drop or click to upload PDF and text files
- **AI Chat**: Ask questions about your documents using Phi-3 via Ollama
- **Conversation History**: Maintains context throughout your chat session
- **Responsive Interface**: Works on desktop and mobile devices
- **Free & Local**: Uses Ollama with Phi-3 for completely free, local AI processing

## Prerequisites

You need Ollama installed on your system. Visit [https://ollama.ai](https://ollama.ai) to install it.

The application will automatically download the required model and start Ollama when you run `npm run dev`.

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd textlens
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```
This will automatically:
- Check if Ollama is installed
- Download the Phi-3 model if needed
- Start the Ollama service
- Launch the web application

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

## Configuration

The application works out of the box with default settings. Advanced users can customize behavior by setting environment variables:

- `AI_PROVIDER`: Choose between 'ollama', 'openai', or 'anthropic' (default: ollama)
- `OLLAMA_URL`: The URL where your Ollama service is running (default: http://localhost:11434)
- `OLLAMA_MODEL`: The Ollama model to use (default: phi3)
- `OPENAI_API_KEY`: Your OpenAI API key (if using OpenAI)
- `ANTHROPIC_API_KEY`: Your Anthropic API key (if using Anthropic)

## Troubleshooting

### Ollama Issues

If you see "Ollama service is not available" errors:

1. Make sure Ollama is installed from [https://ollama.ai](https://ollama.ai)
2. Try running `npm run dev` again - it will automatically set up Ollama
3. If issues persist, manually start Ollama:
   ```bash
   ollama serve
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
- **OpenAI API** - Cloud AI fallback
- **Anthropic API** - Cloud AI fallback

## License

This project is open source and available under the MIT License.