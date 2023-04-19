import hotelsRepository from '@/repositories/hotels-repository';

async function getHotels() {
  return await hotelsRepository.getHotels();
}

async function getHotelById(id: number) {
  return;
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;
