import { TicketType } from '@prisma/client';
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

async function getTicketsTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function getTicketTypeById(id: number) {
  return await prisma.ticketType.findUnique({
    where: {
      id: id,
    },
  });
}

async function createTicket(ticket: { ticketTypeId: number; enrollmentId: number }) {
  return await prisma.ticket.create({
    data: {
      ...ticket,
      status: 'RESERVED',
    },
  });
}

const ticketsRepository = { getAllTicketsByEnrollmentId, getTicketsTypes, createTicket, getTicketTypeById };

export default ticketsRepository;
