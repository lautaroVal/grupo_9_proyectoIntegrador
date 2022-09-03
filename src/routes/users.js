const express = require('express');
const router = express.Router();
const registerValidator = require('../validations/registerValidator')



const {register, login, processLogin, userRegister, processRegister} = require('../controllers/usersController');
/* const loginValidator = require('../validations/loginValidator'); */


router
    .get('/register', register)
    .post('/register', registerValidator, processRegister)
    .get('/login', login)
    /* .post('/login', loginValidator, processLogin) */
    /* .get('/userRegister', userRegister) */

module.exports = router;