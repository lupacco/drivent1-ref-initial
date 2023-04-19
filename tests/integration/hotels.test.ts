import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createUser } from '../factories';
import { createHotel } from '../factories/hotels-factory';
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
