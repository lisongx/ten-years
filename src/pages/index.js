import React from "react"
import { MemoryRouter as Router, Route, Link, Location } from "react-router-dom"
import Places from "./places"
import Front from "./front"
import End from "./end"
import NotFound from "./404"
import { withRouter} from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import "./main.css"

const history = createBrowserHistory()

history.listen((location, action) => {
  window.scrollTo(0, 0);
});

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
