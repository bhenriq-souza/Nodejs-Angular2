var express = require('express');
var router = express.Router();
var Message = require('../models/message');

router.get('/', (req, res, next) => {
  Message.find()          // Why use the exce() method instead the 'callback function'?
         .exec( (err, messages) => {
           if (err) {
               return res.status(500).json({
                   title: 'An error occurred',
                   error: err
               });
            }
            res.status(201).json({
              message: 'Success',
              obj: messages
            });
         });
});

router.post('/', ( req, res, next ) => {
    // Instantiates a message object of type 'Message' (see Message Model) as being the content field of the body request.
    var _msg = new Message({
        content: req.body.content
    });

    // tries to save the message, using mongoose and uses a 'callback function' to treat the result of the action.
    _msg.save( (err, result) => {
        /* if there is a error (err object will be send by mongoose), returns the 500 status as a JSON object.
           The message in JSON object is up to you. */
        if ( err ) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
        }
        /*  in other way, returns a response with the 201 status.
            Note that there's no need of using the 'return' key word 'cause, if an error happens,
            the 'err' object will be null and the code compilation goes on.
            PS.: See the all http status and its usage.
         */
        res.status(201).json({
          message: 'Message saved',
          obj: result
        });
    } );
});

router.patch('/:id', (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
      if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
      }
      if (!message) {
        return res.status(500).json({
            title: 'No message found',
            error: { message: 'Message not found' }
        });
      }

      message.content = req.body.content;
      message.save( (err, result) => {
        if ( err ) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
        }
        res.status(200).json({
          message: 'Message updated',
          obj: result
        });
      });
  });
});

router.delete('/:id', (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
      if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
      }
      if (!message) {
        return res.status(500).json({
            title: 'No message found',
            error: { message: 'Message not found' }
        });
      }
      message.remove( (err, result) => {
        if ( err ) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
        }
        res.status(200).json({
          message: 'Message deleted',
          obj: result
        });
      });
  });
});

module.exports = router;
