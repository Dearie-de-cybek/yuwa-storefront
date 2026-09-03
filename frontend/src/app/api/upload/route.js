import { NextResponse } from 'next/server';
import cloudinary, { isConfigured } from '@/server/cloudinary';
import { requireAdmin } from '@/server/auth';

export const runtime = 'nodejs';

// POST /api/upload — admin: upload one or more files to Cloudinary.
// Send multipart/form-data with one or more `file` fields.
export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  if (!isConfigured()) {
    return NextResponse.json(
      { message: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.' },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const files = formData.getAll('file').filter((f) => typeof f === 'object' && 'arrayBuffer' in f);
  if (files.length === 0) return NextResponse.json({ message: 'No files provided' }, { status: 400 });

  try {
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
        const res = await cloudinary.uploader.upload(dataUri, {
          folder: 'yuwa',
          resource_type: 'auto',
        });
        return {
          url: res.secure_url,
          type: res.resource_type === 'video' ? 'VIDEO' : 'IMAGE',
          width: res.width || null,
          height: res.height || null,
          fileSize: res.bytes || null,
          publicId: res.public_id,
        };
      })
    );

    return NextResponse.json({ files: uploaded }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: 'Upload failed', error: e.message }, { status: 500 });
  }
}
