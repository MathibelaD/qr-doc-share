// @ts-nocheck
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Add docId to Request interface
interface RequestWithDocId extends Request {
  docId?: string;
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: RequestWithDocId, file, cb) => {
    const docId = uuidv4();
    const docPath = path.join(uploadsDir, docId);
    fs.mkdirSync(docPath, { recursive: true });
    
    // Add the docId to the request so we can use it later
    req.docId = docId;
    cb(null, docPath);
  },
  filename: (req, file, cb) => {
    // Keep the original filename
    cb(null, file.originalname);
  }
});

// File filter to restrict file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Interface for document metadata
interface DocumentData {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadDate: Date;
  accessCount: number;
}

// Simple in-memory database for document metadata
const documents: DocumentData[] = [];

// Upload endpoint
app.post('/api/documents', upload.single('file'), (req: RequestWithDocId, res: Response) => {
  try {
    const file = req.file;
    const docId = req.docId;
    
    if (!file || !docId) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Store document metadata
    const documentData: DocumentData = {
      id: docId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadDate: new Date(),
      accessCount: 0
    };
    
    documents.push(documentData);
    
    // Generate download URL and QR code URL
    const host = req.get('host');
    const protocol = req.protocol;
    const downloadUrl = `${protocol}://${host}/api/documents/${docId}`;
    const qrCodeUrl = `${protocol}://${host}/d/${docId}`;
    
    return res.status(201).json({
      documentId: docId,
      downloadUrl,
      qrCodeUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// Download endpoint
app.get('/api/documents/:id', (req: Request, res: Response) => {
  try {
    const docId = req.params.id;
    const document = documents.find(doc => doc.id === docId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Increment access count
    document.accessCount += 1;
    
    // Send the file
    return res.download(document.path, document.originalName);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Download failed' });
  }
});

// Document info endpoint
app.get('/api/documents/:id/info', (req: Request, res: Response) => {
  try {
    const docId = req.params.id;
    const document = documents.find(doc => doc.id === docId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Return document metadata without the path
    const { path, ...metadata } = document;
    return res.json(metadata);
  } catch (error) {
    console.error('Info retrieval error:', error);
    return res.status(500).json({ error: 'Could not retrieve document info' });
  }
});

// Serve frontend for QR code scanning
app.get('/d/:id', (req: Request, res: Response) => {
  // In production, serve the Vue.js app and let it handle the routing
  return res.redirect(`http://localhost:5173/download/${req.params.id}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;