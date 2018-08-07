import React from "react"
import { Route } from "react-router-dom"
import Places from "../places"
import Index from "../index"
import End from "../end"

const App = () => (<div>
    <Route path="/app/places" component={Places} />
    <Route path="/app/index" component={Index} />
    <Route path="/app/end" component={End} />
  </div>
)

export default App
