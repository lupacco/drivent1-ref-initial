import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPayment(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);

  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);

  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();

  const payment = await paymentRepository.getPaymentByTicketId(ticketId);

  return payment;
}

const paymentsService = { getPayment };

export default paymentsService;
