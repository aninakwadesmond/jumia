const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const PasswordComplexity = require('joi-password-complexity');
const Joi = require('joi');

const complexity = { min: 5, max: 1024, numeric: 1, requirementCount: 1 };

function validateAccount(req) {
  const schema = Joi.object({
    email: Joi.string().min(10).max(255).email().required(),
    name: Joi.string().min(5).max(200).required().trim(),
    password: PasswordComplexity(complexity).required(),
    // Joi.string().min(5).max(1024).pattern(/[0-9]/, 'numbers').required(),
    image: Joi.string(),
  }).unknown(true);

  return schema.validate(req);
}

const schemaAccount = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 200,
    required: true,
    index: true,
  },
  email: {
    type: String,
    minlength: 10,
    maxlength: 255,
    required: true,
    index: true,
    unique: true,
  },
  password: { type: String, minlength: 5, maxlength: 1024, required: true },
  image: { type: String },
  isAdmin: { type: Boolean, default: false },
});

schemaAccount.methods.getAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAmin }, 'jwtKey');
  return token;
};

const AccountRegister = mongoose.model('AccountRegistered', schemaAccount);

module.exports = { validateAccount, AccountRegister };
