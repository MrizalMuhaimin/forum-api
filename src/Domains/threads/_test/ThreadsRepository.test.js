const ThreadsRepository = require('../ThreadsRepository');

describe('ThreadsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadsRepository = new ThreadsRepository();

    // Action and Assert
    await expect(threadsRepository.addThread({})).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadsRepository.getThreadById('')).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadsRepository.checkThreadAvailability('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
