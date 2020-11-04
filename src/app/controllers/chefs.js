const { date } = require('../../lib/utils')

const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
    async index(req, res) {

        try {
            let results = await Chef.all()

            const chefs = results.rows

            return res.render('admin/chefs/index', { chefs })

        } catch (error) {
            console.log(error)
        }

    },
    create(req, res) {
    
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please fill all fields!')
                }
            }

        let results = await Chef.create(req.body)

        const chefId = results.rows[0].id

        // const filesPromise = req.files.map(file => File.create({ ...file, chef_id: chefId}))

        // await Promise.all(filesPromise)

        return res.redirect(`/admin/chefs/${chefId}`)

        } catch (error) {
            console.log(error)
        }
    },
    async show(req, res) {

        try {
            
        } catch (error) {
            console.log(error)
        }

        Chef.find(req.params.id, function(chef) {
            if (!chef) return res.send('Chef not found!')

            Chef.findRecipesOfChef(req.params.id, function(recipes) {

                return res.render("admin/chefs/show", { chef, recipes })
            })
        })
    },
    async edit(req, res) {

        try {
            
        } catch (error) {
            console.log(error)
            
        }

        Chef.find(req.params.id, function(chef) {
            if (!chef) return res.send('Chef not found!')
            
            return res.render("admin/chefs/edit", { chef })
        })
    },
    async put(req, res) {

        try {
            
        } catch (error) {
            console.log(error)
            
        }

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please fill all fields!')
            }
        }

        Chef.update(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    async delete(req, res) {

        try {
            
        } catch (error) {
            console.log(error)
            
        }

        Chef.find(req.body.id, function(chef) {
            if (chef.total_recipes >= 1) {

                return res.send('Chefs que possuem receitas não podem ser deletados')
            } else {

                Chef.delete(req.body.id, function() {
                    
                    return res.redirect(`/admin/chefs`)
                })
            }
        })
    },
}