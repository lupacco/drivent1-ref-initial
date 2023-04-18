import { prisma } from '@/config';

async function getAllTickets() {
  return await prisma.ticket.findMany({
    include: {
      TicketType: true,
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

const ticketsRepository = { getAllTickets, getTicketsTypes, createTicket };

export default ticketsRepository;
