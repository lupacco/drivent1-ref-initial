import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getTicketsTypes() {
  return await ticketsRepository.getTicketsTypes();
}

async function getAllTickets(userId: number) {
  const { id: enrollmentId } = await enrollmentRepository.findEnrollmentByUserId(userId);
}

const ticketsService = { getAllTickets, getTicketsTypes };

export default ticketsService;
