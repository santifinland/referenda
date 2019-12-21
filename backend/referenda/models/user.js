const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const User = new Schema({
    username: String,
    mail: String,
    password: String,
    origin: String,
    admin:   {
        type: Boolean,
        default: false,
    },
    delegatedUser: {
        type: String,
        default: null,
    },
    delegatedParty: {
        type: String,
        default: null,
    }
});

User.methods.getName = function() {
    return (this.username);
};

const options = {"errorMessages": {
    "MissingPasswordError": 'No has proporcionado ninguna contraseña.',
    "AttemptTooSoonError": 'Cuenta actualmente bloqueada. Por favor, prueba más tarde.',
    "TooManyAttemptsError": 'Cuenta bloqueada debido a demasiados intentos de inicio de sesión.',
    "NoSaltValueStoredError": 'Autenticación no posible.',
    "IncorrectPasswordError": 'Contraseña o nombre de usuario incorrectos.',
    "IncorrectUsernameError": 'Contraseña o nombre de usuario incorrectos.',
    "MissingUsernameError": 'No has proporcionado nombre de usuario.',
    "UserExistsError": 'Un usuario ya está registrado con el mismo nombre.'}
};

User.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('User', User);