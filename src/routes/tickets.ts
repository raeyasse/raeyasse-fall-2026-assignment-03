import { Router } from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
} from '../dal/tickets.js';
import authMiddleware from '../middleware/auth.js';
import { insertTimeLog, getTotalHoursForTicket } from '../dal/timeLogs.js';

const router = Router();

// TODO: Student implementation - Part 1: Ticket Routes
// GET /tickets
// GET /tickets/:id
// POST /tickets
// PATCH /tickets/:id/status

// GET
router.get('/', async (req, res) => {
  const { limit, offset, status } = req.query;
  const tickets = await getAllTickets({
    limit: limit !== undefined ? Number(limit) : undefined,
    offset: offset !== undefined ? Number(offset) : undefined,
    status: typeof status === 'string' ? status : undefined,
  });
  res.json(tickets);
});

// GET /tickets/:id
router.get('/:id', async (req, res) => {
  const ticket = await getTicketById(Number(req.params.id));
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  res.json(ticket);
});

// POST /tickets
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const ticket = await createTicket({
    title,
    description,
    creator_id: res.locals.userId,
  });
  res.status(201).json(ticket);
});

// PATCH /tickets/:id/status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: 'status is required' });
    return;
  }
  const ticket = await updateTicketStatus(Number(req.params.id), status);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  res.json(ticket);
});

// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
// GET /tickets/:id/time

// log hours on a ticket
router.post('/:id/time', authMiddleware, async (req, res) => {
  const ticketId = Number(req.params.id);
  const { hours } = req.body;
  if (typeof hours !== 'number' || hours <= 0) {
    res.status(400).json({ error: 'hours must be a positive number' });
    return;
  }
  if (!(await getTicketById(ticketId))) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  const log = await insertTimeLog(ticketId, res.locals.userId, hours);
  res.status(201).json(log);
});

// total hours on a ticket
router.get('/:id/time', async (req, res) => {
  const ticketId = Number(req.params.id);
  const total = await getTotalHoursForTicket(ticketId);
  res.json({ ticket_id: ticketId, total_hours: total });
});

export default router;
