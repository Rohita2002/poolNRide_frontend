import React, { Component } from 'react';
import NavBar from './NavBar';
import './Landing.css';

/**
 * The landing page.
 */
export default class Landing extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<NavBar />
				<div className="mainLanding">
					<div className="aboutLandingMain">
						<div className="aboutLanding1">
							<h1>
								It's a simple, quick, cheap and fun way to commute together.
							</h1>
							
							<p>
								PoolNRide connecting people who need to travel with drivers who
								have empty seats. Trusted carpooling. Fully insured.
							</p>
						</div>
						<img
							className="aboutLanding2"
							src="../imgs/carpool.png"
							alt=""
						></img>
						<div className="aboutLanding3">
							<button onClick={() => window.location.replace('/signup')}>
								Sign Up
							</button>
						</div>
					</div>
					<footer className="footerLanding">
						<div className="footerSection">
							USING POOLNRIDE
							<div className="footerOption">How it works</div>
							<div className="footerOption">Trust & Safety</div>
							<div className="footerOption">Experience levels</div>
							<div className="footerOption">Ratings</div>
							<div className="footerOption">Ladies only</div>
							<div className="footerOption">Members Agreement</div>
							<div className="footerOption">Insurance</div>
						</div>
						<div className="footerSection">
							OUR COMPANY
							<div className="footerOption">About us</div>
							<div className="footerOption">Press</div>
							<div className="footerOption">Partners</div>
							<div className="footerOption">Careers</div>
							<div className="footerOption">Contact</div>
						</div>
						<div className="footerSection">
							LEGAL
							<div className="footerOption">Terms & Conditions</div>
							<div className="footerOption">Privacy Policy</div>
							<div className="footerOption">Cookies Policy</div>
						</div>
					</footer>
				</div>
			</div>
		);
	}
}
