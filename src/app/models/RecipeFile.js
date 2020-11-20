const { date } = require('../../lib/utils')

const db = require('../../config/db')

module.exports = {
    create({ recipe_id, file_id }) { // se eu passo os dados como um obj, eu não tenho necessidade de me preocupar com a ordem dos dandos enviados

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
    files(id) {
        return db.query(`
            SELECT * 
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1`, [id])
    },
    findRecipeId(id) {
        return db.query(`
            SELECT * FROM recipe_files
            WHERE recipe_files.recipe_id = $1
            ORDER BY recipe_files.recipe_id ASC`, [id])
    },
    findFileid(id) {
        return db.query(`
            SELECT * FROM recipe_files
            WHERE recipe_files.file_id = $1
            ORDER BY recipe_files.file_id ASC`, [id])
    }
}