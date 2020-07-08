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
    this._handleClick = this._handleClick.bind(this)
  }


  _handleClick(event) {
    event.preventDefault()
    console.log('This was clicked')
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Nav className="mr-auto">
            <Nav.Link href="#home" onClick={this._handleClick} >Search Flights</Nav.Link>
            <Nav.Link href="#features" onClick={this._handleClick}>My Reservations</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    )
  }
}

export default NavbarApp
