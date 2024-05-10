const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose')
const pdf = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');
// using version ^2.9.359
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel')

// Configure storage and file filter for Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');  // Save files in the uploads directory
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Assuming user ID is stored in req.user.id after authentication
        const userId = req.user ? req.user.id : 'anonymous'
        cb(null, file.originalname.replace(/\s+/g, '-') + '-' + userId + getExtension(file.mimetype));
    }
});

function getExtension(mimetype) {
    switch (mimetype) {
        case 'application/pdf':
            return '.pdf';
        case 'text/plain':
            return '.txt';
        default:
            return '';
    }
}

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and text files are allowed!'), false); // reject files that are not PDF or TXT
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('file'); // 'file' is the field name

// Upload file controller
const uploadFile = asyncHandler((req, res, next) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(500); // Set the response status directly here
            return next(new Error('A file upload error occurred.'));
        } else if (err) {
            // An unknown error occurred when uploading or file type rejection.
            res.status(400); // Set the response status directly here
            return next(new Error('Only PDF and text files are allowed!'));
        }
        if (!req.file) {
            res.status(400); // Set the response status directly here
            return next(new Error('No file uploaded.'));
        }
        // Save file data in the database
        const file = new File({
            userId: req.user.id,  // Assuming req.user is populated from the auth middleware
            filename: req.file.filename
        });
        await file.save();
        res.status(200).json({
            message: 'File uploaded successfully',
            filename: req.file.filename
        });
    });
});

const getFile = asyncHandler(async (req, res) => {
    const fileId = req.params.fileId;
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return res.status(400).send({ message: "Invalid file ID format." });
    }
    // Fetch file metadata from the database
    const file = await File.findById(req.params.fileId);
    if (!file) {
        res.status(404).send({ message: "File not found" });
        return;
    }
    // Construct the full path to the file
    const filePath = path.join(__dirname, '../uploads', file.filename);
    // Check if file exists in the filesystem
    fs.access(filePath, fs.constants.F_OK, async (err) => {
        if (err) {
            res.status(404).send({ message: "File does not exist on the server." });
            return;
        }
        // Determine file type and handle accordingly
        if (path.extname(file.filename).toLowerCase() === '.pdf') {
            try {
                // This is a placeholder for a streaming PDF text extraction logic
                const text = await extractTextFromPDF(filePath);  // Corrected to pass the file path directly
                const cleanedText = text.replace(/\n/g, ' ');
                res.status(200).send({ filename: file.filename, content: cleanedText });
            } catch (error) {
                res.status(500).send({ message: "Failed to extract text from PDF: " + error.message });
            }
        } else if (path.extname(file.filename).toLowerCase() === '.txt') {
            const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
            let data = '';
            readStream.on('data', (chunk) => {
                data += chunk.replace(/\n/g, ' '); // Process chunk and replace newlines with spaces
            });
            readStream.on('end', () => {
                res.status(200).send({ filename: file.filename, content: data });
            });
            readStream.on('error', (error) => {
                res.status(500).send({ message: "Failed to read text file: " + error.message });
            });
        } else {
            res.status(400).send({ message: "Unsupported file format." });
        }
    });
});

const listFiles = asyncHandler(async (req, res) => {
    const files = await File.find({ userId: req.user.id });  // Assuming the user ID is stored in req.user
    res.status(200).json(files);
});

async function extractTextFromPDF(pdfPath) {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdfDoc = await loadingTask.promise;
        let text = '';

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            text += textContent.items.map(item => item.str).join(' ');
        }

        return text;
    } catch (error) {
        console.error("Failed to extract text from PDF:", error);
        throw new Error("Failed to extract text from PDF.");
    }
}

module.exports = {
    uploadFile,
    getFile,
    listFiles
};
