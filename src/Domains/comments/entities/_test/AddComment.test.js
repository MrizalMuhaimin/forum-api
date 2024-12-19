const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    // Arrange
    const payload = { content: 123 };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment entities correctly', () => {
    // Arrange
    const payload = { content: 'a comment' };

    // Action
    const newComment = new AddComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(AddComment);
    expect(newComment.content).toEqual(payload.content);
  });
});
