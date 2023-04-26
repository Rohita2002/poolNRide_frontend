import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from '../Sidebar';
const Swal = require('sweetalert2');

/**
 * Page for creating a new ride entry.
 */
class NewRide extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			category: '',
			newCategory: false,
			departure: '',
			destination: '',
			date: new Date(),
			errorMessage: '',
			loggedin: true,
			driverID: '',
			submitted: false,
			price: 0,
			numberOfSeats: 0,
			vehicleDetails: '',
			haveVehicle: false,
			completed: false,

			vehicleType: '',
			vehicleRegNo: '',
			vehicleSpecification: '',
			licenseID: '',
			licenseIdPicture: '',

			rides: new Map(),
		};

		this.handleChange = this.handleChange.bind(this);

		this.handleVehicleSubmit = this.handleVehicleSubmit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.getAllRides = this.getAllRides.bind(this);
		this.handleNewCategoryChange = this.handleNewCategoryChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleNumberChange = this.handleNumberChange.bind(this);
		this.handleFileChange = this.handleFileChange.bind(this);
		this.Errors = this.Errors.bind(this);

		this.signedInUser();

		// Check for active token. If not, then prompt user to sign in or register.
	}

	handleFileChange(event) {
		console.log('event', event.target);
		this.setState({ licenseIdPicture: event.target.files[0] });
	}

	/**
	 * See if user is signed in. If so, open the new ride form. If not, prompt them to sign in.
	 */

	getAllRides() {
		const uri = `http://localhost:4000/ride/rides`;

		// Get user id and send it in with the post request.

		const self = this;

		fetch(uri, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				const map = new Map();
				data.forEach((ride) => {
					if (map.has(ride.category)) {
						const arr = map.get(ride.category);
						arr.push(ride);
						map.set(ride.category, arr);
					} else {
						const arr = [ride];
						map.set(ride.category, arr);
					}
				});
				self.setState({
					rides: map,
				});
				console.log('data', data);
			});
	}

	haveVehicleDetails() {
		console.log('hav veh det fun called');
		const uri = `http://localhost:4000/ride/getVehicleDetails`;

		// Get user id and send it in with the post request.
		if (!this.state.driverID) return;
		console.log('not returned');
		const formdata = JSON.stringify({ driverID: this.state.driverID });
		console.log('formdata veh det', formdata);
		const self = this;

		fetch(uri, {
			method: 'POST',
			body: formdata,
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			if (response.status === 200) {
				self.setState((state) => ({
					haveVehicle: true,
				}));
			} else {
				console.log('no veh in frontend');
			}
		});
	}

	signedInUser() {
		console.log('signedIn user');
		const userID = JSON.parse(localStorage.getItem('userID'));
		console.log('userID in signedIn user in new ride', userID);

		if (userID) {
			console.log('inside if');
			const uri = `http://localhost:4000/user/${userID}`;
			const self = this;

			fetch(uri, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(function (response) {
					// Check if login worked. If not, then show not logged in.
					if (response.status === 404) {
						self.setState({
							loggedin: false,
						});
					}
					return response.json();
				})
				.then(function (signinResult) {
					console.log('signinresult', signinResult);
					// If there is a user signed in, populate the fisrt and last name fields.
					if (signinResult) {
						self.setState(
							{
								firstname: signinResult.firstname,
								lastname: signinResult.lastname,
								driverID: signinResult._id,
							},
							() => {
								self.haveVehicleDetails();
								self.getAllRides();
							}
						);
					}

					console.log('this.state', self.state);
				})
				.catch(function (err) {
					console.log('Request failed', err);
				});
		}
	}

	/**
	 * Update state when values are changed.
	 * @param {} event
	 */
	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === 'vehicleType') console.log('vehicle type', value);

		this.setState({
			[name]: value,
		});
	}

	/**
	 * Handle change when input is a number type.
	 * @param {} event
	 */
	handleNumberChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (target.validity.valid) {
			this.setState({
				[name]: value,
			});
		}
	}

	/**
	 * Update category and departure/destination state when category is changed.
	 * @param {} event
	 */
	handleCategoryChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});

		if (value === 'other') {
			this.setState({
				// category : value,
				newCategory: true,
			});
		}
	}

	handleNewCategoryChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	/**
	 * Update the date specified in the calendar.
	 * @param {*} date
	 */
	handleDateChange(date) {
		this.setState({
			date: date,
		});
		console.log('date of ride: ' + this.state.date);
	}

	/**
	 * Handle the form submit by creating a post request.
	 */
	handleSubmit(event) {
		event.preventDefault();
		if (!this.state.firstname || !this.state.lastname) {
			this.setState({
				errorMessage: 'Need to fill in a name!',
			});
		} else if (this.state.numberOfSeats <= 0) {
			this.setState({
				errorMessage: 'Number of seats must be greater than 0.',
			});
		} else {
			// Make the post request
			const uri = `http://localhost:4000/ride`;

			// Get user id and send it in with the post request.

			const formdata = JSON.stringify(this.state);
			console.log('formdata in handlesubmit', formdata);
			const self = this;

			fetch(uri, {
				method: 'POST',
				body: formdata,
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(function (response) {
					self.setState({
						submitted: true,
					});

					return response.json();
				})
				.catch(function (err) {
					console.log('Request failed', err);
				});
		}
	}

	handleVehicleSubmit(event) {
		event.preventDefault();
		const uri = `http://localhost:4000/ride/vehicleSubmit`;
		const formData = new FormData();
		formData.append('vehicleType', this.state.vehicleType);
		formData.append('vehicleRegNo', this.state.vehicleRegNo);
		formData.append('vehicleSpecification', this.state.vehicleSpecification);
		formData.append('driverID', this.state.driverID);
		formData.append('licenseIdPicture', this.state.licenseIdPicture);

		fetch(uri, {
			method: 'POST',
			body: formData,
		})
			.then(function (response) {
				if (response.status === 200) {
					console.log('vehicle added');

					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Vehicle Details saved successfully',
						showConfirmButton: false,
						timer: 1500,
					});
					window.location.reload();
				}
			})
			.catch(function (err) {
				console.log('Request failed', err);
			});
	}

	/**
	 * Display errors if there are any.
	 */
	Errors() {
		console.log(this.state.errorMessage);
		return <div className="Form-Errors">{this.state.errorMessage}</div>;
	}

	/**
	 * A form for entering input to create a new ride entry in the database.
	 */
	render() {
		console.log('this.state.loggedin: ', this.state.loggedin);

		if (!this.state.loggedin) {
			return <Navigate to="/signin" />;
		}

		if (this.state.submitted) {
			return <Navigate to="/homeuser" />;
		}
		if (this.state.haveVehicle) {
			console.log('have vehicle');
			const categories = Array.from(this.state.rides.keys());
			console.log('categories', categories);

			return (
				<div className="App">
					<div className="AppGlassNoDiv">
						<Sidebar />
						<div className="NewRideForm-container">
							<h1 className="formInput">Create a new ride</h1>
							<this.Errors />
							<form className="NewRideForm" onSubmit={this.handleSubmit}>
								<table width="100%">
									<tbody>
										<tr>
											<td colSpan="1" className="NewRideTwoColumns">
												<label>First name</label>
												<input
													className="NewRideFormInput"
													type="text"
													name="firstname"
													value={this.state.firstname}
													onChange={this.handleChange}
													readOnly
												/>
											</td>
											<td colSpan="1" className="NewRideTwoColumns">
												<label>Last name</label>
												<input
													className="NewRideFormInput"
													type="text"
													name="lastname"
													value={this.state.lastname}
													onChange={this.handleChange}
													readOnly
												/>
											</td>
										</tr>
										<tr>
											<td colSpan="2">
												<label>Choose your category</label>

												{!this.state.newCategory ? (
													<select
														className="NewRideFormInput"
														name="category"
														value={this.state.category}
														onChange={this.handleCategoryChange}
													>
														{categories.map((category) => {
															return (
																<option key={category} value={category}>
																	{category}
																</option>
															);
														})}
														<option value="other">Create New</option>
													</select>
												) : (
													<div>
														<select
															className="NewRideFormInput"
															name="category"
															value={this.state.category}
															onChange={this.handleCategoryChange}
														>
															<option value="other">Create New</option>
														</select>
														<input
															className="NewRideFormInput"
															type="text"
															name="category"
															value={this.state.category}
															onChange={this.handleNewCategoryChange}
														/>
													</div>
												)}
											</td>
										</tr>
										<tr>
											<td colSpan="1">
												<label>Pick your departure</label>

												<input
													className="NewRideFormInput"
													type="text"
													name="departure"
													value={this.state.departure}
													onChange={this.handleChange}
												/>
											</td>
											<td colSpan="1">
												<label>Pick your destination</label>

												<input
													className="NewRideFormInput"
													type="text"
													name="destination"
													value={this.state.destination}
													onChange={this.handleChange}
												/>
											</td>
										</tr>
										<tr>
											<td colSpan="1">
												<label>Number of Seats</label>
												<input
													className="NewRideFormInput"
													type="text"
													name="numberOfSeats"
													pattern="[0-9]*"
													value={this.state.numberOfSeats}
													onChange={this.handleNumberChange}
												/>
											</td>
											<td colSpan="1">
												<label>Price of Ride</label>
												<input
													className="NewRideFormInput"
													type="text"
													name="price"
													pattern="[0-9]*"
													value={this.state.price}
													onChange={this.handleNumberChange}
												/>
											</td>
										</tr>
										<tr>
											<td colSpan="2">
												<label>Travel Date</label>
												<DatePicker
													className="customCalendar"
													name="date"
													selected={this.state.date}
													onChange={this.handleDateChange}
													showTimeInput
													timeInputLabel="Pickup time"
													minDate={new Date()}
												/>
											</td>
										</tr>
									</tbody>
								</table>
								<input type="submit" value="Submit" />
							</form>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="App">
					<div className="AppGlassNoDiv">
						<Sidebar />
						<div className="NewRideForm-container">
							<form onSubmit={this.handleVehicleSubmit} className="NewRideForm">
								<table width="100%">
									<tbody>
										<tr>
											<td colSpan="1" className="NewRideTwoColumns">
												<label>Vehicle Registration No</label>
												<input
													className="NewRideFormInput"
													type="text"
													name="vehicleRegNo"
													value={this.state.vehicleRegNo}
													onChange={this.handleChange}
												/>
											</td>
										</tr>
										<tr>
											<td colSpan="2">
												<label>Vehicle Type</label>
												<select
													className="NewRideFormInput"
													name="vehicleType"
													value={this.state.vehicleType}
													onChange={this.handleChange}
												>
													<option value="2 wheeler">2 Wheeler</option>
													<option value="4 wheeler">4 Wheeler</option>
												</select>
											</td>
										</tr>
										<tr>
											<td colSpan="2">
												<label>Vehicle Specification</label>
												<input
													className="NewRideFormInput"
													type="text"
													name="vehicleSpecification"
													value={this.state.vehicleSpecification}
													onChange={this.handleChange}
												/>
											</td>
										</tr>
										<tr>
											<td colSpan="2">
												<label>Driver License</label>
												<input
													className="NewRideFormInput"
													type="text"
													name="licenseID"
													value={this.state.licenseID}
													onChange={this.handleChange}
												/>
											</td>
										</tr>
										<tr>
											<td colSpan="2">
												<label>Upload License ID Picture</label>
												<input
													className="NewVehicleFormInput"
													type="file"
													name="licenseIdPicture"
													onChange={this.handleFileChange}
												/>
											</td>
										</tr>
									</tbody>
								</table>
								<input type="submit" value="Submit" />
							</form>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default NewRide;
