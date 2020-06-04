'use strict';

const SpannerBench = require('../spannerBench');

const Runner = SpannerBench.Runner;
const commonHelpers = require('./common');

const makeClient = commonHelpers.makeClient;
const connectInstance = commonHelpers.connectInstance;
const initDb = commonHelpers.initDb;
const closeDb = commonHelpers.closeDb;
const initTable = commonHelpers.initTable;
const simulateData = commonHelpers.simulateData;

function average(arr) {
  return arr.reduce((x, y) => x + y, 0) / arr.length;
}

async function timer(){ 
    //console.log("wait for 100ms"); 
    await new Promise(done => setTimeout(done, 100));
}

function singlePut(done) {
  this.doc = simulateData();
  return this.table.insert(this.doc, done);
}

function queryByUuid(done) {
  const query = {
    sql: `SELECT uuid, username, mobilePhone, nicknameHashed, email FROM User
            WHERE uuid = @myuuid`,
    params: {
      myuuid: this.doc.uuid,
    },
  };
  
  //return this.db.run(query,done);
  return this.db.getSnapshot(async (err, transaction) => {
	  if(err) {console.error(err);}
	  await transaction.run(query,done);
          });
} 

function queryByMobile(done) {
  const query = {
    sql: `SELECT uuid, username, mobilePhone, nicknameHashed, email FROM User@{FORCE_INDEX=UserByPhone}
            WHERE mobilePhone = @myphone`,
    params: {
      myphone: this.doc.mobilePhone,
    },
  };

  return this.db.getSnapshot(async (err, transaction) => {
	  if(err) {console.error(err);}
	  await transaction.run(query,done);
          });
}

function queryByUsername(done) {
  const query = {
    sql: `SELECT uuid, username, mobilePhone, nicknameHashed, email FROM User@{FORCE_INDEX=UserByName}
            WHERE username = @myusername`,
    params: {
      myusername: this.doc.username,
    },
  };

  return this.db.getSnapshot(async (err, transaction) => {
	  if(err) {console.error(err);}
	  await transaction.run(query,done);
          });
}

function queryByNick(done) {
  const query = {
    sql: `SELECT uuid, username, mobilePhone, nicknameHashed, email FROM User@{FORCE_INDEX=UserByNick}
            WHERE nicknameHashed = @mynick`,
    params: {
      mynick: this.doc.nicknameHashed,
    },
  };

  return this.db.getSnapshot(async (err, transaction) => {
	  if(err) {console.error(err);}
	  await transaction.run(query,done);
          });

}

function queryByEmail(done) {
  const query = {
    sql: `SELECT uuid, username, mobilePhone, nicknameHashed, email FROM User@{FORCE_INDEX=UserByEmail}
            WHERE email = @myemail`,
    params: {
      myemail: this.doc.email,
    },
  };

  return this.db.getSnapshot(async (err, transaction) => {
	  if(err) {console.error(err);}
	  await transaction.run(query,done)
          });

}

const benchmarkRunner = new Runner({minExecutionCount : 100})
  .suite('testBench', suite =>
    suite
      .benchmark('singlePut', benchmark =>
        benchmark
         .taskSize(1)
         .setup(makeClient)
         .setup(connectInstance)
         .setup(initDb)
         .setup(initTable)
         .task(singlePut)
         .teardown(closeDb)
      )
      .benchmark('queryByUuid', benchmark =>
        benchmark
         .taskSize(1)
         .setup(makeClient)
         .setup(connectInstance)
         .setup(initDb)
         .setup(initTable)
         .beforeTask(singlePut)
         .task(queryByUuid)
         .teardown(closeDb)
      )
      .benchmark('queryByMobile', benchmark =>
        benchmark
          .taskSize(1)
          .setup(makeClient)
          .setup(connectInstance)
          .setup(initDb)
          .setup(initTable)
          .beforeTask(singlePut)
          .task(queryByMobile)
          .teardown(closeDb)
      )
      .benchmark('queryByUsername', benchmark =>
        benchmark
          .taskSize(1)
          .setup(makeClient)
          .setup(connectInstance)
          .setup(initDb)
          .setup(initTable)
          .beforeTask(singlePut)
          .task(queryByUsername)
          .teardown(closeDb)
      )
      .benchmark('queryByNick', benchmark =>
        benchmark
          .taskSize(1)
          .setup(makeClient)
          .setup(connectInstance)
          .setup(initDb)
          .setup(initTable)
          .beforeTask(singlePut)
          .task(queryByNick)
          .teardown(closeDb)
      )
      .benchmark('queryByEmail', benchmark =>
        benchmark
          .taskSize(1)
          .setup(makeClient)
          .setup(connectInstance)
          .setup(initDb)
          .setup(initTable)
          .beforeTask(singlePut)
          .task(queryByEmail)
          .teardown(closeDb)
      )
  );

  benchmarkRunner
  .run()
  .then(microBench => {
    
    const multiBench = average(Object.values(microBench.testBench));
    console.log(microBench.testBench);
    return {
      multiBench
    };
  })
  .then(data => console.log(data))
  .catch(err => console.error(err));

