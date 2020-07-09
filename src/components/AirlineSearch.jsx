import React, { Component } from 'react';
import axios from 'axios';
import NavbarApp from './NavbarApp.jsx';
import UserPage from './UserPage.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const SERVER_URL = 'http://boring-airline.herokuapp.com/flights.json' // update this once deployed
const SERVER_URL1 = 'http://boring-airline.herokuapp.com/airplanes.json' // update this once deployed

class AirlineSearch extends Component {
  constructor() {
    super();
    this.state = {
      flightdata: [],
      airplanedata: [],
      currentUser: '',  // TO UPDATE AFTER USER SIGN IN
      galleryShow: true,
      airplaneShow: true,
      userShow: true, // DEFAULT FALSE, WILL BE ACCESSIBLE AFTER THE USER HAS SIGNED IN - THIS IS LINKED with TURNERY TO THE USER PAGE
      origins: [],
      destinations: [],
      seats: [],
      airplaneId: ''
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

    const fetchAirplanes = () => {
      axios.get(SERVER_URL1).then((planes) => {
        // console.log('axios results', planes.data);
        this.setState({ airplanedata: planes.data });
        setTimeout(fetchAirplanes, 6000); // recursion - calls itself after 6 seconds
      }).then(() => {
        this.getAirplanes();
      });
    };

    fetchFlights();
    fetchAirplanes();

    this.saveFlight = this.saveFlight.bind(this);
    this.getOrigins = this.getOrigins.bind(this);
    this.getDestinations = this.getDestinations.bind(this);
    this.getAirplanes = this.getAirplanes.bind(this);
    this.galleryShow = this.galleryShow.bind(this);
    this.userShow = this.userShow.bind(this);
    this.findPlane = this.findPlane.bind(this);

  }

  findPlane(aId) {
    this.setState({airplaneShow: true});
    this.setState({airplaneId: aId});
  }

  galleryShow() {
    this.setState({ galleryShow: true });
    this.setState({ userShow: false });
  }

  userShow() {
    this.setState({ userShow: true });
    this.setState({ galleryShow: false });
    this.setState({ airplaneShow: false });
  }

  getOrigins() {
    let list = [];
    this.state.flightdata.map((flight) => {
      list.push(flight.fromto.slice(0, 3));
    });
    let unique = [...new Set(list)];
    list = Array.from(unique);
    this.setState({ origins: list });
  }

  getDestinations() {
    let list = [];
    this.state.flightdata.map((flight) => {
      list.push(flight.fromto.slice(7, 10));
    });
    let unique = [...new Set(list)];
    list = Array.from(unique);
    this.setState({ destinations: list });
  }

  getAirplanes () {
    console.log(this.state.airplanedata)
    this.setState({seats: this.state.airplanedata});
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
        <NavbarApp galleryShow={this.galleryShow} userShow={this.userShow} />
        <h2>Secrets coming soon</h2>
        <SecretForm onSubmit={ this.saveFlight } />
        {this.state.galleryShow ? <Gallery flightdata={ this.state.flightdata } origins={this.state.origins} destinations={this.state.destinations} findPlane={ this.findPlane }/> : ''}
        {this.state.userShow? <UserPage currentUser={ this.state.currentUser }/> : ''}
        {this.state.airplaneShow? <Airplane seats={ this.state.seats } airplaneId={ this.state.airplaneId }/> : ''}
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

  constructor() {
    super();
    this.state = {
      o: '',
      d: '',
      showResults: false
    }
    this._handleOrigin = this._handleOrigin.bind(this);
    this._handleDestination = this._handleDestination.bind(this);
    this._handleSearch = this._handleSearch.bind(this);
    this.resultsVisible = this.resultsVisible.bind(this);
  }

  _handleSearch(event) {
    event.preventDefault();
    this.setState({showResults: true})
  }

  resultsVisible() {
    return(
      this.props.flightdata.map((flight) => {
        if ( this.state.o === flight.fromto.slice(0, 3) && this.state.d === flight.fromto.slice(7, 10) ) {
          return(
            <Button value={flight.airplane_id} variant="primary" type="submit" onClick={ this.renderAirplane }>
              Date: {flight.date} || Flight Number: {flight.flightnumber} || Flight Path: {flight.fromto} || Seats: {flight.seats}
            </Button>
          );
        }
      })
    )
  }

  renderAirplane(event) {
    event.preventDefault();
    this.props.findPlane(event.target.value)
  }

  _handleOrigin(event) {
    this.setState({ o: event.target.value })
  }

  _handleDestination(event) {
    this.setState({ d: event.target.value })
  }


  render() {
    return (
    <div class="dropdown">
      <Form onSubmit={ this._handleSearch }>
        <select id="origin" name="origin" onChange={ this._handleOrigin }>
          {this.props.origins.map((flight) =>
            <option value={flight}>{flight}</option>
          )}
        </select>
      >>
      <select name="dest" id="dest" onChange={ this._handleDestination }>
          {this.props.destinations.map((flight) =>
            <option value={flight}>{flight}</option>
          )}
        </select>
        <br></br>
        <Button variant="primary" type="submit">
          Search
      </Button>

      </Form>
      <br/>
      <br/>
      <br/>

      {this.state.showResults? this.resultsVisible() : ''}

      <br/>
      <br/>
      <br/>

    </div >

    )
  };
};


const Airplane = (props) => {
  console.log('some bshdaskifaksjdhflk', props.seats);

  return (
    <div class="airplane">
      <h3>Seat Select</h3>
      {props.seats.map((seat) =>
        <p>{"Airplane "}{seat.name}{" Rows "}{seat.rows}{" Columns "}{seat.columns}</p>
      )}

      <h2></h2>
      <table className="grid">
        <tbody>
          {props.seats[0] ? props.seats.map(() =>
            <tr>
              { props.seats.map( (seat) =>
                <td
                  key={seat.name} onClick = {e => this.onClickSeat(seat)}>{seat.columns} </td>) }
            </tr>
          ) : ''}
        </tbody>
      </table>

    </div>

  );
}


////////////////////////////////////////////////
class Seats extends Component {
  constructor() {
    super();
      this.state = {
      seat: [
        'Front1','Front2','Front3',
        'Middle1','Middle2','Middle3',
        'Back1','Back2','Back3'
      ],
      seatAvailable: [
        'Front1','Front2','Front3',
        'Middle1','Middle2','Middle3',
        'Back1','Back2','Back3'
      ],
      seatReserved: []
    }
  }

  onClickData(seat) {
    if(this.state.seatReserved.indexOf(seat) > -1 ) {
      this.setState({
        seatAvailable: this.state.seatAvailable.concat(seat),
        seatReserved: this.state.seatReserved.filter(res => res != seat)
      })
    } else {
      this.setState({
        seatReserved: this.state.seatReserved.concat(seat),
        seatAvailable: this.state.seatAvailable.filter(res => res != seat)
      })
    }
  }

  render() {
    return (
      <div>
        <h1>Seat Reservation System</h1>
        <DrawGrid
          seat = { this.state.seat }
          available = { this.state.seatAvailable }
          reserved = { this.state.seatReserved }
          onClickData = { this.onClickData.bind(this) }
          />
      </div>
    )
  }
}

class DrawGrid extends React.Component {
  render() {
    return (
       <div className="container">
        <h2></h2>
        <table className="grid">
          <tbody>
              <tr>
                { this.props.seat.map( row =>
                  <td
                    className={this.props.reserved.indexOf(row) > -1? 'reserved': 'available'}
                    key={row} onClick = {e => this.onClickSeat(row)}>{row} </td>) }
              </tr>
          </tbody>
        </table>

        <AvailableList available = { this.props.available } />
        <ReservedList reserved = { this.props.reserved } />
       </div>
    )
  }

  onClickSeat(seat) {
    this.props.onClickData(seat);
  }
}

class AvailableList extends React.Component {
  render() {
    const seatCount = this.props.available.length;
    return(
      <div className="left">
        <h4>Available Seats: ({seatCount == 0? 'No seats available' : seatCount})</h4>
        <ul>
          {this.props.available.map( res => <li key={res} >{res}</li> )}
        </ul>
      </div>
    )
  }
  }

  class ReservedList extends React.Component {
  render() {
    return(
      <div className="right">
        <h4>Reserved Seats: ({this.props.reserved.length})</h4>
        <ul>
          { this.props.reserved.map(res => <li key={res} >{res}</li>) }
        </ul>
      </div>
    )
  }
}


////////////////////////////////////////////////


export default AirlineSearch
