import { prisma } from '@/config';

export async function createRoom(hotelId: number) {
  return await prisma.room.create({
    data: {
      name: 'Room Name',
      capacity: 4,
      hotelId: hotelId,
    },
  });
}
