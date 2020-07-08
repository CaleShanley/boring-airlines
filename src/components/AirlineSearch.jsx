import React, { Component } from 'react';
import axios from 'axios';
import NavbarApp from './NavbarApp.jsx';

const SERVER_URL = 'http://boring-airline.herokuapp.com/flights.json' // update this once deployed

class AirlineSearch extends Component {
  constructor() {
    super();
    this.state = {
      flightdata: [],
      galleryShow: true
    };

    const fetchFlights = () => {
      axios.get(SERVER_URL).then((results) => {
        // console.log(results.data);
        this.setState({flightdata: results.data});
        setTimeout(fetchFlights, 6000); // recursion - calls itself after 6 seconds
      });
    };

    fetchFlights();

    this.saveFlight = this.saveFlight.bind(this);
  }

  saveFlight(content) {
    axios.post(SERVER_URL, {content: content}).then((result) => {
      // console.log( result.data ); // the server responds with the new secret object.
      this.setState({flightdata: [...this.state.flightdata, result.data]}); // adds the new secret to the collection of secrets in our state.
    });
  }


  ///////////////// DISPLAYYYYY //////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <div>
        <NavbarApp />
        <h2>Secrets coming soon</h2>
        <SecretForm onSubmit={ this.saveFlight } />
        {this.state.galleryShow ? <Gallery flightdata={ this.state.flightdata }/> : ''}
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
    this.setState({content: event.target.value});
  }

  _handleSubmit(event) {
    event.preventDefault();
    // call a function for our parent class.
    this.props.onSubmit(this.state.content); // sends back to parent class
    this.setState({content: ''})// once parent is called, set state back to an empty string so user doesn't have to manually delete the text area
  }

  render() {
    return (
      <form onSubmit={ this._handleSubmit }>
        <textarea value={ this.state.content } onChange={ this._handleChange }/>
        <input type="submit" value="Tell" />
      </form>
    );
  }
}

const Gallery = (props) => {
  console.log( props.flightdata ); // we should see secret objects in the console
  return (
    <div>
      { props.flightdata.map( (s) => <p key={s.id}>{s.fromto}</p>)}
    </div>
  );
};


export default AirlineSearch
