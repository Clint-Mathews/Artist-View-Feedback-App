const express = require('express');

const router = express.Router();
// const path = require('path');

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const speakers = await speakerService.getList();
      const speakersArtWork = await speakerService.getAllArtwork();
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        speakersArtWork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:speakerName', async (request, response, next) => {
    try {
      const speaker = await speakerService.getSpeaker(request.params.speakerName);
      const speakersArtWork = await speakerService.getArtworkForSpeaker(request.params.speakerName);
      return response.render('layout', {
        pageTitle: 'Speaker Details',
        template: 'speakerDetail',
        speaker,
        speakersArtWork,
      });
    } catch (err) {
      return next(err);
    }
  });
  return router;
};
