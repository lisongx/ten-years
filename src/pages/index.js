import React from "react"
import { Route, Location } from "react-router-dom"
import { MemoryRouter as Router} from 'react-router'
import Places from "../components/places"
import Front from "../components/front"
import End from "../components/end"

import "./main.css"

const App = () => (
  <div>
    <Router>
      <div>
          <Route path="/places" component={Places} />
          <Route path="/end" component={End} />
          <Route exact path="/" component={Front}/>
      </div>
    </Router>
  </div>
)

export default App
