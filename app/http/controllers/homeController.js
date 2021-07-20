const Menu = require('../../models/menu');

function homeController() {
    //factory function: returns object
    return {
        async index(req, res) {
            const pizzas = await Menu.find();
            res.render("home", { pizzas: pizzas });


        }
    }
}

module.exports = homeController;