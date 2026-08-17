import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentLikeRepository from '../../../Domains/comments/CommentLikeRepository.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const threadId = 'thread-123';

    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        // eslint-disable-next-line camelcase
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'comment yang dihapus',
        // eslint-disable-next-line camelcase
        is_delete: true,
      },
    ];

    const mockReplies = {
      'comment-123': [
        {
          id: 'reply-123',
          content: 'sebuah balasan',
          date: '2021-08-08T08:07:01.522Z',
          username: 'dicoding',
          // eslint-disable-next-line camelcase
          is_delete: false,
        },
        {
          id: 'reply-456',
          content: 'balasan yang dihapus',
          date: '2021-08-08T07:59:48.766Z',
          username: 'johndoe',
          // eslint-disable-next-line camelcase
          is_delete: true,
        },
      ],
      'comment-456': [],
    };

    const mockLikeCounts = {
      'comment-123': 2,
      'comment-456': 0,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.getThreadById = vi.fn(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentId = vi.fn((commentId) => Promise.resolve(mockReplies[commentId]));
    mockCommentLikeRepository.getLikeCountByCommentId = vi.fn(
      (commentId) => Promise.resolve(mockLikeCounts[commentId]),
    );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-456');

    expect(threadDetail.id).toEqual(mockThread.id);
    expect(threadDetail.title).toEqual(mockThread.title);
    expect(threadDetail.body).toEqual(mockThread.body);
    expect(threadDetail.date).toEqual(mockThread.date);
    expect(threadDetail.username).toEqual(mockThread.username);
    expect(threadDetail.comments).toHaveLength(2);

    expect(threadDetail.comments[0].content).toEqual('sebuah comment');
    expect(threadDetail.comments[1].content).toEqual('**komentar telah dihapus**');
    expect(threadDetail.comments[0].likeCount).toEqual(2);
    expect(threadDetail.comments[1].likeCount).toEqual(0);

    expect(threadDetail.comments[0].replies).toHaveLength(2);
    expect(threadDetail.comments[0].replies[0].content).toEqual('sebuah balasan');
    expect(threadDetail.comments[0].replies[1].content).toEqual('**balasan telah dihapus**');
  });
});
