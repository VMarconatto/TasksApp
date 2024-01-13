const Users = require('../model/user.js')
const mongoose = require('mongoose')
const express = require('express')

const routeuser = express.Router()
const auth = require('../middleware/auth.js')
const multer = require('multer')

const sharp = require('sharp')
const sendWelcomeEmail = require('../emails/account.js')


routeuser.post('/Usuarios', async (req, res) => {
    const user = new Users(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        //const token = user.generateAuthToken()
        res.status(200).send(user)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

routeuser.post('/Usuarios/Login', async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        console.log({ user, token })
        res.send({ user, token })
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

routeuser.post('/Usuarios/Logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokens) => {
            return tokens.token !== req.token
        })
        await req.user.save()
        res.send(200)
    }
    catch (e) {
        res.status(500, e)
        console.log(e)
    }
})

routeuser.post('/Usuarios/LogoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(200)
    }
    catch (e) {
        res.status(500, e)
        console.log(e)
    }
})

routeuser.get('/Usuarios/me', auth, async (req, res) => {
    res.send(req.user)
})

routeuser.patch('/Usuarios/me', auth, async (req, res) => {

    const updates = Object.keys((req.body))
    const allowedUpdates = ['name', 'email', 'password', 'age', 'professionalposition']
    const isValidOperation = updates.every((update) => {
        allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send('Invalid Updates')
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        console.log(req.user)
        res.send(req.user)
        return

    } catch (e) {
        res.status(500).send(e)
    }
})

routeuser.delete('/Usuarios/me', auth, async (req, res) => {
    try {
        const user = req.user

        if (!user) {
            return res.status(404).send()
        }
        await Users.deleteOne(user)
        res.send(user)

    } catch (e) {
        res.status(500).send()
    }

})

const upload = multer({
    limits: {
        fileSize: 30000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return (cb(new Error('Please, Upload PDF File')))
        }
        cb(undefined, true)
    }
})

routeuser.post('/Usuarios/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

routeuser.delete('/Usuarios/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

routeuser.get('/Usuarios/:id/avatar', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        if (!user || user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch (e) {
        res.status(404).send(e)
    }
})


module.exports = routeuser