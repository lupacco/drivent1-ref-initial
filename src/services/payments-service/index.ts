import { notFoundError, unauthorizedError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { PaymentReq } from '@/schemas/payments-schemas';

async function getPayment(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);

  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);

  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();

  const payment = await paymentRepository.getPaymentByTicketId(ticketId);

  return payment;
}

async function processPayment(paymentReq: PaymentReq, userId: number) {
  if (!paymentReq.ticketId || !paymentReq.cardData) throw badRequestError();

  const ticket = await ticketsRepository.getTicketById(paymentReq.ticketId);

  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);

  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();

  const ticketType = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId);

  await ticketsRepository.payTicketById(ticket.id);

  const lastDigits = paymentReq.cardData.number.slice(-4);

  const newPayment = await paymentRepository.createPayment(
    paymentReq.ticketId,
    ticketType.price,
    paymentReq.cardData.issuer,
    lastDigits,
  );

  return newPayment;
}

const paymentsService = { getPayment, processPayment };

export default paymentsService;
