import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navigation = () => {
	return (
		// <Navbar bg="light" expand="lg">
		//   <Navbar.Brand href="/">My Website</Navbar.Brand>
		//   <Navbar.Toggle aria-controls="basic-navbar-nav" />
		//   <Navbar.Collapse id="basic-navbar-nav">
		//     <Nav className="mr-auto">
		//       <Link to="/" className="nav-link">Home</Link>
		//       <Link to="/about" className="nav-link">About</Link>
		//       <Link to="/signup" className="nav-link">Signup</Link>
		//     </Nav>
		//   </Navbar.Collapse>
		// </Navbar>
		<Navbar bg="light" variant="light">
			<Container>
				<Navbar.Brand href="/">PoolNRide</Navbar.Brand>
				<Nav className="me-auto">
					<Nav.Link href="/about">About Me</Nav.Link>
					<Nav.Link href="/Signup">Signup</Nav.Link>
					<Nav.Link href="/signin">Signin</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
};

export default Navigation;
