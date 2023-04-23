import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createRemoteTicketType, createTicket, createTicketType, createTicketTypeWithoutHotel, createUser } from '../factories';
import { createHotel } from '../factories/hotels-factory';
import { createRoom } from '../factories/room-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should return status 401 when token is not given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should return status 401 if token if invalid', async () => {
    const invalidToken = 'blablabla';

    const response = await server.get('/hotels').set('Authorization', invalidToken);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should return status 401 if token if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should return empty array if no Hotels were created already', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels').set('Authorization', `Beare ${token}`);

      expect(response.body).toEqual([]);
    });

    it('should return status 200 and with existing Hotels data', async () => {
      const token = await generateValidToken();
      await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Beare ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
      );
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should return status 401 when token is not given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should return status 401 if token if invalid', async () => {
    const invalidToken = 'blablabla';

    const response = await server.get('/hotels/1').set('Authorization', invalidToken);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should return status 401 if token if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should return status 400 when hotelId is missing', async () => {
      const token = await generateValidToken();
      const nullSimulation: null = undefined;

      const response = await server.get(`/hotels/${nullSimulation}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(400);
    });

    it('should return status 404 when hotelId do not exist', async () => {
      const token = await generateValidToken();

      const response = await server.get(`/hotels/9999999`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(404);
    });

    it('should return status 402 when ticket is not PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      const response = await server.get(`/hotels/${createdHotel.id}`).set('Authorization', `Beare ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should return status 402 when ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createRemoteTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      const response = await server.get(`/hotels/${createdHotel.id}`).set('Authorization', `Beare ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should return status 402 when ticketType do not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithoutHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      const response = await server.get(`/hotels/${createdHotel.id}`).set('Authorization', `Beare ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should return hotel with all rooms available when hotelId is given', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      const response = await server.get(`/hotels/${createdHotel.id}`).set('Authorization', `Beare ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Rooms: expect.arrayContaining([
          {
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
      });
    });
  });
});
