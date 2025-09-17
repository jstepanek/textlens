import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface ChatRequest {
  message: string;
  documentContent: string;
  conversationHistory: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { message, documentContent, conversationHistory }: ChatRequest = await request.json();

    if (!message || !documentContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const aiProvider = process.env.AI_PROVIDER || 'ollama';
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'tinyllama';
    
    console.log('AI Provider:', aiProvider, 'Model:', ollamaModel);

    const contextLimit = 4000;
    const truncatedContent = documentContent.length > contextLimit 
      ? documentContent.substring(0, contextLimit) + '...'
      : documentContent;

    const recentHistory = conversationHistory.slice(-6);
    const historyContext = recentHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are a helpful assistant that answers questions about a document. Use the following document content to answer the user's questions accurately and helpfully. If the answer isn't in the document, say so clearly.

Document Content:
${truncatedContent}

Recent conversation history:
${historyContext}

Please answer the user's question based on the document content above.`;

    let response: string;

    if (aiProvider === 'openai') {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    } else if (aiProvider === 'anthropic') {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const completion = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\nUser: ${message}` }
        ],
      });

      response = completion.content[0]?.type === 'text' ? completion.content[0].text : 'I apologize, but I could not generate a response.';

    } else {
      // Default to Ollama with lightweight model
      const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000,
          },
        }),
      });

      if (!ollamaResponse.ok) {
        console.error('Ollama API error:', ollamaResponse.status, ollamaResponse.statusText);
        throw new Error(`Ollama API error: ${ollamaResponse.status}`);
      }

      const ollamaData = await ollamaResponse.json();
      response = ollamaData.response || 'I apologize, but I could not generate a response.';
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    
    if (error instanceof Error && error.message.includes('Ollama API error')) {
      return NextResponse.json(
        { error: 'Ollama service is not available. Please make sure Ollama is running with the Mistral model.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
