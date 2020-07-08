import React, { Component } from 'react';
import axios from 'axios';
import NavbarApp from './NavbarApp.jsx';
import UserPage from './UserPage.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const SERVER_URL = 'http://boring-airline.herokuapp.com/flights.json' // update this once deployed

class AirlineSearch extends Component {
  constructor() {
    super();
    this.state = {
      flightdata: [],
      currentUser: '',  // TO UPDATE AFTER USER SIGN IN
      galleryShow: true,
      userShow: true, // DEFAULT FALSE, WILL BE ACCESSIBLE AFTER THE USER HAS SIGNED IN - THIS IS LINKED with TURNERY TO THE USER PAGE
      origins: [],
      destinations: []
    };

    const fetchFlights = () => {
      axios.get(SERVER_URL).then((results) => {
        // console.log(results.data);
        this.setState({ flightdata: results.data });
        setTimeout(fetchFlights, 6000); // recursion - calls itself after 6 seconds
      }).then(() => {
        this.getOrigins();
        this.getDestinations();
      });
    };

    fetchFlights();

    this.saveFlight = this.saveFlight.bind(this);
    this.getOrigins = this.getOrigins.bind(this);
    this.getDestinations = this.getDestinations.bind(this);

    this.getOrigins();
    this.getDestinations();
  }

  getOrigins () {
    let list = [];
    this.state.flightdata.map((flight) => {
      list.push(flight.fromto.slice(0,3));
    });
    let unique = [...new Set(list)];
    list = Array.from(unique);
    this.setState({origins: list});
  }

  getDestinations () {
    let list = [];
    this.state.flightdata.map((flight) => {
      list.push(flight.fromto.slice(7,10));
    });
    let unique = [...new Set(list)];
    list = Array.from(unique);
    this.setState({destinations: list});
  }

  saveFlight(content) {
    axios.post(SERVER_URL, { content: content }).then((result) => {
      // console.log( result.data ); // the server responds with the new secret object.
      this.setState({ flightdata: [...this.state.flightdata, result.data] }); // adds the new secret to the collection of secrets in our state.
    });
  }


  ///////////////// DISPLAYYYYY //////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <div>
        <NavbarApp galleryShow={this.state.galleryShow} userShow={this.state.userShow} />
        <h2>Secrets coming soon</h2>
        <SecretForm onSubmit={ this.saveFlight } />
        {this.state.galleryShow ? <Gallery flightdata={ this.state.flightdata } origins={this.state.origins} destinations={this.state.destinations}/> : ''}
        {this.state.userShow? <UserPage currentUser={ this.state.currentUser }/> : ''} 
      </div>
    );
  }
}


class SecretForm extends Component {
  constructor() {
    super();
    this.state = { content: '' };
    this._handleChange = this._handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleChange(event) {
    // console.log( event.target.value );
    this.setState({ content: event.target.value });
  }

  _handleSubmit(event) {
    event.preventDefault();
    // call a function for our parent class.
    this.props.onSubmit(this.state.content); // sends back to parent class
    this.setState({ content: '' })// once parent is called, set state back to an empty string so user doesn't have to manually delete the text area
  }

  render() {
    return (
      <form onSubmit={this._handleSubmit}>
        <textarea value={this.state.content} onChange={this._handleChange} />
        <input type="submit" value="Tell" />
      </form>
    );
  }
}



class Gallery extends Component {


  return () {
    <div class="dropdown">
      <Form onSubmit={this._handleSubmit}>
      <select id="origin" name="origin">
        {props.origins.map((flight) =>
          <option value={flight}>{flight}</option>
        )}
      </select>
      >>
      <select name="dest" id="dest">
        {props.destinations.map((flight) =>
          <option value={flight}>{flight}</option>
        )}
      </select>
          <br></br>
      <Button variant="primary" type="submit">
        Search
      </Button>

      </Form>
    </div >
    
    };
};


export default AirlineSearch
