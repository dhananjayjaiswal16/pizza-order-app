const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    const _getUrl = req => {
        if (req.user.role === "admin") {
            return '/admin/orders';
        }
        return '/customers/orders';
    }
    //factory function: returns object
    return {
        login(req, res) {
            res.render("auth/login");
        },
        postLogin(req, res) {
            passport.authenticate('local', (err, user, flashMsg) => {
                if (err) {
                    req.flash('err', flashMsg.message);
                    return next(err);
                }
                if (!user) {
                    req.flash('err', flashMsg.message);
                    return res.redirect('/login');
                }
                req.logIn(user, err => {
                    if (err) {
                        req.flash('err', flashMsg.message);
                        return next(err);
                    }

                    return res.redirect(_getUrl(req));
                })
            })(req, res);
        },
        register(req, res) {
            res.render("auth/register");
        },
        async postRegister(req, res) {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const password2 = req.body.password2;
            //console.log("name email password  "+ name + "  " +email +"  "+ password);
            //if any fielld is missing

            if (password !== password2) {
                req.flash('err', 'Password do not match');
                return res.redirect('/register');
            }

            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('err', 'Email already exists');
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            });
            //bcrypt
            const hashPassword = await bcrypt.hash(password, 10);

            //New user
            const user = new User({
                name: name,
                email: email,
                password: hashPassword
            });
            user.save().then((user) => {
                return res.redirect('/');
            }).catch(err => {
                req.flash('err', 'Something went wrong');
                return res.redirect('/register');
            })
        },
        logout(req, res) {
            req.logout();
            return res.redirect('/login');
        }
    };
}

module.exports = authController;