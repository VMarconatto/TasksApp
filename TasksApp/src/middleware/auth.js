
const User = require('../model/user.js')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    console.log('Chamou o auth')
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'viagemviagem')
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
        
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }
    catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }

}

module.exports = auth