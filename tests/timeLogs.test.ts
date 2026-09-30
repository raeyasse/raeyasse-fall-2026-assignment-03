import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 2: Time Logs Tests', () => {
  // sum of multiple time logs
  it('returns the correct total hours for a ticket', async () => {
    const user = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({ name: 'Alice', email: 'alice@example.com' });

    const ticket = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(user.body.id))
      .send({ title: 'Timed ticket' });

    for (const hours of [2, 3, 5]) {
      const res = await request(app)
        .post(`/tickets/${ticket.body.id}/time`)
        .set('X-User-Id', String(user.body.id))
        .send({ hours });
      expect(res.status).toBe(201);
    }

    const res = await request(app).get(`/tickets/${ticket.body.id}/time`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ticket_id: ticket.body.id, total_hours: 10 });
  });

  // no logs yet
  it('returns 0 when a ticket has no time logged', async () => {
    const user = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({ name: 'Bob', email: 'bob@example.com' });

    const ticket = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(user.body.id))
      .send({ title: 'Empty ticket' });

    const res = await request(app).get(`/tickets/${ticket.body.id}/time`);
    expect(res.body.total_hours).toBe(0);
  });
});
