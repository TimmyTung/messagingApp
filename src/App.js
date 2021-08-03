import React from "react";
import "./App.css";
import MessageMenu from "./MessageMenu.js";
import Messages from "./Messages.js";

function App() {
  return (
    <div className="app">
      <MessageMenu />
      <Messages />
    </div>
  );
}

export default App;
