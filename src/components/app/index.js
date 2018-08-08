import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Places from "../places"
import Index from "../front"
import End from "../end"

const App = () => (<Router>
    <div>
      <Route exact ="/" component={Index} />
      <Route path="/app/" component={Index} />
      <Route path="/app/places" component={Places} />
      <Route path="/app/end" component={End} />
    </div>
  </Router>
)

export default App
