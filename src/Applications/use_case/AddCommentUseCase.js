import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    await this._threadRepository.verifyThreadAvailability(threadId);

    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addComment(newComment, threadId, owner);
  }
}

export default AddCommentUseCase;
