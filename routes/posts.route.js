const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3')

/* Connexion a la base de donnée */
let db = new sqlite3.Database('./db.sqlite3', (err) => {
    if (err){
        console.error(err.message);
    }
    console.log('||Connected to the database');
});

router.post('/', async(req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader('Content-type', 'application/json');
    try{
        /* Vérifier si le couple email/password est valide */
        let sql = `SELECT * FROM posts WHERE id = ?`;
        db.get(sql, [req.body.id], async (err, row) => {
            if(typeof row !== 'undefined'){
                return res.status(200).json({ success : false, post : row });

            } else {
                return res.status(400).json({ success : false, message: 'post not find' });
            }
        });
    } catch (e) {
        return res.status(500).json({ success : false, message: 'Internal server error' });
    }
});

router.get('/allPost', async(req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader('Content-type', 'application/json');

    try{
        /* Vérifier si le couple email/password est valide */
        let sql = `SELECT * FROM posts;`;
        db.all(sql,  async (err, row) => {
            if(typeof row !== 'undefined'){
                return res.status(200).json({ success : false, posts : row });

            } else {
                return res.status(400).json({ success : false, message: 'no post' });
            }
        });
    } catch (e) {
        return res.status(500).json({ success : false, message: 'Internal server error' });
    }
});

router.post('/addPost', async(req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader('Content-type', 'application/json');
    try{
        /* Vérifier si le couple email/password est valide */
        let sql = `INSERT INTO posts (titre, description, user_id) VALUES (?, ?, ?)`;
        db.run(sql, [req.body.title, req.body.content, 1], async (err, id) => {
            if(err){
                return res.status(400).json({ success : false, message: err });
            } else {
                return res.status(200).json({ success : true, id: id});
            }
        });
    } catch (e) {
        return res.status(500).json({ success : false, message: 'Internal server error' });
    }
});

router.post('/delete', async(req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader('Content-type', 'application/json');
    try{
        /* Vérifier si le couple email/password est valide */
        let sql = `DELETE FROM posts where id = ?`;
        db.run(sql, [req.body.id], async (err, id) => {
            if(err){
                return res.status(400).json({ success : false, message: err });
            } else {
                return res.status(200).json({ success : true, id: id});
            }
        });
    } catch (e) {
        return res.status(500).json({ success : false, message: 'Internal server error' });
    }
});

module.exports = router
