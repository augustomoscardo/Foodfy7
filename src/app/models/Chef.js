const { date } = require('../../lib/utils')

const db = require('../../config/db')

module.exports = {
    all() {
        return db.query(`
            SELECT * 
            FROM chefs
            ORDER BY id ASC`)
    },
    create(data) {
        const query = `
            INSERT INTO chefs (
                name,
                file_id,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.file_id,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    find(id) {
        db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id], function(err, results) {
                if (err) throw `Database Error! ${err}`

                callback(results.rows[0])
        })
    },
    findRecipesOfChef(id) {
        db.query(`
        SELECT *
        FROM RECIPES
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1`, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`

                callback(results.rows)
        })
    },
    update(data) {
        const query = `
            UPDATE chefs SET
                name=$1,
                avatar_url=$2
            WHERE id = $3
        `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id) {
        db.query(`DELETE FROM chefs
            WHERE id = $1`, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },
    totalRecipesOfChef() {
        db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id`, function(err, results) {
                if (err) throw `Database Error! ${err}`

                callback(results.rows)
            })
    },
    files(id) {
        return db.query(`SELECT * FROM files WHERE id = $1`, [id])
    }
}