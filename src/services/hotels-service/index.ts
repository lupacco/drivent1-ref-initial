import { notFoundError } from '@/errors';
import { paymentRequiredError } from '@/errors/payment-required-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const ticketType = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId);
  if (ticketType.isRemote) throw paymentRequiredError(); // Error can be more specific
  if (!ticketType.includesHotel) throw paymentRequiredError();

  const hotels = await hotelsRepository.getHotels();

  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const ticketType = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId);
  if (ticketType.isRemote) throw paymentRequiredError(); // Error can be more specific
  if (!ticketType.includesHotel) throw paymentRequiredError();

  const hotel = await hotelsRepository.getHotelById(hotelId);

  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;
