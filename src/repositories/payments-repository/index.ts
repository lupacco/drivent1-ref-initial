import { prisma } from '@/config';

async function getPaymentByTicketId(ticketId: number) {
  const payment = await prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
  return payment;
}

const paymentRepository = { getPaymentByTicketId };

export default paymentRepository;
