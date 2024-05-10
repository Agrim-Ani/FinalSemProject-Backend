const express = require('express')
const {registerUser,loginUser,currentUser} = require('../controllers/userController');
const validate = require('../middleware/validateTokenHandler')
const router = express.Router()

/**
 * @swagger
 * /api/users/register:
 *  post:
 *      tags:
 *          - 1.) Authentication
 *      summary: "adds user to database"
 *      description: "registers user"
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              default: user1
 *                              type: string
 *                          email:
 *                              default: user1@root.com
 *                              type: string
 *                          password:
 *                              default: user123
 *                              type: string
 *              example:
 *                  username: "user"
 *                  email: "user@root.com"
 *                  password: "root"
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: "creaded user_id and email"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          "_id": "ObjectId"
 *                          "email": "useer@root.com"
 *
 */
router.post('/register',registerUser);

/**
 * @swagger
 * /api/users/login:
 *  post:
 *      tags:
 *          - 1.) Authentication
 *      summary: "Returns auth token"
 *      description: "logs in user and return a jwt token"
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              default: user1@root.com
 *                              type: string
 *                          password:
 *                              default: user123
 *                              type: string
 *              example:
 *                  email: "hey@gmail.com"
 *                  password: "hey"
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: "Authorization token"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          "data": "token"
 *
 */
router.post('/login',loginUser);

/**
 * @swagger
 * /api/users/current:
 *  get:
 *      tags:
 *          - 1.) Authentication
 *      summary: "Returns current user"
 *      description: "checks for current user by decoding bearer token"
 *      security:
 *          - bearerAuth: []
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: "Authorization token"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          "data": "token"
 *
 */
router.get('/current',validate,currentUser);
module.exports = router;