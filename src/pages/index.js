import React from "react"
import { Route, Location } from "react-router-dom"
import { MemoryRouter as Router} from 'react-router'
import Places from "../components/places"
import Front from "../components/front"
import End from "../components/end"
import NotFound from "./404"
import { withRouter} from 'react-router'
import { createMemoryHistory } from 'history'

import "./main.css"

const history = createMemoryHistory()

const App = () => (
  <div>
    <Router history={history}>
      <div>
          <Route exact path="/" component={Front}/>
          <Route path="/places" component={Places} />
          <Route path="/end" component={End} />
      </div>
    </Router>
  </div>
)

export default App
