class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(threadId, commentId);

    const isLiked = await this._commentLikeRepository.verifyLikeAvailability(commentId, owner);

    if (isLiked) {
      await this._commentLikeRepository.deleteLike(commentId, owner);
    } else {
      await this._commentLikeRepository.addLike(commentId, owner);
    }
  }
}

export default LikeCommentUseCase;
