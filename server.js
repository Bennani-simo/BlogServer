const express = require('express'),
    app = express(),
    config = require('config')
    port = config.get('port') || 3000

const { verify_auth_token } = require('./helpers/jwt_helper')
const authRoute = require('./routes/auth.route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res, next) => {
  res.send('Hello from express.')
})

app.get('/protected', verify_auth_token, async (req, res, next) => {
    res.send('Hello from express protected.')
})

app.use('/auth', authRoute)

app.listen(port);
console.log('|| API server started on : ' + port);

