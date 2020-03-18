import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import "./App.css";

const socket = io("http://localhost:8000");

const App = () => {
  const [clientStatus, setClientStatus] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    socket.on("CLIENT_READY", () => setClientStatus(true));
    socket.on("CLIENT_CLOSE", () => setClientStatus(false));
    socket.on("CLIENT_CLOSE", () => setClientStatus(false));
    socket.on("OFFLINE", status => setOffline(status));
  });

  return (
    <>
      {!clientStatus ? (
        <h2>Waiting for League Client to start...</h2>
      ) : (
        <div id="wrapper" className={!offline ? "offline" : ""}>
          <div id="container" onClick={() => socket.emit("OFFLINE", !offline)}>
            <div id="spooky">
              <div id="body">
                <div id="eyes"></div>
                <div id="mouth"></div>
                <div id="feet">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
            <div id="shadow"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
