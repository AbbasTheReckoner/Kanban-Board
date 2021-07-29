import React from 'react'
import {Route, Switch} from 'react-router-dom'
import KanbanBoardApp from './components/KanbanBoardApp'
import LoginForm from './components/LoginForm'
import NotFound from './components/NotFound'

import './App.css'

const App=()=>(
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <Route exact path="/" component={KanbanBoardApp} />
    <Route component={NotFound} />
  </Switch>
)

export default App
