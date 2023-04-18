import { cannotEnrollBeforeStartDateError, notFoundError } from '@/errors';
import paymentRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPayment(ticketId: number, userId: number) {
  if (!ticketId) throw cannotEnrollBeforeStartDateError();

  const ticketIdExist = await ticketsRepository.getTicketTypeById(ticketId);
  console.log(ticketIdExist);
  if (!ticketIdExist) throw notFoundError();

  const payment = await paymentRepository.getPaymentByTicketId(ticketId);
  return payment;
}

const paymentsService = { getPayment };

export default paymentsService;
