import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import DynamicRides from './DynamicRides';
import Sidebar from '../Sidebar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const Swal = require('sweetalert2');

/**
 * Page for managing user account
 */
class MyAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedin: true,
			user: null,
			rides: [],
			ridesHist: [],
			ridesR: [],
			ridesRHist: [],
			isToggled: false,
			viewHistoryDrives: false,
			viewHistoryRides: false,
			vehicleDetails: null,
			showModalVeh: false,
			showModalPools: false,
			imageUrl: '',
			viewPools: false,
		};

		this.handleToggle = this.handleToggle.bind(this);
		this.handleClickDriveHistory = this.handleClickDriveHistory.bind(this);
		this.handleClickRideHistory = this.handleClickRideHistory.bind(this);
		this.handleShowModalVeh = this.handleShowModalVeh.bind(this);
		this.handleShowModalPools = this.handleShowModalPools.bind(this);
		this.handleHideModalVeh = this.handleHideModalVeh.bind(this);
		this.handleHideModalPools = this.handleHideModalPools.bind(this);
		this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this);
		this.handleViewPools = this.handleViewPools.bind(this);
		this.signedInUser();
	}

	handleViewPools() {
		console.log('clicked view pools');
		this.setState({
			viewPools: true,
		});
	}

	handleDeleteVehicle() {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger',
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons
			.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes, delete it!',
				cancelButtonText: 'No, cancel!',
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed) {
					const userID = JSON.parse(localStorage.getItem('userID'));
					fetch(`http://localhost:4000/vehicle/${userID}`, {
						method: 'DELETE',
					})
						.then((response) => {
							if (response.status !== 200) {
								console.log('Failed to delete vehicle');
							}
							console.log('Vehicle deleted successfully');

							return fetch(`http://localhost:4000/ride/deletePool/${userID}`, {
								method: 'DELETE',
							});
						})
						.then((response) => {
							if (response.status !== 200) {
								console.log('Failed to delete pools');
							}
							console.log('Pools deleted successfully');

							return fetch(`http://localhost:4000/user/notVerify/${userID}`, {
								method: 'PUT',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ verified: false }),
							});
						})
						.then((response) => {
							if (response.status !== 200) {
								console.log('Failed to update user');
							}
							console.log('user updated successfully');
							swalWithBootstrapButtons.fire(
								'Deleted!',
								'Your Vehicle details has been deleted.',
								'success'
							);
							window.location.reload();
						});
				} else if (
					/* Read more about handling dismissals below */
					result.dismiss === Swal.DismissReason.cancel
				) {
					swalWithBootstrapButtons.fire(
						'Cancelled',
						'Your vehicle details are not deleted :)',
						'error'
					);
				}
			});
	}

	showImage() {
		const userID = JSON.parse(localStorage.getItem('userID'));
		fetch(`http://localhost:4000/user/image/${userID}.png`)
			.then((response) => {
				if (response.status === 200) {
					return response.blob();
				} else {
					throw new Error('Image not found');
				}
			})
			.then((blob) => {
				this.setState({
					imageUrl: URL.createObjectURL(blob),
				});
			})
			.catch((error) => {
				console.log('error', error);
			});
	}

	handleHideModalVeh() {
		this.setState({
			showModalVeh: false,
		});
		// setShowModal(false);
	}

	handleHideModalPools() {
		this.setState({
			showModalPools: false,
		});
		// setShowModal(false);
	}

	handleShowModalVeh() {
		console.log('inside handle show modal');
		this.setState({
			showModalVeh: true,
		});
		// setShowModal(true);

		console.log(this.state.setShowModalVeh);
	}

	handleShowModalPools() {
		console.log('inside handle show modal');
		this.setState({
			showModalPools: true,
		});
		// setShowModal(true);

		console.log(this.state.setShowModalPools);
	}

	handleClickDriveHistory() {
		console.log('clicked drive history');
		this.setState((prevState) => ({
			viewHistoryDrives: !prevState.viewHistoryDrives,
		}));
	}
	handleClickRideHistory() {
		console.log('clicked ride history');
		this.setState((prevState) => ({
			viewHistoryRides: !prevState.viewHistoryRides,
		}));
	}

	handleToggle() {
		this.setState((prevState) => ({ isToggled: !prevState.isToggled }));
	}

	/**
	 * See if user is signed in. If so, open the new ride form. If not, prompt them to sign in.
	 */
	signedInUser() {
		console.log('signedIn user');
		const userID = JSON.parse(localStorage.getItem('userID'));

		if (userID) {
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
								user: signinResult,
							},
							() => {
								self.getRidesByUserID();
								self.getRidesAsRider();
								self.getVehicleDetails();
								self.showImage();
							}
						);
					}
				})
				.catch(function (err) {
					console.log('Request failed', err);
				});
		}
	}

	getVehicleDetails() {
		console.log('inside getting vehicles');
		const userID = JSON.parse(localStorage.getItem('userID'));

		const uri = `http://localhost:4000/vehicle/vehicleDetails/${userID}`;

		const self = this;

		fetch(uri, {
			method: 'GET',
		})
			.then((response) => {
				console.log('response', response);
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				console.log('got vehicle', data);
				self.setState({
					vehicleDetails: data,
				});
			})
			.catch((error) => {
				console.error('Error fetching vehicle details:', error);
			});
	}

	/**
	 * Get all rides for this user. TODO: check if the API endpoint works and make the rendering.
	 */
	getRidesByUserID() {
		console.log('get rides called....');
		// Populate the main page with the list of rides in a specific direction.
		var uri = `http://localhost:4000/ride/bydriver`;
		uri += `?driverID=${this.state.user._id}`;

		console.log(uri);

		const displayRides = [];
		const displayRidesHist = [];
		const self = this;

		fetch(uri, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				console.log('Get rides by userID', response);
				return response.json();
			})
			.then((rides) => {
				for (const ride of rides) {
					displayRides.push({
						key: ride._id,
						_id: ride._id,
						driverID: ride.driverID,
						departure: ride.departure,
						destination: ride.destination,
						date: ride.date,
						completed: ride.completed,
						numberOfSeats: ride.numberOfSeats + ride.poolMembers.length,
						poolMembers: ride.poolMembers,
						category: ride.category,
						price: ride.price,
					});

					if (ride.completed) {
						displayRidesHist.push({
							key: ride._id,
							_id: ride._id,
							driverID: ride.driverID,
							departure: ride.departure,
							destination: ride.destination,
							date: ride.date,
							completed: ride.completed,
							numberOfSeats: ride.numberOfSeats + ride.poolMembers.length,
							poolMembers: ride.poolMembers,
							category: ride.category,
							price: ride.price,
						});
					}
				}
				console.log('displayRides', displayRides);
				self.setState({
					rides: displayRides,
					ridesHist: displayRidesHist,
				});
			});
	}

	getRidesAsRider() {
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
				const arr = [];
				const arrHist = [];
				data.forEach((ride) => {
					ride.poolMembers?.forEach((element) => {
						console.log('element', element);
						if (this.state.user._id === element.memberID) {
							arr.push(ride);
							if (ride.completed) arrHist.push(ride);
						}
					});
				});
				self.setState({
					ridesR: arr,
					ridesRHist: arrHist,
				});
				console.log('data', data);
				console.log('ridesRHist', this.state.ridesRHist);
			});
	}

	/**
	 * The user's account page.
	 */
	render() {
		/**
		 * If no user is logged in, then redirect to the login screen (Or signup?).
		 */
		if (!this.state.loggedin) {
			return <Navigate to="/signin" />;
		}

		const isToggled = this.state.isToggled;

		const switchStyle = {
			position: 'relative',
			display: 'inline-block',
			width: '60px',
			height: '34px',
		};

		const sliderStyle = {
			position: 'absolute',
			cursor: 'pointer',
			top: '0',
			left: '0',
			right: '0',
			bottom: '0',
			backgroundColor: '#ccc',
			transition: '0.4s',
		};

		const sliderBeforeStyle = {
			position: 'absolute',
			content: '""',
			height: '26px',
			width: '26px',
			left: '4px',
			bottom: '4px',
			backgroundColor: 'white',
			transition: '0.4s',
		};

		const sliderCheckedStyle = {
			backgroundColor: '#2196F3',
		};

		const sliderCheckedBeforeStyle = {
			transform: 'translateX(26px)',
		};

		if (this.state.user !== null) {
			console.log('My pools', this.state.ridesRHist);
			return (
				<div className="App">
					<div className="AppGlassNoDiv">
						<Sidebar />

						{!this.state.viewPools && (
							<div>
								<h1>My Account</h1>
								{this.state.user?.verified && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="26"
										height="26"
										viewBox="0 0 24 24"
									>
										<circle fill="#333" cx="12" cy="12" r="10" />
										<path
											fill="#fff"
											d="M9.563 16.485l-4.998-4.997 1.414-1.414 3.584 3.584L18.949 5.52l1.415 1.414z"
										/>
									</svg>
								)}
								<p>First Name: {this.state.user.firstname}</p>
								<p>Last Name: {this.state.user.lastname}</p>
								<p>User Name: {this.state.user.username}</p>
								<p>Email ID: {this.state.user.emailID}</p>
								<p>Mobile Number: {this.state.user.mobileNumber}</p>
								<div>
									<p>My Vehicle Details: </p>
									{this.state.vehicleDetails && (
										<div>
											<Button
												variant="primary"
												onClick={this.handleShowModalVeh}
											>
												View
											</Button>
											<Modal
												show={this.state.showModalVeh}
												onHide={this.handleHideModalVeh}
											>
												<Modal.Header closeButton>
													<Modal.Title>Vehicle Details</Modal.Title>
												</Modal.Header>
												<Modal.Body style={{ height: '400px' }}>
													<p>
														vehicleType:{' '}
														{this.state.vehicleDetails?.vehicleType}
													</p>
													<p>
														vehicleRegNo:{' '}
														{this.state.vehicleDetails?.vehicleRegNo}
													</p>
													<p>
														vehicleSpecification:{' '}
														{this.state.vehicleDetails?.vehicleSpecification}
													</p>
													<p>
														licenseID: {this.state.vehicleDetails?.licenseID}
													</p>
													<img
														src={this.state.imageUrl}
														alt="Alternative text for image"
														width="300"
														height="200"
													></img>
												</Modal.Body>
												<Modal.Footer>
													<Button
														variant="secondary"
														onClick={this.handleDeleteVehicle}
													>
														Delete
													</Button>
												</Modal.Footer>
											</Modal>
										</div>
									)}
									{!this.state.vehicleDetails && (
										<div>
											<p>No vehicle registered</p>
										</div>
									)}
								</div>

								<p>My Pools:</p>
								<Button variant="primary" onClick={this.handleViewPools}>
									View
								</Button>
							</div>
						)}
						{this.state.viewPools && (
							<div>
								<label style={switchStyle} className="switch">
									<input
										type="checkbox"
										checked={isToggled}
										onChange={this.handleToggle}
									/>
									<span
										style={Object.assign(
											{},
											sliderStyle,
											isToggled ? sliderCheckedStyle : null
										)}
									>
										<span
											style={Object.assign(
												{},
												sliderBeforeStyle,
												isToggled ? sliderCheckedBeforeStyle : null
											)}
										></span>
									</span>
								</label>
								{!isToggled ? (
									<div className="UserAccountContainer">
										<h1>Hi, {this.state.user.firstname} </h1>
										{this.state.user?.verified && (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="26"
												height="26"
												viewBox="0 0 24 24"
											>
												<circle fill="#333" cx="12" cy="12" r="10" />
												<path
													fill="#fff"
													d="M9.563 16.485l-4.998-4.997 1.414-1.414 3.584 3.584L18.949 5.52l1.415 1.414z"
												/>
											</svg>
										)}

										{!this.state.viewHistoryDrives && (
											<p id="userRides">I'm driving!</p>
										)}
										{this.state.viewHistoryDrives && (
											<p id="userRides">My Drive History!</p>
										)}
										<button onClick={this.handleClickDriveHistory}>
											View Drive History
										</button>
										{!this.state.viewHistoryDrives && (
											<DynamicRides
												rides={this.state.rides}
												shouldShowJoin={false}
												shouldShowDelete={true}
												shouldShowComplete={true}
												history={false}
											/>
										)}
										{this.state.viewHistoryDrives && (
											<DynamicRides
												rides={this.state.ridesHist}
												shouldShowJoin={false}
												shouldShowDelete={false}
												shouldShowComplete={false}
												history={true}
											/>
										)}
									</div>
								) : (
									<div className="UserAccountContainer">
										<h1>Hi, {this.state.user.firstname} </h1>
										{!this.state.viewHistoryRides && (
											<p id="userRides">I'm riding!</p>
										)}
										{this.state.viewHistoryRides && (
											<p id="userRides">My Ride History!</p>
										)}
										<button onClick={this.handleClickRideHistory}>
											View Ride History
										</button>
										{!this.state.viewHistoryRides && (
											<DynamicRides
												rides={this.state.ridesR}
												shouldShowJoin={false}
												shouldShowDelete={false}
												shouldShowComplete={false}
												history={false}
											/>
										)}
										{this.state.viewHistoryRides && (
											<DynamicRides
												rides={this.state.ridesRHist}
												shouldShowJoin={false}
												shouldShowDelete={false}
												shouldShowComplete={false}
												history={true}
												shouldShowFeedback={true}
											/>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			);
		} else {
			return (
				<div className="UserAccountContainer">Loading user content :)</div>
			);
		}
	}
}

export default MyAccount;
