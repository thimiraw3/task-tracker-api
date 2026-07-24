jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

describe('Health check', () => {
  it('returns 200 and ok status when DB is reachable', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('returns 503 when DB is unreachable', async () => {
    pool.query.mockRejectedValueOnce(new Error('connection refused'));
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(503);
  });
});

describe('Tasks CRUD', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('GET /tasks returns a list of tasks', async () => {
    const fakeTasks = [{ id: 1, title: 'Write tests', completed: false }];
    pool.query.mockResolvedValueOnce({ rows: fakeTasks });
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeTasks);
  });

  it('POST /tasks creates a task', async () => {
    const newTask = { id: 1, title: 'Learn Docker', description: null, completed: false };
    pool.query.mockResolvedValueOnce({ rows: [newTask] });
    const res = await request(app).post('/tasks').send({ title: 'Learn Docker' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(newTask);
  });

  it('POST /tasks without a title returns 400', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('GET /tasks/:id returns 404 when not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/tasks/999');
    expect(res.statusCode).toBe(404);
  });

  it('DELETE /tasks/:id returns 204 on success', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const res = await request(app).delete('/tasks/1');
    expect(res.statusCode).toBe(204);
  });
});