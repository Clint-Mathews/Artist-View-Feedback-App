const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const FeedBackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedBackService = new FeedBackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');
const app = express();
const port = 3000;

// If we deploy this application to a web server that runs behind a reverse proxy like nginx, then the whole cookie system maynot work since we need to add
// This makes express trust cookies passed through a reverse proxy [Might fail]
app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

// Use body parser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set render engine as ejs
app.set('view engine', 'ejs');
// Set common views path
app.set('views', path.join(__dirname, './views'));
// Global Data
app.locals.siteName = 'ROUX Meetups';
app.use(express.static(path.join(__dirname, './static')));
// Setting a global value to be used in any template and layout
// Thorw from an async invocation will crash the app.
// setTimeout(() => {
//   throw new Error('Error');
// }, 500);
// app.get(`/throw`, (request, response, next) => {
//   setTimeout(() => {
//     return next(new Error('Error'));
//   }, 500);
// });

app.use(async (request, response, next) => {
  try {
    const names = await speakerService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});
app.use('/', routes({ feedBackService, speakerService }));

app.use((request, response, next) => {
  return next(createError(404, 'Not Found'));
});

// Error handling middleware
app.use((error, request, response, next) => {
  response.locals.message = error.message;
  console.log(error);
  const status = error.status || 500;
  response.locals.status = status;
  // Status on http respose
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`Express server listining in ${port}`);
});
