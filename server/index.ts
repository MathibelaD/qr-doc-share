// @ts-nocheck
import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';
import { Readable } from 'stream';


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory document store
interface DocumentData {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string; // Google Drive file ID
  uploadDate: Date;
  accessCount: number;
}
const documents: DocumentData[] = [];

// Google Drive API setup
const auth = new google.auth.GoogleAuth({
  keyFile: 'server/credentials/serviceAccount.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

console.log({auth})
// Use memory storage (buffer) for uploads
const storage = multer.memoryStorage();

// Accept only specific file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Upload endpoint
app.post('/api/documents', upload.single('document'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const docId = uuidv4();
    const timestamp = Date.now();

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const uploaded = await drive.files.create({
      requestBody: {
        name: `${Date.now()}_${file.originalname}`,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
      fields: 'id',
    });


    const fileId = uploaded.data.id;

    // Make it public
    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    const downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
    const qrCodeUrl = `http://localhost:5173/download/${docId}`; // Vue frontend route

    // Store document metadata
    documents.push({
      id: docId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: fileId!,
      uploadDate: new Date(),
      accessCount: 0,
    });

    console.log({ documentId: docId, downloadUrl, qrCodeUrl })
    return res.status(201).json({ documentId: docId, downloadUrl, qrCodeUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// Download route - redirects to Google Drive
app.get('/api/documents/:id', (req: Request, res: Response) => {
  const document = documents.find(doc => doc.id === req.params.id);
  if (!document) return res.status(404).json({ error: 'Document not found' });

  document.accessCount += 1;
  const driveFileId = document.path;
  const downloadUrl = `https://drive.google.com/uc?id=${driveFileId}&export=download`;

  return res.redirect(downloadUrl);
});

// Metadata route
app.get('/api/documents/:id/info', (req: Request, res: Response) => {
  const document = documents.find(doc => doc.id === req.params.id);
  if (!document) return res.status(404).json({ error: 'Document not found' });

  const { path, ...meta } = document;
  return res.json(meta);
});

// QR download route for Vue frontend
app.get('/d/:id', (req: Request, res: Response) => {
  return res.redirect(`http://localhost:5173/download/${req.params.id}`);
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
