class GetThreadDetailUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        const likeCount = await this._commentLikeRepository.getLikeCountByCommentId(comment.id);

        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          likeCount,
          replies: replies.map((reply) => ({
            id: reply.id,
            content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
            date: reply.date,
            username: reply.username,
          })),
        };
      }),
    );

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: commentsWithReplies,
    };
  }
}

export default GetThreadDetailUseCase;
