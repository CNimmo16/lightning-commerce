const mongoose = require('mongoose');
const sodium = require('sodium').api;

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    displayName: String,
    isRoot: {
        type: Boolean,
        default: false
    },
    permissions: Array
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    const passwordBuffer = Buffer.from(password)
    return sodium.crypto_pwhash_argon2i_str(
                    passwordBuffer,
                    sodium.crypto_pwhash_argon2i_OPSLIMIT_INTERACTIVE,
                    sodium.crypto_pwhash_argon2i_MEMLIMIT_INTERACTIVE);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    const buffer1 = Buffer.from(password)
    const buffer2 = Buffer.from(this.password)
    return sodium.crypto_pwhash_argon2i_str_verify(buffer2, buffer1)
};

module.exports = mongoose.model('User', userSchema);