const autocannon = require("autocannon");
const { get } = require("mongoose");
require("dotenv").config();

function startBench() {
  const url = "http://localhost:3000";
  const args = process.argv.slice(2);
  const numConnections = args[0] || 1000;
  const maxConnectionRequests = args[1] || 1000;

  const instance = autocannon(
    {
      url,
      connections: numConnections,
      duration: 10,
      maxConnectionRequests,
      headers: {
        "content-type": "application/json",
      },
      requests: [
        {
          method: "GET",
          path: "/",
        },
      ],
    },
    finishedBench
  );

  autocannon.track(instance);

  function finishedBench(err, res) {
    if (err) {
      console.log("Error: ", err);
    }
    console.log("Finished Bench ", res);
  }
}

startBench();
