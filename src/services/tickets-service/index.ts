import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getTicketsTypes() {
  return await ticketsRepository.getTicketsTypes();
}

async function getAllTicketsFromUser(userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollment) throw notFoundError();

  const [result] = await ticketsRepository.getAllTicketsByEnrollmentId(enrollment.id);

  if (!result) throw notFoundError();

  return result;
}

async function createTicket(ticket: { ticketTypeId: number; userId: number }) {
  const { ticketTypeId, userId } = ticket;
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollment) throw notFoundError();

  const createdTicket = await ticketsRepository.createTicket({ ticketTypeId, enrollmentId: enrollment.id });
  const ticketType = await ticketsRepository.getTicketTypeById(ticketTypeId);

  const result = {
    id: createdTicket.id,
    status: createdTicket.status,
    ticketTypeId: createdTicket.ticketTypeId,
    enrollmentId: createdTicket.enrollmentId,
    TicketType: ticketType,
    createdAt: createdTicket.createdAt,
    updatedAt: createdTicket.updatedAt,
  };

  return result;
}

const ticketsService = { getTicketsTypes, getAllTicketsFromUser, createTicket };

export default ticketsService;
