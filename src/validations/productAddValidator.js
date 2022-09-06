const { body } = require('express-validator');

module.exports = [
    body('name')
    .notEmpty().withMessage("Debe ingresar un nombre.").bail()
    .isLength({min: 2}).withMessage('Debe contener 3 caracteres como mínimo.').bail()
    .isLength({max: 80}).withMessage('Debe contener 60 caracteres como máximo.'),
    body('imagen'),
    body('imageText'),
    body('description')
    .notEmpty().withMessage('Debe ingresar una descripción'),
    body('price')
    .notEmpty().withMessage("Debe ingresar un precio.").bail(),
    body('category')
    .notEmpty().withMessage('Debe seleccionar una categoría'),
    body('status'),
]