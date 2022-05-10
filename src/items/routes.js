const express = require('express');

const controller = require('./controller/index');
const validateSchemas = require('../../middlewares/validateSchemas');
const schemas = require('./utils/schemasValidation');

const router = express.Router();

router.post(
  '/api/v1/',
  validateSchemas.inputs(schemas.createItem, 'body'),
  (req, res) => {
    controller.createItem(res, req.body);
  }
);

module.exports = router;