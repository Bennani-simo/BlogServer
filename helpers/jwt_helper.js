const JWT = require('jsonwebtoken')
const config = require('config')

module.exports = {
  sign_auth_token: async (payload) => {
    const secret = config.get('TOKEN_SECRET')
    const options = {
      expiresIn: '1h',
      issuer: config.get('jwtIssuer'),
      subject: payload.email,
      audience: payload.email,
    }
    try {
      return await JWT.sign(payload, secret, options);
    } catch (err) {
      return {success : false,  message: 'Internal server error'};
    }
  },

  verify_auth_token: (req, res, next) => {
    if (!req.headers['authorization']) return next(res.status(500).json({ message: 'Invalid authorization' }))
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]

    JWT.verify(token, config.get('TOKEN_SECRET'), (err, payload) => {
      if (err) {
        return next(res.status(500).json({ success: false, message: 'Invalid token or expired session' }))
      }
      req.payload = payload
      next()
    })
  },
}
