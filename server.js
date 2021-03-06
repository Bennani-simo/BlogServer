const express = require('express'),
    app = express(),
    config = require('config'),
    port = config.get('port') || 3000,
    cors = require('cors')

const { verify_auth_token } = require('./helpers/jwt_helper')
const authRoute = require('./routes/auth.route')
const postsRoute = require('./routes/posts.route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin: config.get('CLIENT_URL')}));

app.get('/', async (req, res, next) => {
  res.send('Hello from express.')
})

app.get('/protected', verify_auth_token, async (req, res, next) => {
    res.send('Hello from express protected.')
})

app.use('/auth', authRoute)
app.use('/post', postsRoute)

app.listen(port);
console.log('|| API server started on : ' + port);
console.log('|| Url client authorizé : ' +config.get('CLIENT_URL'));

