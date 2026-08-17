import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.js';

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const setupCommentOwner = async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  };

  describe('addLike function', () => {
    it('should persist new like correctly', async () => {
      await setupCommentOwner();
      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await commentLikeRepositoryPostgres.addLike('comment-123', 'user-123');

      const likes = await CommentLikesTableTestHelper.findLikesByCommentIdAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like correctly', async () => {
      await setupCommentOwner();
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      await commentLikeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      const likes = await CommentLikesTableTestHelper.findLikesByCommentIdAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('verifyLikeAvailability function', () => {
    it('should return false when comment is not liked yet', async () => {
      await setupCommentOwner();
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const isLiked = await commentLikeRepositoryPostgres.verifyLikeAvailability('comment-123', 'user-123');

      expect(isLiked).toEqual(false);
    });

    it('should return true when comment is already liked', async () => {
      await setupCommentOwner();
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const isLiked = await commentLikeRepositoryPostgres.verifyLikeAvailability('comment-123', 'user-123');

      expect(isLiked).toEqual(true);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return 0 when comment has no like', async () => {
      await setupCommentOwner();
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const likeCount = await commentLikeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      expect(likeCount).toEqual(0);
    });

    it('should return correct like count', async () => {
      await setupCommentOwner();
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-456', commentId: 'comment-123', owner: 'user-456' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const likeCount = await commentLikeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      expect(likeCount).toEqual(2);
    });
  });
});
