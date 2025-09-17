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
      const pdf = (await import('pdf-parse')).default;
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdf(buffer);
      content = pdfData.text;
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
