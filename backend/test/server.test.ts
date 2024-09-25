import { server } from './../src/server';
import { test } from 'tap';
import Prisma from '../src/db';
// "test": "jest --testPathPattern=test/",

test('Create a new entry', async (t) => {

  // Delete entry with id 1 if it exists
  await Prisma.entry.deleteMany({ where: { id: '1' } });

  const response = await server.inject({
    method: 'POST',
    url: '/create/',
    payload: {
      id: '1',
      title: 'Test Entry',
      description: 'This is a test entry',
      created_at: new Date('2024-09-23'),
      scheduled_at: new Date('2024-10-23')
    },
  });

  const body = JSON.parse(response.body);
  t.equal(body.title, 'Test Entry', 'Title should match');
  t.end();
});

test('Get all entries', async (t) => {
  const response = await server.inject({
    method: 'GET',
    url: '/get/', 
  });

  t.equal(response.statusCode, 200, 'Should return status 200');
  const entries = JSON.parse(response.body);
  t.ok(Array.isArray(entries), 'Response should be an array');
  t.end();
});

test('Get specific entry', async (t) => {
  const response = await server.inject({
    method: 'GET',
    url: '/get/1', 
  });

  t.equal(response.statusCode, 200, 'Should return status 200');
  const entry = JSON.parse(response.body);
  t.equal(entry.title, 'Test Entry', 'Title should match');
  t.end();
});

test('Update entry', async (t) => {
  const response = await server.inject({
    method: 'PUT',
    url: '/update/1',
    payload: {
      title: 'Updated Test Entry',
      description: 'This is an updated test entry',
      created_at: new Date('2024-09-21'),
      scheduled_at: new Date('2024-10-29')
    }, 
  });

  t.equal(response.statusCode, 200, 'Should return status 200');
  const entry = JSON.parse(response.body);

  t.equal(entry.msg, 'Updated successfully', 'Message should match');

  const getResponse = await server.inject({
    method: 'GET',
    url: '/get/1',
  });

  const updatedEntry = JSON.parse(getResponse.body);

  t.equal(updatedEntry.title, 'Updated Test Entry', 'Title should match');
  t.equal(updatedEntry.description, 'This is an updated test entry', 'Description should match');
  t.equal(updatedEntry.created_at, '2024-09-21T00:00:00.000Z', 'Created at should match');
  t.equal(updatedEntry.scheduled_at, '2024-10-29T00:00:00.000Z', 'Scheduled at should match');

  t.end();
});

test('Delete entry', async (t) => {
  const response = await server.inject({
    method: 'DELETE',
    url: '/delete/1', 
  });

  t.equal(response.statusCode, 200, 'Should return status 200');
  const body = JSON.parse(response.body);
  t.equal(body.msg, 'Deleted successfully', 'Message should match');
  t.end();
});

test('Get entry that doesnt exist', async (t) => {
  const response = await server.inject({
    method: 'GET',
    url: '/get/1', 
  });

  t.equal(response.statusCode, 500, 'Should return status 500');
  const body = JSON.parse(response.body);
  t.equal(body.msg, 'Error finding entry with id 1', 'Message should match');
  t.end();
});