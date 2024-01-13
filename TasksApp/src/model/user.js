const mongoose = require('mongoose')
const Task = require('./task.js')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validade(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot congan password')
            }
        }
    },
    age: {
        type: String,
        required: true,
        default: 0,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('The Age must be greather then 0')
            }
        }
    },
    professionalposition: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: false
        }
    }],
    avatar: {
        type: Buffer
    }

}, { timestamps: true })

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'

})

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'viagemviagem')
    console.log(token)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await Users.findOne({ email })

    if (!user) {
        throw new Error('Credentials is not exist!' + 'Unable to login!')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

UserSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user tasks when user is removed   
UserSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const Users = mongoose.model('Users', UserSchema)

module.exports = Users
