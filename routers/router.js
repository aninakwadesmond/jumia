const _ = require('lodash');
require('dotenv').config();
require('express-async-errors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { Router } = require('express');
const {
  User,
  validateOtp,
  validateAccountPassword,
} = require('../models/user');
const { AccountRegister, validateAccount } = require('../models/account');
const { validateAccountEmail } = require('../models/user');
const router = Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: 'vwya vzfj tvzk xdvh' },
});
function generateOtp() {
  // ensures leading zeros are possible
  return String(Math.floor(1000 + Math.random() * 9000));
}

router.post('/registered', async (req, res, next) => {
  const { error } = validateAccountEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await AccountRegister.findOne({ email: req.body.email });
  if (!user) return res.status(403).json('Account is not  Rsgistered');

  return res.status(200).json({ success: true, message: 'registered' });
});
router.post('/', async (req, res, next) => {
  console.log(req.body);
  const { error } = validateAccountPassword(req.body);
  // console.log(error.details[0].message);
  if (error) return res.status(400).send(error.details[0].message);
  console.log('incoming data: ', req.body);

  try {
    const otp = generateOtp();
    const salt = await bcrypt.genSalt(10);
    const otpHashed = await bcrypt.hash(otp, salt);
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);

    const { email, password } = req.body;
    const user = new User({
      email,
      password,
      otpHashed,
      expireAt,
    });

    try {
      await user.save();
    } catch (err) {
      console.log(err);
      for (field in err.errors) {
        res.send(err.errors[field].message);
      }
    }

    //send to
    const mailOptions = {
      from: `Jumia by ${process.env.EMAIL_USER}`,
      to: email,
      subject: 'OTP CODE',
      html: `<p>Your OTP CODE is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    };
    try {
      console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
      await transporter.sendMail(mailOptions);
    } catch (err) {
      return res.status(500).send(err);
    }

    return res
      .status(200)
      .send({ success: true, message: 'OTP send to your email' });
  } catch (error) {
    return res.status(500).send('server error');
  }
});

router.post('/verify', async (req, res, next) => {
  const { error } = validateOtp(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { email, otp } = req.body;

  const record = await User.findOne({ email }).sort({ createdAt: -1 });
  if (!record) return res.status(401).send('Invalid otp or outdated');

  const user = await AccountRegister.findOne({ email });

  const match = await bcrypt.compare(otp, record.otpHashed);
  console.log('verify2', match);
  if (!match) return res.status(401).send('Incorrect OTP code');
  try {
    const remove = await User.deleteMany({ email }, { new: true });
    console.log(remove);
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).send('Could not delete data');
  }
});

router.post('/create', async (req, res, next) => {
  console.log(' incoming data: ', req.body);
  const { error } = validateAccount(req.body);

  if (error) return res.status(400).json(error.details[0].message);

  const user = await AccountRegister.findOne({ email: req.body.email });
  if (user) return res.status(403).json('Account already Rsgistered');
  console.log(user, 'pass2');

  const token = user?.getAuthToken();

  try {
    const user = await AccountRegister.create(
      _.pick(req.body, ['name', 'email', 'password', 'image'])
    );
    res.status(200).header('x-auth-token', token).json(user);
  } catch (error) {
    res.status(500).json('Faileed to save to db:', error.errors);
  }
});

module.exports = router;
