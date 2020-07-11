import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('User', () => {
  // apago todos os dados antes de rodar cada um dos testes.
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    // nao crio nada na db somente pego os atributos aleatorios
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create user with duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });
  it('shound encrypt user password when new user created', async () => {
    // coloco os dados criados no factory e subitituo o pasword pq comparo esse estaticamente
    const user = await factory.create('User', {
      password: '123456',
    });
    const compareHash = await bcrypt.compare('123456', user.password_hash);
    expect(compareHash).toBe(true);
  });
});
