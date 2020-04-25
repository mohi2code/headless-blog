module.exports = (models) => {

  async function getCommentById (req, res, next) {

    let id = req.params.id;

    try {

      // query comment
      let comment = await models.Comments.findAll(
        { where: { id }, include:[models.Comments] }
      );

      // verify that there is comment
      if (!comment)
        throw new Error('No comment was found');

      res.send( { comment } );

    } catch (err) {
      console.log(err);
      res.send('Cannot get comment');
    }

  }

  async function getComments (req, res, next) {

    try {

      let postId = req.query.postId;
      if (!postId)
        throw new Error('no postId was specified');

      // query comments
      let comments = await models.Comments.findAll(
        { where: { postId }, order: [ [ 'createdAt', 'DESC' ]] }
      );

      // verify that there is comments
      if (!comments)
        throw new Error('No comments were found');

      res.send( { comments } );

    } catch (err) {
      console.log(err);
      res.send('Cannot get comments');
      return;
    }

  }

  async function createComment (req, res, next) {

    // verify authorization and authentication
    if (req.isAuthenticated && req.isAuthorized) {

      let { postId, parentId, content } = req.body;

      try {

        // verify that a post exists with postID
        if (postId) {
          let post_db = await models.Posts.findOne({ where: { id: postId } });
          if (!post_db)
            throw new Error('No Post Exists with postId ID');
        }

        // verify the parent comment if it exists and add the comment to it
        if (parentId) {
          let parent_db = await models.Comments.findOne({ where: { id: parentId } });
          if (!parent_db)
            throw new Error('No Parent Comment Exists with (parent) ID');
        }

        // insert comment in the database
        let comment = await models.Comments.create({
          username: req.user.username, postId, parentId, content
        });
        res.send({ comment });

      } catch (err) {
        console.log(err);
        res.send('cannot add comment');
      }

    } else {
      res.send('You are not authorized for this action');
    }

  }

  async function updateComment (req, res, next) {

    // verify authorization and authentication
    if (req.isAuthenticated && req.isAuthorized) {

      let { content } = req.body;
      let id = req.params.id;

      try {

        // verify that author of the comment
        let comment = await models.Comments.findOne({ where: { id } });
        if (comment.username !== req.user.username)
          throw new Error(`User: ${req.user.username} doesn't own the commment`);

        let update = await models.Comments.update(
          { content }, { where: { id } }
        );
        if (update > 0)
          res.send({ msg: `Comment with ID ${id} updated.` });
        else
          res.send({ msg: 'no update was made' });

      } catch (err) {
        console.log(err);
        res.send('Cannot update comment');
      }

    } else {
      res.send('You are not authorized for this action');
    }

  }

  async function deleteComment (req, res, next) {

    // verify authorization and authentication
    if (req.isAuthenticated && req.isAuthorized) {

      let id = req.params.id;

      try {

        let comment_db = await models.Comments.findOne({ where: { id } });

        // verify that the comment exists in the database
        if (!comment_db)
          throw new Error(`No Comment with ID ${id}`);

        // verify that author of the comment
        if (comment_db.username !== req.user.username)
          throw new Error(`User: ${req.user.username} doesn't own the commment`);

        let del = await models.Comments.destroy({ where: { id } });

        if (del > 0)
          res.send({ comment:  comment_db });
        else
          res.send({msg: 'no deletion was made'});

      } catch (err) {
          console.log(err);
          res.send('Cannot delete comment');
      }

    } else {
      res.send('You are not authorized for this action');
    }

  }

  return { getComments, getCommentById, createComment, updateComment, deleteComment };

}
