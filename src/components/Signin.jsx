import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from './NavBar';
const Swal = require('sweetalert2');
// import Cookies from 'universal-cookie';

/**
 * A Login form for returning users.
 * @TODO redirect to main page on login.
 */
export class Signin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			emailID: '',
			password: '',
			loggedIn: false,
			isAdmin: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	/**
	 * Update state when values are changed.
	 * @param {*} event
	 */
	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	/**
	 * When user submits the form.
	 *
	 * @TODO sanitize the data, notify user of errors, and make a post request here to create a new user.
	 */
	handleSubmit(event) {
		event.preventDefault();

		// First make sure appropriate data is passed in.
		if (!this.state.emailID) {
			// alert('Must enter a valid email address.');
			Swal.fire(
				'',
				'Must enter a valid email address.',
				'question'
			  )
		} else if (!this.state.password) {
			// alert('Enter in your password!');
			Swal.fire(
				'',
				'Must enter a password.',
				'question'
			  )
		} else {
			// Make the post request
			const uri = `http://localhost:4000/user/login`;

			const formdata = JSON.stringify(this.state);
			// remove this line when cleaning out code.
			const self = this;

			fetch(uri, {
				method: 'POST',
				body: formdata,
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(function (response) {
					console.log('got response');

					if (response.status === 400 || response.status === 401) {
						// alert(
						// 	"Sorry, we couldn't find someone with that email and password."
						// );
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'we couldnt find someone with that email and password.',
							footer: ''
						  })
					} else {
						return response.json();
					}
				})
				.then(function (jsonresponse) {
					// If successful.
					console.log('user id logged in', jsonresponse.userID);

					localStorage.setItem('userID', JSON.stringify(jsonresponse.userID));
					if (
						self.state.isAdmin === false &&
						self.state.emailID === 'admin@gmail.com' &&
						self.state.password === 'admin'
					) {
						console.log('in elseif');
						localStorage.setItem('Admin', JSON.stringify('true'));
						self.setState({
							isAdmin: true,
						});
					}

					self.setState({
						loggedIn: true,
					});

					// window.location.reload();
				})
				.catch(function (err) {
					console.log('Request failed', err);
				});
		}
	}

	render() {
		if (this.state.loggedIn && this.state.isAdmin === false) {
			console.log('render in if');
			return <Navigate to="/homeuser" />;
		} else if (this.state.loggedIn && this.state.isAdmin === true) {
			console.log('render in else if');
			return <Navigate to="/admin" />;
		}
		return (
			<div>
				<NavBar />
				<div className="LoginContainer">
					<h1 className="formInput">Welcome back!</h1>

					<form className="LoginForm" onSubmit={this.handleSubmit}>
						<label className="LoginFormInput">Email Address</label>
						<input
							type="text"
							name="emailID"
							value={this.state.emailID}
							onChange={this.handleChange}
						/>

						<label className="LoginFormInput">Password</label>
						<input
							type="password"
							name="password"
							value={this.state.password}
							onChange={this.handleChange}
						/>

						<input className="LoginFormInput" type="submit" value="Submit" />
					</form>
				</div>
			</div>
		);
	}
}

export default Signin;
