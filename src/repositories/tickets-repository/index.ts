import { prisma } from '@/config';

async function getAllTicketsByEnrollmentId(id: number) {
  return await prisma.ticket.findMany({
    include: {
      TicketType: true,
    },
    where: {
      enrollmentId: id,
    },
  });
}

async function getTicketsTypes() {
  return await prisma.ticketType.findMany();
}

async function createTicket(ticket: { ticketTypeId: number; enrollmentId: number }) {
  return await prisma.ticket.create({
    data: {
      ...ticket,
      status: 'RESERVED',
    },
  });
}

const ticketsRepository = { getAllTicketsByEnrollmentId, getTicketsTypes, createTicket };

export default ticketsRepository;
