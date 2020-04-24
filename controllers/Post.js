module.exports = (models) => {

  async function getPosts(req, res, next) {

    let limit = req.query.limit || 20;

    try {

      // query posts
      let posts = await models.Posts.findAll(
        {
          where: { published: true },
          limit,
          order: [[ 'createdAt', 'DESC' ]],
          include: [ { model: models.Comments, include: [ { model: models.Comments, as: 'replies' } ] } ]
        }
      );

      // verify that there is posts
      if (!posts)
        throw new Error('No posts were found');

      res.send( { posts } );

    } catch (err) {
      console.log(err);
      res.send('Cannot get posts');
    }

  }

  async function getPostBySlug (req, res, next) {

    let slug = req.params.slug;

    try {

      let post = await models.Posts.findOne(
        { where: { slug } }
      );

      // verify that there is posts
      if (!post)
        throw new Error('No post was found');

      res.send( { post } );

    } catch (err) {
      console.log(err);
      res.send('Cannot get post');
    }

  }

  async function createPost(req, res, next) {

    // verify authorization and authentication
    if (req.isAuthenticated && req.isAuthorized) {

      // extracting keys from req body
      let {title, content, summary, category, published} = req.body;
      let slug, publishedAt = undefined;

      // verify title and content are not empty
      if (!title || !content)
        res.status(422).send({ msg: 'Missing required data' });
      else {

        // creating slug from title
        slug = title.toLowerCase().replace(/ /g, "-");
        // setting publishing date if it was published
        if (published)
          publishedAt = Date.now();

        try {

          let post = await models.Posts.create(
            {
              author: req.user.username,
              slug,
              title,
              content,
              summary,
              category,
              published,
              publishedAt
            }
          );

          res.send({post: post.toJSON()});

        } catch (err) {
          console.log(err);
          res.status(422).send({ msg: 'cannot create post' });
        }

      }

    } else {
      res.send('You are not authorized for this action');
    }

  }

  async function updatePost(req, res, next) {

    // verify authorization and authentication
    if (req.isAuthenticated && req.isAuthorized) {

      // destructing keys
      let { title, content, summary, published } = req.body;
      let slug = req.query.slug;

      try {

        // verify slug is not empty
        if (!slug)
          throw new Error('No slug specified');

        let update = await models.Posts.update(
          {
            title,content, summary, published
          }, { where: { slug } }
        );
        let post_db;

        // check if title changed
        if (title) {
          update = await models.Posts.update(
            { slug: title.toLowerCase().replace(/ /g, "-") },
            { where: { slug } }
          );
          post_db = await models.Posts.findOne({ where: { title } });
        } else
          post_db = await models.Posts.findOne({ where: { title } });

        if (update > 0)
          res.send({ post: post_db });
        else
          res.status(403).send({ msg: 'no update was made' });

      } catch (err) {
        console.log(err);
        console.log(err);
        res.send({ msg: 'Cannot update post' });
      }

    } else {
      res.send('You are not authorized for this action');
    }

  }

  async function deletePost(req, res, next) {

    // verify authorization and authentication
    if (req.isAuthenticated && req.isAuthorized) {

      let slug = req.query.slug;

      try {

        let post_db = await models.Posts.findOne({ where: { slug } });
        let del = await models.Posts.destroy({ where: { slug } });

        if (del > 0)
          res.send({ post:  post_db });
        else
          res.send({msg: 'no deletion was made'});

      } catch (err) {
        console.log(err);
        res.send('Cannot delete post');
      }

    } else {
      res.send('You are not authorized for this action');
    }

  }

  return { getPostBySlug, getPosts, createPost, updatePost, deletePost };

}
