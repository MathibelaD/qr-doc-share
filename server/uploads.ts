// server/upload.js
import express from 'express';
import multer from 'multer';
const { google } = require('googleapis');
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials/serviceAccount.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});

console.log("auth", auth)
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    console.log('Received upload request:', req.file);

    const drive = google.drive({ version: 'v3', auth: await auth.getClient() });

    const fileMetadata = { name: req.file.originalname };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const uploaded = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, webContentLink',
    });

    console.log('File uploaded to Drive:', uploaded.data);

    await drive.permissions.create({
      fileId: uploaded.data.id,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    fs.unlinkSync(req.file.path);

    const publicLink = `https://drive.google.com/uc?id=${uploaded.data.id}&export=download`;
    console.log('Returning public link:', publicLink);

    res.json({ link: publicLink });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});


module.exports = router;
