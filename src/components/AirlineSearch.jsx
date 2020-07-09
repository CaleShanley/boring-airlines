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
      airplaneShow: false,
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
        {this.state.galleryShow ? <Gallery flightdata={ this.state.flightdata } origins={this.state.origins} destinations={this.state.destinations} findPlane={ this.findPlane }/> : ''}
        {this.state.userShow? <UserPage currentUser={ this.state.currentUser }/> : ''}
        {this.state.airplaneShow? <Airplane seats={ this.state.seats } airplaneId={ this.state.airplaneId }/> : ''}
      </div>
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
    this.renderAirplane = this.renderAirplane.bind(this);
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

  let plane = props.seats.filter((plane) => plane.id == props.airplaneId)
  console.log('this is the plane you selected', plane)

  const seatMap = (rows, columns) => {
    console.log(rows, columns)
    const seats = []
    seats.push(<p></p>)
    return(
      for (let i=0; i<rows; i++){
          return(
             {for (let j=0; j<columns; j++) {
                return(<div display="inline-block">{j}<div>)
              }}
             <br/>
          )
      }
    )
  }

  return (
    <div class="airplane">
      <h3>Seat Select</h3>
      {plane.map((seat) =>
        <p>{"Airplane "}{seat.name}{" Rows "}{seat.rows}{" Columns "}{seat.columns}</p>
      )}

      {seatMap(plane[0].rows, plane[0].columns)}

    </div>

  );
}



export default AirlineSearch
