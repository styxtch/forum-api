import DeleteReplyUseCase from '../DeleteReplyUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyAvailability = vi.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = vi.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = vi.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(threadId, commentId, replyId, owner);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(threadId, commentId);
    expect(mockReplyRepository.verifyReplyAvailability).toHaveBeenCalledWith(commentId, replyId);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(replyId, owner);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(replyId);
  });
});
