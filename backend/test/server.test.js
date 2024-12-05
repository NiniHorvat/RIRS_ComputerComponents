// Uvozimo potrebna orodja za testiranje
const request = require('supertest'); // za testiranje HTTP zahtev
const chai = require('chai'); // za preverjanje rezultatov
const expect = chai.expect;
const app = require('../server'); // predpostavljamo, da imate datoteko server.js

const postRes = await request(app).post('/components').send(newComponent);
const componentId = postRes.body._id; // dobimo ID komponenta

// Sedaj jo pošljemo za izbris
const deleteRes = await request(app).delete(`/components/${componentId}`);
expect(deleteRes.status).to.equal(200);
expect(deleteRes.body.message).to.equal('Komponenta uspešno izbrisana!');


test('DELETE /components/:id with invalid ID should return error', async () => {
    const response = await request(app).delete('/components/invalid-id');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Komponenta z tem ID-jem ni bila najdena!');
  });