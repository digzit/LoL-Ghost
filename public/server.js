const io = require("socket.io")();
const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const got = require("got");
const port = 8000;

try {
  io.listen(port);
  console.log("listening on port ", port);

  io.on("connection", socket => {
    console.log("client is subscribing to LCUConnector");

    connector
      .on("connect", data => {
        console.log("LeagueClient found !");
        socket.emit("CLIENT_READY");
        const { address, port, username, password } = data;
        const authorization = Buffer.from(`${username}:${password}`).toString(
          "base64"
        );

        socket.on("OFFLINE", status => {
          console.log("OFFLINE", status);

          got
            .put(`https://${address}:${port}/lol-chat/v1/me`, {
              headers: {
                Authorization: "Basic " + authorization
              },
              rejectUnauthorized: false,
              body: JSON.stringify({
                availability: status ? "offline" : "online"
              })
            })
            .catch(err => {
              console.log(err.toString());
            })
            .then(ok => socket.emit("OFFLINE", status));
        });
      })
      .on("disconnect", data => {
        console.log(data);
        socket.emit("CLIENT_CLOSE");
      })
      .start();
  });
} catch (e) {
  console.error(e);
}
