import { db, TimeLog } from '../db/database.js';

// insert a time log
export async function insertTimeLog(
  ticketId: number,
  userId: number,
  hours: number,
): Promise<TimeLog> {
  return await db
    .insertInto('time_logs')
    .values({ ticket_id: ticketId, user_id: userId, hours })
    .returningAll()
    .executeTakeFirstOrThrow();
}

// total hours for a ticket (summed in SQL)
export async function getTotalHoursForTicket(
  ticketId: number,
): Promise<number> {
  const result = await db
    .selectFrom('time_logs')
    .select((eb) => eb.fn.sum<string | number | null>('hours').as('total'))
    .where('ticket_id', '=', ticketId)
    .executeTakeFirst();

  return Number(result?.total ?? 0);
}
