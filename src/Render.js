import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import Home from './pages/Home/Home'

function Render() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
    </Router>
  );
}

export default Render;
