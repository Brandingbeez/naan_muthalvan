const express = require('express');
const { login } = require('../controllers/adminAuth.controller');
const { validate } = require('../middleware/validate');
const { loginSchema } = require('../validators/admin.schemas');

const router = express.Router();

router.post('/login', validate({ bodySchema: loginSchema }), login);

module.exports = router;