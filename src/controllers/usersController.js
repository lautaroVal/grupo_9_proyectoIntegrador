const db = require('../database/models');
const sequelize = db.sequelize;
const users = db.user;

const usersController = {
    register: (req, res) => {
        return res.render('users/register', {
            title: 'Register'
        })
    },

    processRegister: (req, res) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            const { firstName, lastName, email, telephone, password } = req.body;
            let users = loadUsers();
            let newUser = {
                id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: "",
                province: "",
                location: "",
                street: "",
                musicFav: "",
                gender: "",
                biography: "",
                telephone: +telephone,
                password: bcryptjs.hashSync(password, 12),
                category: "User",
                avatar: "default-users-image.jpg"
            }
            let usersModify = [...users, newUser];
            storeUsers(usersModify);
            return res.redirect('/users/login');
        } else {
            return res.render('users/register', {
                title: 'Register',
                errors: errors.mapped(),
                old: req.body
            })
        }
    // },

    // login: (req, res) => {
    //     return res.render('users/login', {
    //         title: 'Login'
    //     })
    // },

    // processLogin: (req, res) => {
    //     let errors = validationResult(req);
    //     if (errors.isEmpty()) {

    //         let { id, firstName, lastName, email, telephone, category, avatar } = loadUsers().find(user => user.email === req.body.email);

    //         req.session.userLogin = {
    //             id,
    //             firstName,
    //             lastName,
    //             email,
    //             telephone,
    //             category,
    //             avatar
    //         };

    //         if (req.body.remember) {
    //             res.cookie('codeMusic', req.session.userLogin, {
    //                 maxAge: 1000 * 60 * 60
    //             })
    //         };

    //         return res.redirect('/')
    //     } else {
    //         return res.render('users/login', {
    //             title: 'Login',
    //             errors: errors.mapped()
    //         })
    //     }
    }
}

module.exports = usersController;