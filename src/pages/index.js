import React from "react"
import { Router, Link, Location } from "@reach/router"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import Places from "./places"
import Front from "./front"
import End from "../components/end"

import "./main.css"


const App = () => (
  <div>
    <FadeTransitionRouter>
      <Front path="/" />
      <Places path="/places" />
      <Places path="/places/:index" />
      <End path="/end" />
      <Front path="/*" />
    </FadeTransitionRouter>
  </div>
)

const FadeTransitionRouter = props => (
    <Location>
      {({ location }) => (
        <Router location={location} className="router">
            {props.children}
        </Router>
      )}
    </Location>
  )

export default App
