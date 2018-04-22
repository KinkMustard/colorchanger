import React from "react";
import { render } from "react-dom";
import io from "socket.io-client";
import registerServiceWorker from "./registerServiceWorker";
import ColorController from "./components/colors/ColorController";

class App extends React.Component {
  render() {
    return <ColorController />;
  }
}

const rootElement = document.querySelector("#root");
if (rootElement) {
  render(<App />, rootElement);
}
registerServiceWorker();
