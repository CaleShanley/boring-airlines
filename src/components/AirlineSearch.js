import React, { Component } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3000/secrets.json' // update this once deployed

class AirlineSearch extends Component {
  contructor() {
    super();
    this.state = { flightdata: [] };
    this.fetchFlights = this.fetchFlights.bind(this);
  }

  const fetchFlights = () => {
    axios.get(SERVER_URL).then((results) => {
      // console.log(results.data);
      this.setState({flightdata: results.data});
      setTimeout(fetchFlights, 6000); // recursion - calls itself after 6 seconds
    });
  }

  fetchFlights();

  saveFlight(content) {
    axios.post(SERVER_URL, {content: content}).then((result) => {
      // console.log( result.data ); // the server responds with the new secret object.
      this.setState({flightdata: [...this.state.flightdata, result.data]}) // adds the new secret to the collection of secrets in our state.
    });
  }

  render() {
    return (
      <div>
        <h2>Secrets coming soon</h2>
        <SecretForm onSubmit={ this.saveFlight } />
        <Gallery secrets={ this.state.secrets } />
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
    this.setState({content: event.target.value})
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
  console.log( props.secrets ); // we should see secret objects in the console
  return (
    <div>
      { props.secrets.map( (s) => <p key={s.id}>{s.content}</p>)}
    </div>
  )
}

}

export default AirlineSearch
