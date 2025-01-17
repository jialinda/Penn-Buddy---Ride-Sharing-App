/* eslint-disable consistent-return */
/* eslint-disable no-console */
/**
 * GET method test module
 */
const request = require('supertest');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../DbOperations');
const webapp = require('../server');
// import ObjectID

// import test utilities function
const {
  testUser, insertTestDataToDB, deleteTestDataFromDB, deleteGroupTestDataFromDB,
  deleteChatTestDataFromDB, testGroup, testChatroom,
} = require('./testUtils');

let mongo;
let db;
// leep track of id of test user
let testUserID;
let testGroupID;
let testChatroomID;

/**
     *  Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
beforeEach(async () => {
  mongo = await connect();
  db = mongo.db();
  // add test user to mongodb
  testUserID = await insertTestDataToDB(db, testUser, 'user');
  testGroupID = await insertTestDataToDB(db, testGroup, 'group');
  testChatroomID = await insertTestDataToDB(db, testChatroom, 'Chatroom');
  // console.log('testGroupID', testGroupID);
});

/**
 * Delete all test data from the DB
 * Close all open connections
 */
afterEach(async () => {
  await deleteTestDataFromDB(db, 'testUser', 'user');
  await deleteGroupTestDataFromDB(db, 'testLocation', 'group');
  await deleteChatTestDataFromDB(db, [1, 2, 3], 'Chatroom');
  try {
    await mongo.close();
    await closeMongoDBConnection(); // mongo client started when running express.
  } catch (err) {
    return err;
  }
});

test('Endpoint response: status code, type and content', async () => {
  // successful deletion returns 200 status code
  const resp = await request(webapp).delete(`/group/${testGroupID}`);
  expect(resp.status).toEqual(200);
  expect(resp.type).toBe('application/json');
  // the user is not in the database
  const resp1 = await db.collection('group').findOne({ _id: new ObjectId(testGroupID) });
  expect(resp1).toBeNull();
});

test('DeleteUser - Endpoint response: status code, type and content', async () => {
  // successful deletion returns 200 status code
  const resp = await request(webapp).delete(`/user/${testUserID}`);
  expect(resp.status).toEqual(200);
  expect(resp.type).toBe('application/json');
  // the user is not in the database
  const resp1 = await db.collection('user').findOne({ _id: new ObjectId(testUserID) });
  expect(resp1).toBeNull();
});

test('DeleteChatroom - Endpoint response: status code, type and content', async () => {
  // successful deletion returns 200 status code
  const resp = await request(webapp).delete(`/Chatroom/${testChatroomID}`);
  console.log('test id for chat', testChatroomID);
  expect(resp.status).toEqual(200);
  expect(resp.type).toBe('application/json');
  // the user is not in the database
  const resp1 = await db.collection('Chatroom').findOne({ _id: new ObjectId(testChatroomID) });
  expect(resp1).toBeNull();
});
