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

async function getTicketById(id: number) {
  return await prisma.ticket.findUnique({
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

async function payTicketById(ticketId: number) {
  return await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
}

const ticketsRepository = {
  getAllTicketsByEnrollmentId,
  getTicketsTypes,
  createTicket,
  getTicketTypeById,
  getTicketById,
  payTicketById,
};

export default ticketsRepository;
