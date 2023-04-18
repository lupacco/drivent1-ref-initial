import { prisma } from '@/config';

async function getPaymentByTicketId(ticketId: number) {
  const payment = await prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
  return payment;
}

async function createPayment(ticketId: number, value: number, cardIssuer: string, cardLastDigits: string) {
  const createdPayment = await prisma.payment.create({
    data: {
      ticketId: ticketId,
      value: value,
      cardIssuer: cardIssuer,
      cardLastDigits: cardLastDigits,
    },
  });

  return createdPayment;
}

const paymentRepository = { getPaymentByTicketId, createPayment };

export default paymentRepository;
