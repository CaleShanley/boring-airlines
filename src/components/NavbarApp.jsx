import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class NavbarApp extends Component {
  constructor() {
    super()
    this.state = {
      content: ''
    }
    this._handleFlightClick = this._handleFlightClick.bind(this)
    this._handleReservationClick = this._handleReservationClick.bind(this)
  }


  _handleFlightClick(event) {
    event.preventDefault()
    this.props.galleryShow()
  }

  _handleReservationClick(event) {
    event.preventDefault()
    this.props.userShow()
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Nav className="mr-auto">
            <Nav.Link href="#home" onClick={this._handleFlightClick} >Search Flights</Nav.Link>
            <Nav.Link href="#features" onClick={this._handleReservationClick}>My Reservations</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    )
  }
}

export default NavbarApp
