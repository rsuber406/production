const mongoose  = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type:String,
        required: true
    },
    lastName: {
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    editing: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


userSchema.pre('save', function(next){
    const user = this
    if(!user.isModified('password')){
        return next()
    }
    else bcrypt.hash(user.password, 10, (err,hash)=>{
        if(err){
            return next(err)
        }
        user.password = hash
        next()
    })
})

userSchema.methods.checkPassword = function(passwordAttempt, callback){
    console.log('checkpass fired')
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch)=>{
        if(err){
            return callback(err)

        }
        return callback(null, isMatch)
    })
}

userSchema.methods.withoutPassword = function (){
    const user = this.toObject()
    delete user.password
    delete user.username
    return user
}

module.exports = mongoose.model('Authuser', userSchema)

