# node-spanner-benchmark
By using benchmark.js, create the benchmark testing on Cloud Spanner.

## Create the Node.js enviroment

You could choose [nvm](https://github.com/nvm-sh/nvm) to install the Node.js.

## Codes structure

+ driverBench
   + common.js -> provides project/instance/database/
   + index0214.js -> main program
   + index-stale.js -> main program
+ package.json
+ spannerBench
   + benchmark.js
   + constants.js -> includes benchmark parameters such as execution time
   + index.js
   + runner.js -> contains time measure functions
   + suite.js
   + util.js

## Run the benchmark

+ Add your workload to the main program as a task;
+ Group mulitple tasks as a test suite.
+ Execute the benchmark

