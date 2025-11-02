const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const { default: mongoose } = require('mongoose');

const complexity = {
  min: 5,
  max: 50,
  // lowerCase: 1,
  // upperCase: 1,
  // numeric: 1,
  // symbol: 1,
  // requirementCount: 0,
};

function validateAccountEmail(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    // password: PasswordComplexity(complexity),
  });
  return schema.validate(req);
}
function validateAccountPassword(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: PasswordComplexity(complexity),
  });
  return schema.validate(req);
}

function validateOtp(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    otp: Joi.number().required(),
  });
  return schema.validate(req);
}

const schemaAccount = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    required: true,
    index: true,
    maxlength: 255,
  },
  // password: {
  //   type: String,
  //   minlength: 8,
  //   maxlength: 1024,
  //   required: true,
  // },
  otpHashed: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  expireAt: { type: Date, required: true },
});

//remove from doc after expiry
schemaAccount.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.model('User', schemaAccount);

module.exports = {
  validateAccountEmail,
  User,
  validateOtp,
  validateAccountPassword,
};
