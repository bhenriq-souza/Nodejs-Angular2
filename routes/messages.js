var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Message = require('../models/message');
var User = require('../models/user');

router.get('/', (req, res, next) => {
  Message.find()          // Why use the exec() method instead the 'callback function'? Answer in Section 6, Lecture 81.
         .populate('user', 'firstName') // mongoose method that allow to retrieve any addictional info from the 'getted' obj.
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

// With this route, we guarantee that no unauthenticaded user can request for any route below.
router.use('/', (req, res, next) => {
  jwt.verify(req.query.token, 'secret', (err, decoded) =>{
    if (err) {
      return res.status(401).json({
        title: 'Not authenticated',
        error: err
      });
    }
    next(); // continues with the request.
  })
});

router.post('/', ( req, res, next ) => {
    var _decoded = jwt.decode(req.query.token);
    User.findById(_decoded.user._id, (err, user) => {
      if ( err ) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
      }
      // Instantiates a message object of type 'Message' (see Message Model) as being the content field of the body request.
      var _msg = new Message({
          content: req.body.content,
          user: user
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

          // add the new message to the user's messages array and save it.
          user.messages.push(result);
          user.save();

          /*  in other way, returns a response with the 201 status.
              Note that there's no need of using the 'return' key word 'cause, if an error happens,
              the 'err' object will be null and the code compilation goes on.
              PS.: See the all http status and its usage.
           */
          res.status(201).json({
            message: 'Message saved',
            obj: result
          });
    });
  });
});

router.patch('/:id', (req, res, next) => {
  var _decoded = jwt.decode(req.query.token);
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
      if (message.user != _decoded.user._id){
          return res.status(401).json({
            title: 'Not authenticated',
            error: { message: 'Users do not match' }
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
  var _decoded = jwt.decode(req.query.token);
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
      if (message.user != _decoded.user._id){
          return res.status(401).json({
            title: 'Not authenticated',
            error: { message: 'Users do not match'}
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
