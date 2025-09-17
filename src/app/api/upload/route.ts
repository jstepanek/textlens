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
        
        // For XRef errors, try a more lenient approach
        if (pdfError.message.includes('XRef') || pdfError.message.includes('bad XRef')) {
          try {
            console.log('Trying lenient PDF parsing for XRef issues...');
            const pdfParse = require('pdf-parse');
            
            // Try with more lenient options
            const pdfData = await pdfParse(buffer, {
              max: 0,
              // Try to ignore XRef issues
              normalizeWhitespace: false,
              disableCombineTextItems: true
            });
            
            if (pdfData.text && pdfData.text.trim().length > 0) {
              content = pdfData.text;
              console.log('Successfully parsed PDF with lenient options');
            } else {
              throw new Error('No text content found even with lenient parsing');
            }
            
          } catch (lenientError) {
            console.error('Lenient PDF parsing also failed:', lenientError);
            
            // Provide helpful guidance for XRef issues
            return NextResponse.json({ 
              error: 'This PDF has structural issues (XRef corruption) that prevent text extraction. Please try:\n\n1. Re-save the PDF in a different application\n2. Convert to text format (.txt)\n3. Use a PDF repair tool\n4. Try a different version of the PDF' 
            }, { status: 400 });
          }
        } else {
          // For other errors, provide generic helpful message
          let errorMessage = 'Failed to parse PDF file';
          if (pdfError.message.includes('password')) {
            errorMessage = 'PDF file is password protected. Please remove the password and try again.';
          } else if (pdfError.message.includes('encrypted')) {
            errorMessage = 'PDF file is encrypted. Please decrypt it and try again.';
          } else {
            errorMessage = `PDF parsing failed: ${pdfError.message}. Try converting to a text file or using a different PDF.`;
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
