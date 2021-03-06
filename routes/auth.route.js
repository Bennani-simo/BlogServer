const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3')

const {
    sign_auth_token,
} = require('../helpers/jwt_helper')

/* Connexion a la base de donnée */
let db = new sqlite3.Database('./db.sqlite3', (err) => {
    if (err){
        console.error(err.message);
    }
    console.log('||Connected to the database');
});

router.get('/login', async(req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader('Content-type', 'application/json');
    /* Vérification du Basic auth */
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    /* Récupération des informations de connexion email/password */
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    try{
        /* Vérifier si le couple email/password est valide */
        let sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
        db.get(sql, [email,password], async (err, row) => {
            if(typeof row !== 'undefined'){
                let payload = {
                    id: row.id,
                    email: row.email,
                };
                /* Généré un jwt */
                const token = await sign_auth_token(payload)
                if(!token) {
                    return res.status(500).json({ message: 'Internal server error' });
                } else {
                    /* Renvoyer le token */
                    return res.status(200).json({ token: token });
                }
            } else {
                return res.status(400).json({ message: 'Incorrect user information' });
            }
        });
    } catch (e) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router
