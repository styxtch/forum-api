import LikeCommentUseCase from '../LikeCommentUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import CommentLikeRepository from '../../../Domains/comments/CommentLikeRepository.js';

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like action correctly when comment is not liked yet', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockCommentLikeRepository.verifyLikeAvailability = vi.fn(() => Promise.resolve(false));
    mockCommentLikeRepository.addLike = vi.fn(() => Promise.resolve());
    mockCommentLikeRepository.deleteLike = vi.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await likeCommentUseCase.execute(threadId, commentId, owner);

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(threadId, commentId);
    expect(mockCommentLikeRepository.verifyLikeAvailability).toHaveBeenCalledWith(commentId, owner);
    expect(mockCommentLikeRepository.addLike).toHaveBeenCalledWith(commentId, owner);
    expect(mockCommentLikeRepository.deleteLike).not.toHaveBeenCalled();
  });

  it('should orchestrating the unlike action correctly when comment is already liked', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockCommentLikeRepository.verifyLikeAvailability = vi.fn(() => Promise.resolve(true));
    mockCommentLikeRepository.addLike = vi.fn(() => Promise.resolve());
    mockCommentLikeRepository.deleteLike = vi.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await likeCommentUseCase.execute(threadId, commentId, owner);

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(threadId, commentId);
    expect(mockCommentLikeRepository.verifyLikeAvailability).toHaveBeenCalledWith(commentId, owner);
    expect(mockCommentLikeRepository.deleteLike).toHaveBeenCalledWith(commentId, owner);
    expect(mockCommentLikeRepository.addLike).not.toHaveBeenCalled();
  });
});
