import React from "react"
import { Route, Link, Location } from "react-router-dom"
import { MemoryRouter as Router} from 'react-router'
import Places from "./places"
import Front from "./front"
import End from "./end"
import NotFound from "./404"
import { withRouter} from 'react-router'
import { createMemoryHistory } from 'history'

import "./main.css"

const App = () => (
  <div>
    <Router>
      <div>
          <Route exact path="/" component={Front}/>
          <Route path="/places" component={Places} />
          <Route path="/end" component={End} />
      </div>
    </Router>
  </div>
)

export default App
