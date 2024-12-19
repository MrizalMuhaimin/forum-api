const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadsRepository = require('../../Domains/threads/ThreadsRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadsRepositoryPostgres extends ThreadsRepository {

  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, newThread) {
    const { title, body } = newThread;
    const id =`thread-${this._idGenerator()}`;
    const date = new Date().toISOString();


    const query = { 
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, userId, date, date],
    }

    const result = await this._pool.query(query);
    return new AddedThread(result.rows[0]);

  }

  async checkThreadAvailability(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.created_at::text as date, users.username FROM threads LEFT JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = ThreadsRepositoryPostgres;