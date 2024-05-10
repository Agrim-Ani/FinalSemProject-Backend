const express = require('express');
const router = express.Router();
const {uploadFile , getFile, listFiles} = require('../controllers/fileController');
const validate = require('../middleware/validateTokenHandler')

/**
 * @swagger
 * /api/files/list:
 *  get:
 *      tags:
 *          - 2.) Files
 *      summary: "Returns all files uploaded by the current user"
 *      description: "returns all documents from database under the current user _id"
 *      security:
 *          - bearerAuth: []
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: "All files"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          "_id" : "6637f86773f266242d58a746"
 *                          "userId": "6637e7202662c83af40399fa"
 *                          "filename": "file-1714944103045-71926587.pdf"
 *
 */
router.get('/list', validate, listFiles);

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     tags:
 *       - 2.) Files
 *     security:
 *       - bearerAuth: []
 *     summary: Uploads a file
 *     description: Allows for uploading a single PDF or text file.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload.
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filename:
 *                   type: string
 *       400:
 *         description: No file uploaded or file type is invalid
 *       500:
 *         description: Server error or file upload error
 */
router.post('/upload', validate, uploadFile);

/**
 * @swagger
 * /api/files/{fileId}:
 *   get:
 *     tags:
 *       - 2.) Files
 *     security:
 *       - bearerAuth: []
 *     summary: Fetch a specific file
 *     description: Retrieves file data for a given file ID. Requires authentication.
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The file ID of the file to retrieve
 *     responses:
 *       200:
 *         description: The file is fetched and returned in either PDF or text format.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: [application/pdf]
 *               format: binary
 *             example: <binary data>
 *           text/plain:
 *             schema:
 *               type: string
 *               format: binary
 *             example: "Hello, this is a text file."
 *       404:
 *         description: File not found either in database or on server.
 *       401:
 *         description: Unauthorized - Bearer token not valid or missing.
 *       500:
 *         description: A server error occurred.
 */
router.get('/:fileId', validate, getFile);


module.exports = router;
