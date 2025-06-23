// @ts-nocheck
import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { createServerlessHandler } from './serverless-handler'; // helper adapter
import { fileURLToPath } from 'url';
import { basename } from 'path';
import 'dotenv/config';


const app = express();
app.use(cors());
app.use(express.json());

// In-memory store (temporary only — no persistence)
const documents = [];

// 🔐 Decode credentials from ENV and write to /tmp (Vercel supports writing to /tmp)
const SERVICE_ACCOUNT_PATH = path.join('/tmp', 'serviceAccount.json');
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  const base64 = process.env.SERVICE_ACCOUNT_BASE64;
  if (!base64) throw new Error('Missing SERVICE_ACCOUNT_BASE64 env variable');
  fs.writeFileSync(SERVICE_ACCOUNT_PATH, Buffer.from(base64, 'base64').toString('utf8'));
}

// 🔐 Setup Google Drive Auth
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_PATH,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

// 📦 Multer memory upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file type'));
  },
});

// 📤 Upload file to Google Drive
app.post('/api/documents', upload.single('document'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const docId = uuidv4();

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const uploaded = await drive.files.create({
      requestBody: {
        name: `${Date.now()}_${req.file.originalname}`,
        mimeType: req.file.mimetype,
      },
      media: {
        mimeType: req.file.mimetype,
        body: bufferStream,
      },
      fields: 'id',
    });

    const fileId = uploaded.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    const downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
    const qrCodeUrl = `https://your-frontend-domain.com/download/${docId}`;

    documents.push({
      id: docId,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: fileId!,
      uploadDate: new Date(),
      accessCount: 0,
    });

    return res.status(201).json({ documentId: docId, downloadUrl, qrCodeUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// 📥 File download redirect
app.get('/api/documents/:id', (req: Request, res: Response) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  doc.accessCount += 1;
  const url = `https://drive.google.com/uc?id=${doc.path}&export=download`;
  return res.redirect(url);
});

// ℹ️ File metadata
app.get('/api/documents/:id/info', (req: Request, res: Response) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  const { path, ...info } = doc;
  res.json(info);
});

// 🔗 Short URL redirect
app.get('/d/:id', (req: Request, res: Response) => {
  return res.redirect(`https://your-frontend-domain.com/download/${req.params.id}`);
});
const currentFile = basename(fileURLToPath(import.meta.url));

if (currentFile === 'index.ts') {
  const port = 3000;
  app.listen(port, () => {
    console.log(`🚀 Local server running at http://localhost:${port}`);
  });
}
// ❌ No app.listen() here — use Vercel handler
export default createServerlessHandler(app);
