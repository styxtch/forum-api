import AddThreadUseCase from '../AddThreadUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const owner = 'user-123';

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = vi.fn(() => Promise.resolve(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner,
    })));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      expect.objectContaining({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
      owner,
    );
  });
});
