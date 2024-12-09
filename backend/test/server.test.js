require('dotenv').config(); // Naloži okoljske spremenljivke iz .env datoteke

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');  // Povezava na vašo aplikacijo
const Component = require('../models/Component'); 

// Povezava z ločeno testno bazo
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Povezava z MongoDB je bila uspešna!');
  } catch (error) {
    console.error('Napaka pri povezavi z MongoDB:', error);
  }
});


beforeEach(async () => {
  await Component.deleteMany({}); // Počisti zbirko pred vsakim testom
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /components', () => {
  it('should return all components', async () => {
    await request(app).post('/components').send({
      userName: 'testUser1',
      componentName: 'Graphics Card',
      price: 200,
    });

    await request(app).post('/components').send({
      userName: 'testUser2',
      componentName: 'Processor',
      price: 300,
    });

    const response = await request(app).get('/components');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2); // Zdaj bo dolžina pravilna
    expect(response.body[0]).toHaveProperty('userName', 'testUser1');
    expect(response.body[1]).toHaveProperty('componentName', 'Processor');
  });
});


//za post 
describe('Invalid Endpoint', () => {
  it('should return 404 for an invalid endpoint', async () => {
    const res = await request(app).get('/api/invalid-endpoint');
    expect(res.statusCode).toBe(404);
  });
});

it('should create a new component', async () => {
  const res = await request(app).post('/components').send({
    userName: 'testUser',
    componentName: 'Graphics Card',
    price: 500,
  });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('userName', 'testUser');
  expect(res.body).toHaveProperty('componentName', 'Graphics Card');
  expect(res.body).toHaveProperty('price', 500);
});

//delete TEST 

it('should delete a component', async () => {
  // Najprej dodamo komponento za testiranje
  const component = await request(app).post('/components').send({
    userName: 'testUser',
    componentName: 'Graphics Card',
    price: 500,
  });

  // Izbrišemo komponento
  const res = await request(app).delete('/components/user/testUser');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('userName', 'testUser');
  expect(res.body).toHaveProperty('componentName', 'Graphics Card');
  expect(res.body).toHaveProperty('price', 500);
});

//neuspešno posodabljanje 
it('should return an error when trying to update a non-existing component', async () => {
  const res = await request(app).put('/components/user/nonExistingUser').send({
    componentName: 'Updated Graphics Card',
    price: 550,
  });

  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty('error', 'Komponenta za tega uporabnika ni bila najdena.');
});

//neuspešno brisanje
it('should return an error when trying to delete a non-existing component', async () => {
  const res = await request(app).delete('/components/user/nonExistingUser');

  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty('error', 'Komponenta za tega uporabnika ni bila najdena.');
});

//POST MANJKAJOČI PODATKI 
it('should return an error for missing data in POST request', async () => {
  const res = await request(app).post('/components').send({
    userName: 'testUser',
    price: 500, // Manjka 'componentName'
  });

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('error', 'Manjkajoči podatki!');
});

//test za uporabnika ki ne obstaja 
it('should return an error for non-existing user', async () => {
  const res = await request(app).get('/components/user/nonExistingUser');

  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty('error', 'Komponenta za tega uporabnika ni bila najdena.');
});

//test za delete brez obstoječe komponente 
it('should return an error when trying to delete a non-existing component', async () => {
  const res = await request(app).delete('/components/user/nonExistingUser');

  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty('error', 'Komponenta za tega uporabnika ni bila najdena.');
});

// test za neuspešno post zahtevo 
it('should return an error for missing data in POST request', async () => {
  const res = await request(app).post('/components').send({
    userName: 'testUser',
    price: 500, // Manjka 'componentName'
  });

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('error', 'Manjkajoči podatki!');
});
