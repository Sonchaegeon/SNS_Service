const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
  Post.findAll({
      include: {
          model: User,
          attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
  })
  .then((posts) => {
      res.render('main', {
          title: 'NodeBird',
          twits: posts,
          user: req.user,
          loginError: req.flash('loginError'),
      });
  })
  .catch((error) => {
      console.error(error);
      next(error);
  });
});

module.exports = router;

module.exports = router;