const Recipe = require('../models/Recipe')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

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

            const chefOptions = results.rows
            
            return res.render('admin/recipes/create', { chefOptions })

        } catch (error) {
            console.log(error)
        }
        
    },
    async post(req, res) {

        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please fill all fields!')
                }
            }

            if (req.files.length == 0) 
                return res.send('Please send at least one image')

            // create recipe
            let results = await Recipe.create(req.body)
            
            const recipeId = results.rows[0].id
console.log(results.rows[0]);
            //create images
            const filesPromise = req.files.map(file => File.create(file))
            
            results = await Promise.all(filesPromise)
// console.log(results.rows[0]);
            const fileId = results[0].rows[0].id
            
            // unite recipe and files
            const recipeFiles = await Promise.all(results.map(result => {
                console.log(`Cadastrando RecipeFile de ${JSON.stringify(result)}`)
                return RecipeFile.create(result.file_id, result.recipe_id)
              }))
            // RecipeFile.create(result.recipe_id, result.file_id)
            // const recipeFilesPromise = req.files.map(file => RecipeFile.create({
            //     ...file,
            //     recipe_id: recipeId,
            //     file_id: fileId
            // }))

            console.log(recipeFiles);
            // results = await Promise.all(recipeFiles)
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
          
            // get images
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
                if (req.body[key] == "" && key != "removed_files") {
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