import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {
  // create user and ticket
  it('creates a user and a ticket (201)', async () => {
    const user = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({ name: 'Alice', email: 'alice@example.com' });
    expect(user.status).toBe(201);
    expect(user.body.name).toBe('Alice');

    const ticket = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(user.body.id))
      .send({ title: 'First ticket' });
    expect(ticket.status).toBe(201);
    expect(ticket.body.creator_id).toBe(user.body.id);
  });

  // missing header
  it('returns 401 when X-User-Id is missing', async () => {
    const res = await request(app).post('/tickets').send({ title: 'No auth' });
    expect(res.status).toBe(401);
  });

  // not found
  it('returns 404 for missing user and ticket', async () => {
    expect((await request(app).get('/users/9999')).status).toBe(404);
    expect((await request(app).get('/tickets/9999')).status).toBe(404);
  });

  // pagination
  it('paginates GET /tickets', async () => {
    const user = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({ name: 'Bob', email: 'bob@example.com' });

    for (const title of ['T1', 'T2', 'T3']) {
      await request(app)
        .post('/tickets')
        .set('X-User-Id', String(user.body.id))
        .send({ title });
    }

    const res = await request(app).get('/tickets?limit=2&offset=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toBe('T2');
  });
});
