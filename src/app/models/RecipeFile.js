const { date } = require('../../lib/utils')

const db = require('../../config/db')

module.exports = {
    create(recipe_id, file_id) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            recipe_id,
            file_id
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT * from recipe_files
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipe.id)
            WHERE recipe_files.recipe_id = $1`, [id])
    },
    findByRecipeId(id) {
        return db.query(`
            SELECT * FROM recipe_files
            WHERE recipe_files.recipe_id = $1
            ORDER BY recipe_files.recipe_id ASC`, [id])
    },
    findByRecipeId(id) {
        return db.query(`
            SELECT * FROM recipe_files
            WHERE recipe_files.file_id = $1
            ORDER BY recipe_files.file_id ASC`, [id])
    }
}