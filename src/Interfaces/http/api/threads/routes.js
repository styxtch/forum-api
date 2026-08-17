import express from 'express';
import authenticate from '../../../../Infrastructures/http/middlewares/authenticate.js';

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.post('/', authenticate, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadHandler);

  router.post('/:threadId/comments', authenticate, handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authenticate, handler.deleteCommentHandler);

  router.post('/:threadId/comments/:commentId/replies', authenticate, handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authenticate, handler.deleteReplyHandler);

  router.put('/:threadId/comments/:commentId/likes', authenticate, handler.putLikeHandler);

  return router;
};

export default createThreadsRouter;
