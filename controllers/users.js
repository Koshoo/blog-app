const bcrypt = require('bcrypt-nodejs');
const router = require('express').Router();
const User = require('../models/user');

router.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    url: 1,
    likes: 1,
    author: 1
  });

  response.json(users.map((u) => u.toJSON()));
});

router.post('/', async (request, response) => {
  const { password, name, username } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).send({
      error: 'password must min length 3'
    });
  }

  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const user = new User({
    username,
    name,
    passwordHash,
    creationDate: new Date()
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = router;
