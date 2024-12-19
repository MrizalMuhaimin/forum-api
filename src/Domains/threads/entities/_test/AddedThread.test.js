const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      owner: 'abc',
    };
  
    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-djkahjk',
      title: 123,
      owner: 'abc',
    };
  
    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  
  
  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      id: 'thread-djkahjk',
      owner: 'user-Indonesia',
    };
  
    // Action
    const { id , title, owner } = new AddedThread(payload);
  
    // Assert
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
    expect(id).toEqual(payload.id);
  });
});