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

        // console.log(req.files, req.body);
        
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please fill all fields!')
                }
            }
            
            if (req.files.length == 0) 
                return res.send('Please send at least one image')

            let results = await Chef.create(req.body)

            const chefId = results.rows[0].id

            const filesPromise = req.files.map(file => File.create({ ...file, chef_id: chefId }))

            await Promise.all(filesPromise)

            return res.redirect(`/admin/chefs/${chefId}`)

        } catch (error) {
            console.log(error)
        }
    },
    async show(req, res) {

        try {
            let results = await Chef.find(req.parms.id)

            const chef = results.rows[0]

            if (!chef) return res.send('Chef not found!')

            await Chef.findRecipesOfChef(req.params.id)

            return res.render("admin/chefs/show", { chef, recipes })

        } catch (error) {
            console.log(error)
        }
    },
    async edit(req, res) {

        try {
            let results = await Chef.find(req.parms.id)

            const chef = results.rows[0]

            if (!chef) return res.send('Chef not found!')

            return res.render("admin/chefs/edit", { chef })

        } catch (error) {
            console.log(error)
            
        }
    },
    async put(req, res) {

        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please fill all fields!')
                }
            }

            await Chef.update(req.body)

            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch (error) {
            console.log(error)          
        }
    },
    async delete(req, res) {

        try {
            let results = await Chef.find(req.body.id)

            const chef = results.rows[0]

            if (chef.total_recipes >= 1) {
                
                return res.send('Chefs que possuem receitas não podem ser deletados')
            } else {
                
                await Chef.delete(req.body.id)

                return res.redirect(`/admin/chefs`)
            }

        } catch (error) {
            console.log(error)   
        }
    },
}