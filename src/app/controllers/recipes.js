const Recipe = require('../models/Recipe')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

module.exports = {
    async index(req, res) {

        try {
            let results = await Recipe.all()
            const recipes = results.rows

            const recipeWithImage = await Promise.all(recipes.map( async recipe => {
                const fileResults = await RecipeFile.findRecipeId(recipe.id)   
                const fileId = fileResults.rows[0].file_id
                console.log(fileId);

                const imageResults = await File.find(fileId)
                const image = imageResults.rows[0].path

                return {
                    ...recipe,
                    image: `${req.protocol}://${req.headers.host}${image.replace("public", "")}`
                }
            }))
            
            return res.render('admin/recipes/index', { recipes: recipeWithImage })
            
        } catch (error) {
            console.log(error)
        }

    },
    async create(req, res) {
    
        try {
            // get chefs
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
            const recipeResults = await Recipe.create(req.body)
            const recipe = recipeResults.rows[0]

            // create files
            const filesResults = await Promise.all(req.files.map(file => File.create(file)))  //mapeando cada arquivo para operar o File.create
            const files = filesResults.map(result => result.rows[0]) //para cada results do File.create, mapear cada um acessando o rows[0] (que é o id do File que criei)

            // unite recipe and files
            files.map(file => RecipeFile.create({ recipe_id: recipe.id, file_id: file.id  })) // 

            return res.redirect(`/admin/recipes/${recipe.id}`)
        } catch (error) {
            console.log(error)
        }
    },
    async show(req, res) {

        try {
            const recipeResults = await Recipe.find(req.params.id)

            const recipe = recipeResults.rows[0]

            if (!recipe) return res.send('Recipe not found!')
          
            // get images
            const results = await RecipeFile.findRecipeId(req.params.id)
            const recipeFilesPromise = await Promise.all(results.rows.map(file => File.find(file.file_id)))
            // console.log(JSON.stringify(recipeFilesPromise));

            let recipeFiles = recipeFilesPromise.map(result => result.rows[0])
            recipeFiles = recipeFiles.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
            // console.log(recipeFiles);
            // const files = results.rows.map(file => ({
            //     ...file,
            //     src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            // }))

            return res.render('admin/recipes/show', { recipe, recipeFiles })

        } catch (error) {
            console.log(error)
        }

    },
    async edit(req, res) {

        try {
            let results = await Recipe.find(req.params.id)

            const recipe = results.rows[0]

            if (!recipe) return res.send('Recipe not found!')

            // get chefs
            results = await Recipe.chefsSelectOptions() 

            const chefOptions = results.rows

            // get images
            results = await RecipeFile.files(req.params.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render('admin/recipes/edit', { recipe, files, chefOptions })

        } catch (error) {
            console.log(error)
        }
    },
    async put(req, res) {

        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
                    return res.send('Please fill all fields!')
                }
            }

            let newFiles;

            if (req.files.length != 0) {
                newFiles = await Promise.all(req.files.map(file => File.create(file)))
                // console.log(newFiles);
            
                const files = newFiles.map(result => result.rows[0])
                files.map(file => RecipeFile.create({recipe_id: req.body.id, file_id: file.id}))
                // console.log(files);
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