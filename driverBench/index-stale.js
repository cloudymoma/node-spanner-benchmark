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
    await new Promise(done => setTimeout(done, 100));
}

function singlePut(done) {
  this.doc = simulateData();
  return this.table.insert(this.doc, done);
}

function queryByUsername(done) {
  const query = {
    sql: `SELECT uuid, username, mobilePhone, nicknameHashed, email FROM User@{FORCE_INDEX=UserByName}
            WHERE username = @myusername`,
    params: {
      myusername: this.doc.username,
    },
  };
  const options = {
    exactStaleness: 50
  };

  return this.db.getSnapshot(options, async (err, transaction) => {
	  if(err) {console.error(err);}
	  await transaction.run(query,done);
          });
}


const benchmarkRunner = new Runner({minExecutionCount : 111})
  .suite('testBench', suite =>
    suite
      .benchmark('queryByUsername', benchmark =>
        benchmark
          .taskSize(1)
          .setup(makeClient)
          .setup(connectInstance)
          .setup(initDb)
          .setup(initTable)
          .beforeTask(singlePut)
          .task(singlePut)
          .task(queryByUsername)
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

