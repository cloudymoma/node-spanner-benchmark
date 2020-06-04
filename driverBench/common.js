'use strict';

const {Spanner} = require('@google-cloud/spanner');
const projectId = 'your-project-id';
const instanceId = 'your-instance-id';
const databaseId = 'your-database-id';
const tableName = 'User';

function makeClient() {
  this.client = new Spanner({
    projectId: projectId,
  });
}

function connectInstance() {
  this.instance = this.client.instance(instanceId);
}

function initDb() {
  this.db = this.instance.database(databaseId);
}

function closeDb() {
  this.db.close;
}

function initTable() {
  this.table = this.db.table(tableName);
}

//Generate md5 value
function cryptString(mystring) {
  const crypto = require('crypto');
  let md5 = crypto.createHash('md5');
  return md5.update(mystring).digest('hex');
}

//Generate random BOOL value
function randomBool() {
  return Math.random() >= 0.5;
}

//Generate random doc
function simulateData(){

  const faker = require('faker');
  const randomize = require('randomatic');

  let mydisabled = randomBool();
  let myemail = faker.internet.email();
  let myemailVerified = randomBool();
  let mylastChangePwdTime = new Date();
  let mylastLoginTime = new Date();
  let mylastSecurityUpdate = new Date();
  let myloginStatusExpiredBefore = new Date();
  let mymobilePhone = faker.phone.phoneNumber().substr(0,16);
  let mymobilePhoneVerified = randomBool();
  let mynickname = faker.internet.userName().substr(0,16);
  let mynicknameHashed = cryptString(mynickname);
  let mynicknameVerified = randomBool();
  let mypasswordHahsed = cryptString(mymobilePhone);
  let mypolicyAcceptance = parseInt(randomize('?', 1, {chars: '012345'}));
  let mypromoted = randomBool();
  let myregisterFrom = parseInt(randomize('?', 1, {chars: '012345'}));
  let myregisterIp = faker.internet.ip();
  let myregisterTime = new Date();
  let myusername = myemail;
  let mysecret = cryptString(myusername);
  let mytag = "oasis-p-testing"
  let myuuid = randomize('0',15);

  let mydata = {
      disabled: mydisabled,
      email: myemail,
      emailVerified: myemailVerified,
      lastChangePwdTime: mylastChangePwdTime,
      lastLoginTime: mylastLoginTime,
      lastSecurityUpdate: mylastSecurityUpdate,
      loginStatusExpiredBefore: myloginStatusExpiredBefore,
      mobilePhone: mymobilePhone,
      mobilePhoneVerified: mymobilePhoneVerified,
      nickname: mynickname,
      nicknameHashed: mynicknameHashed,
      nicknameVerified: mynicknameVerified,
      passwordHashed: mypasswordHahsed,
      policyAcceptance: mypolicyAcceptance,
      promoted: mypromoted,
      registerFrom: myregisterFrom,
      registerIp: myregisterIp,
      registerTime: myregisterTime,
      secret: mysecret,
      tag: mytag,
      username: myusername,
      uuid: myuuid
  };
  return mydata;
}

module.exports = {
  makeClient,
  connectInstance,
  initDb,
  closeDb,
  initTable,
  cryptString,
  randomBool,
  simulateData
};
