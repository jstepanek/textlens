import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const isPdf = file.type.includes('pdf') || fileName.endsWith('.pdf');
    const isText = file.type.includes('text') || file.type.includes('plain') || fileName.endsWith('.txt');
    
    if (!isPdf && !isText) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or text file.' }, { status: 400 });
    }

    let content: string;

    if (isPdf) {
      try {
        const pdfParse = require('pdf-parse');
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Use simple PDF parsing (revert to working version)
        const pdfData = await pdfParse(buffer);
        
        content = pdfData.text;
        
        // If no text extracted, provide helpful message
        if (!content || content.trim().length === 0) {
          console.log('No text content found in PDF');
          return NextResponse.json({ 
            error: 'No readable text found in PDF. The PDF may be image-based or contain only images. Try using a text-based PDF or converting to text format.' 
          }, { status: 400 });
        }
        
      } catch (pdfError) {
        console.error('PDF parsing error with pdf-parse:', pdfError);
        
        // Try fallback with pdfjs-dist
        try {
          console.log('Trying fallback PDF parsing with pdfjs-dist...');
          const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
          const uint8Array = new Uint8Array(arrayBuffer);
          
          const pdf = await pdfjsLib.getDocument({ 
            data: uint8Array,
            verbosity: 0, // Reduce logging
            stopAtErrors: true, // Stop on errors
          }).promise;
          
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(' ');
              fullText += pageText + '\n';
            } catch (pageError) {
              console.warn(`Error parsing page ${i}:`, pageError);
              continue; // Skip problematic pages
            }
          }
          
          if (fullText.trim().length > 0) {
            content = fullText;
            console.log('Successfully parsed PDF with pdfjs-dist fallback');
          } else {
            throw new Error('No text content found in PDF');
          }
          
        } catch (fallbackError) {
          console.error('Fallback PDF parsing also failed:', fallbackError);
          
          // Provide specific error messages for common issues
          let errorMessage = 'Failed to parse PDF file';
          if (pdfError.message.includes('XRef') || fallbackError.message.includes('XRef')) {
            errorMessage = 'PDF file appears to be corrupted or has invalid structure. Try using a different PDF or converting it to a new PDF format.';
          } else if (pdfError.message.includes('password') || fallbackError.message.includes('password')) {
            errorMessage = 'PDF file is password protected. Please remove the password and try again.';
          } else if (pdfError.message.includes('encrypted') || fallbackError.message.includes('encrypted')) {
            errorMessage = 'PDF file is encrypted. Please decrypt it and try again.';
          } else {
            errorMessage = `PDF parsing failed with multiple methods. The PDF may be corrupted, image-based, or in an unsupported format. Try converting to a text file or using a different PDF.`;
          }
          
          return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
      }
    } else {
      content = await file.text();
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'No content found in file' }, { status: 400 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
