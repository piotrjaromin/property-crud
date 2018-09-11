import React from 'react';
import 'normalize.css';

require('../node_modules/bootstrap/dist/css/bootstrap.min.css');

import "styles/base/_main.sass"  // Global styles
import "styles/base/_common.sass"  // Global styles

const Row = require('react-bootstrap').Row;
const Jumbotron = require('react-bootstrap').Jumbotron;

const CreateProperty = require('./components/CreateProperty');
const PropertiesList = require('./components/PropertiesList');

class App extends React.Component {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
  }


  refresh() {
    this.list.refreshList();
  }

  render() {
    return <div className='App container'>

      <Jumbotron>
        <Row><h2>Create new property: </h2></Row>
        <CreateProperty refresh={this.refresh} />
      </Jumbotron>

      <Jumbotron>
        <Row><h2>List of all properties:</h2></Row>
        <PropertiesList ref={instance => { this.list = instance; }} />
      </Jumbotron>
    </div>
  }
}

module.exports = App;
