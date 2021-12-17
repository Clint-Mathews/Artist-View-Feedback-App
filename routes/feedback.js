const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
// const path = require('path');
const validations = [
  check('name').trim().isLength({ min: 3 }).escape().withMessage('Name is required'),
  check('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  check('title').trim().isLength({ min: 3 }).escape().withMessage('Title is required'),
  check('title').trim().isLength({ min: 5 }).escape().withMessage('Message is required'),
];
module.exports = (params) => {
  const { feedBackService } = params;
  router.get('/', async (request, response, next) => {
    try {
      const errors = request.session.feedback ? request.session.feedback.errors : false;
      const successMessage = request.session.feedback ? request.session.feedback.message : false;
      request.session.feedback = {};
      const feedBackData = await feedBackService.getList();
      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedBackData,
        errors,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', validations, async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        request.session.feedback = {
          errors: errors.array(),
        };
        return response.redirect('/feedback');
      }
      const { name, email, title, message } = request.body;
      await feedBackService.addEntry(name, email, title, message);
      request.session.feedback = {
        message: 'Thank you for your feedback',
      };
      return response.redirect('/feedback');
    } catch (error) {
      return next(error);
    }
  });

  router.post('/api', validations, async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.json({ errros: errors });
      }
      const { name, email, title, message } = request.body;
      await feedBackService.addEntry(name, email, title, message);
      const feedback = await feedBackService.getList();
      return response.json({ feedback, successMessage: 'Thankyou for the feedback' });
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
