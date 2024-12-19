const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentsRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkCommentAvailability(commentId, threadId) {
    const query = {
      text: 'SELECT id, is_delete, thread FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (result.rows[0].is_delete) {
      throw new NotFoundError('komentar tidak valid');
    }

    if (result.rows[0].thread !== threadId) {
      throw new NotFoundError('komentar dalam thread tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('tidak dapat akses');
    }
  }

  async addComment(userId, threadId, newComment) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, threadId, userId, isDelete, date, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.id, users.username, comments.created_at as date, comments.content, comments.is_delete FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.thread = $1 ORDER BY comments.created_at ASC',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteCommentById(id) {
    const date = new Date().toISOString();
    const query = {
      text: 'UPDATE comments SET is_delete = true, updated_at = $1 WHERE id = $2',
      values: [date, id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
