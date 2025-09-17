import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.includes('pdf') && !file.type.includes('text')) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    let content: string;

    if (file.type.includes('pdf')) {
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
