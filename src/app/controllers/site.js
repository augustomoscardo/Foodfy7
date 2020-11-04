const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

module.exports = {
    home(req, res) {

        const { filter } = req.query


        if (filter) {
            Recipe.findBy(filter, function(recipes) {
                
                return res.render('site/searchResult', { recipes, filter })
            })
        }
        else {

            Recipe.all(function(recipes) {
                
                return res.render('site/home', { recipes })
            })
        }
    },
    about(req, res) {
        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, function(recipes) {

                return res.render('site/searchResult', { recipes, filter })
            })
        }
        else {
            
                return res.render('site/about')
        }
    },
    recipes(req, res) {
        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, function(recipes) {

                return res.render('site/searchResult', { recipes, filter })
            })
        }
        else {

            Recipe.all(function(recipes) {
            
                return res.render('site/recipes', { recipes })
            })
        }
    },
    recipe(req, res) {
        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, function(recipes) {

                return res.render('site/searchResult', { recipes, filter })
            })
        }
        else {

            Recipe.find(req.params.id, function(recipe) {
                if (!recipe) return res.send('Recipe not found!')

                return res.render('site/recipe', { recipe })
            })
        }
    },
    searchResult(req, res) {

        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, function(recipes) {

                return res.render('site/searchResult', { recipes, filter })
            })
        }
        
    },
    chefs(req, res) {
        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, function(recipes) {
                return res.render('site/searchResult', { recipes, filter })
            })
        } else {

            Chef.totalRecipesOfChef(function(chefs) {
    
                return res.render('site/chefs', { chefs })
            })
        }        
    },
}