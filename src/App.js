import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Major from "./major";

function App() {
  return (
    <Router>
      <div>
        <Major />
      </div>
      <div>{/* <p>hello world</p> */}</div>
    </Router>
  );
}

export default App;
