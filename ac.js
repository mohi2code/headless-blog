const AccessControl = require('accesscontrol');

const ac = new AccessControl();

ac
.grant('public')
  .readAny('post')
  .createAny('comment')
  .readAny('comment')
  .updateOwn('comment')
  .deleteOwn('comment')

.grant('author')
  .extend('public')
  .createAny('post')
  .updateOwn('post')
  .deleteOwn('post')

.grant('admin')
  .extend('author')
  .updateAny('post')
  .deleteAny('post')
  .deleteAny('comment');


module.exports = ac;
