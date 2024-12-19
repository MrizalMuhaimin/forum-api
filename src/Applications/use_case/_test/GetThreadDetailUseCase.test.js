const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');

describe('GetThreadDetailUseCase', () => {
  it('should the response get thread detail action must correct', async () => {

    // Arrange
    const mockThreadDetail = {
      id: 'thread-123',
      title: 'A thread',
      body: 'A long thread',
      date: '2023-12-10T00:00:00.000Z',
      username: 'foobar',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: '2023-12-10T00:00:00.000Z',
        content: 'a comment',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'foobar',
        date: '2023-12-08T00:00:00.000Z',
        content: 'a deleted comment',
        is_delete: true,
      },
    ];


    /** creating dependency of use case */
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();

    /** mocking needed function */
    mockThreadsRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));
    mockCommentsRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadsRepository,
      commentRepository: mockCommentsRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    // Assert
    expect(threadDetail).toStrictEqual(new ThreadDetail({
      id: 'thread-123',
      title: 'A thread',
      body: 'A long thread',
      date: '2023-12-10T00:00:00.000Z',
      username: 'foobar',
      comments: [
        new CommentDetail({
          id: 'comment-1',
          username: 'johndoe',
          date: '2023-12-10T00:00:00.000Z',
          content: 'a comment',
        }),
        new CommentDetail({
          id: 'comment-2',
          username: 'foobar',
          date: '2023-12-08T00:00:00.000Z',
          content: '**komentar telah dihapus**',
        }),
      ],
    }));
    expect(mockThreadsRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentsRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
  });
});
