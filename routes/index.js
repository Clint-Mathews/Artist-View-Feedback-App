const express = require('express');
const speakerRoute = require('./speaker');
const feedbackRoute = require('./feedback');

const router = express.Router();
// const path = require('path');

module.exports = (params) => {
  const { speakerService } = params;
  router.get('/', async (request, response, next) => {
    try {
      const topSpeakers = await speakerService.getList();
      // Visit Counter implementation using session
      // if (!request.session.visitcount) {
      //   request.session.visitcount = 0;
      // }
      // request.session.visitcount += 1;
      // console.log(`No of visits : ${request.session.visitcount}`);
      // response.sendFile(path.join(__dirname, './static/index.html'));
      // Checks views/pages/index file
      return response.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers });
    } catch (err) {
      return next(err);
    }
  });

  // router.get('/speakers', (request, response) => {
  //   response.sendFile(path.join(__dirname, './static/speakers.html'));
  // });
  router.use('/speakers', speakerRoute(params));
  router.use('/feedback', feedbackRoute(params));
  return router;
};
