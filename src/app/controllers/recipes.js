const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {

        try {
            let results = await Recipe.all()

            const recipes = results.rows

            return res.render('admin/recipes/index', { recipes })
            
        } catch (error) {
            console.log(error)
        }

    },
    async create(req, res) {
    
        try {
            let results = await Recipe.chefsSelectOptions()

            const options = results.rows[0]
            
            return res.render('admin/recipes/create', { chefOptions: options })

        } catch (error) {
            console.log(error)
        }
        
    },
    async post(req, res) {

        try {
            const keys = Object.keys(req.body)
            console.log("para aqui")

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please fill all fields!')
                }
            }

            if (req.files.length == 0) 
                return res.send('Please send at least one image')


            let results = await Recipe.create(req.body)
            
            const recipeId = results.rows[0].id

            const filesPromise = req.files.map(file => File.create({ ...file, recipe_id: recipeId}))

            await Promise.all(filesPromise)
            
            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch (error) {
            console.log(error)
        }
    },
    async show(req, res) {

        try {
            let results = await Recipe.find(req.params.id)

            const recipe = results.rows[0]

            if (!recipe) return res.send('Recipe not found!')

            results = await Recipe.files(recipe.id)


            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` 
            }))
            
            return res.render('admin/recipes/show', { recipe, files })

        } catch (error) {
            console.log(error)
        }

    },
    async edit(req, res) {

        try {
            let results = await Recipe.find(req.params.id)

            const recipe = results.rows[0]

            if (!recipe) return res.send('Recipe not found!')

            results = await Recipe.chefsSelectOptions() 

            const chefOptions = results.rows

            results = await Recipe.files(recipe.id)

            let files = results.rows

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render('admin/recipes/edit', { recipe, files, chefOptions })

        } catch (error) {
            console.log(error)
        }

        // Recipe.find(req.params.id, function(recipe) {
        //     if (!recipe) return res.send('Recipe not found!')


        //     Recipe.chefsSelectOptions(function(options) {

        //         return res.render('admin/recipes/edit', { recipe, chefOptions: options })
        //     })
        // })
    },
    async put(req, res) {

        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please fill all fields!')
                }
            }

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => 
                    File.create({...file, recipe_id: req.body.id}))

                await Promise.all(newFilesPromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")

                const lastIndex = removedFiles.length - 1

                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }

            await Recipe.update(req.body)

            return res.redirect(`/admin/recipes/${req.body.id}`)

        } catch (error) {
            console.log(error)
        }
    },
    async delete(req, res) {

        try {
            await Recipe.delete(req.body.id)

            return res.redirect(`/admin/recipes`)

        } catch (error) {
            console.log(error)
        }
    },
}