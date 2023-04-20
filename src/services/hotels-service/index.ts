import { notFoundError } from '@/errors';
import { paymentRequiredError } from '@/errors/payment-required-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getHotels() {
  return await hotelsRepository.getHotels();
}

async function getHotelById(hotelId: number, userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const hotel = await hotelsRepository.getHotelById(hotelId);

  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;
