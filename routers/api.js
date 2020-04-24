const express = require('express');
const router = express.Router();

module.exports = (controllers) => {

  // user routes
  router.post('/users',
    controllers.User.authenticate,
    controllers.User.createUser
  );

  // post routes
  router.get('/posts/:slug', controllers.Post.getPostBySlug);
  router.get('/posts', controllers.Post.getPosts);
  router.post('/posts',
    controllers.User.authenticate,
    controllers.User.authorize({action: 'CA', rsc: 'post'}),
    controllers.Post.createPost
  );
  router.put('/posts',
    controllers.User.authenticate,
    controllers.User.authorize({action: 'UO', rsc: 'post'}),
    controllers.Post.updatePost
  );
  router.delete('/posts',
    controllers.User.authenticate,
    controllers.User.authorize({action: 'DO', rsc: 'post'}),
    controllers.Post.deletePost
  );

  // comments routes
  router.get('/comments', controllers.Comment.getComments);
  router.get('/comments/:id', controllers.Comment.getCommentById);
  router.post('/comments',
    controllers.User.authenticate,
    controllers.User.authorize({ action: 'CA', rsc: 'comment' }),
    controllers.Comment.createComment
  );
  router.put('/comments/:id',
    controllers.User.authenticate,
    controllers.User.authorize({ action: 'UO', rsc: 'comment' }),
    controllers.Comment.updateComment
  );
  router.delete('/comments/:id',
    controllers.User.authenticate,
    controllers.User.authorize({ action: 'DO', rsc: 'comment' }),
    controllers.Comment.deleteComment
  );

  return router;

}
