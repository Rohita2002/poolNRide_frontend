import React, { Component } from 'react';
import Sidebar from '../Sidebar';
const Swal = require('sweetalert2');

/**
 * The about page.
 */
export default class ViewUsers extends Component {
	constructor(props) {
		super(props);

		this.state = {
			Users: [],
			vehicles: [],
			url: '',
		};

		this.getAllUsers = this.getAllUsers.bind(this);
		this.deleteUserAndVehicleAndPools =
			this.deleteUserAndVehicleAndPools.bind(this);
		this.calculateAverageRating = this.calculateAverageRating.bind(this);
		this.displayStars = this.displayStars.bind(this);
		this.getAllVehicles = this.getAllVehicles.bind(this);
		this.handleVerify = this.handleVerify.bind(this);

		this.getAllUsers();
		this.getAllVehicles();
	}

	handleVerify(id, showvb) {
		console.log('clicked verify');

		if (!showvb) {
			Swal.fire('User is already verified');
		} else {
			const uri = `http://localhost:4000/user/${id}`;

			// Get user id and send it in with the post request.

			const self = this;

			fetch(uri, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ verified: true }),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Failed to update user');
					}
					// handle success
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'User is verified',
						showConfirmButton: false,
						timer: 1500,
					});
					window.location.reload();
				})
				.catch((error) => {
					// handle error
					console.log(error);
				});
		}
	}

	showImage(id, showverbut) {
		fetch(`http://localhost:4000/user/image/${id}.png`)
			.then((response) => {
				if (response.status === 200) {
					return response.blob();
				} else {
					throw new Error('Image not found');
				}
			})
			.then((blob) => {
				this.url = URL.createObjectURL(blob);
				console.log('url', this.state.url);
				Swal.fire({
					title: 'License ID',
					imageUrl: `${this.url}`,
					imageWidth: 400,
					imageHeight: 200,
					imageAlt: 'Custom image',
					footer: '<button id="verify-btn">Verify</button>',
					// Add an event listener to the "Verify" button
					didOpen: () => {
						const verifyBtn = document.getElementById('verify-btn');
						verifyBtn.addEventListener('click', () => {
							this.handleVerify(id, showverbut);
						});
					},
					// Remove the event listener when the SweetAlert dialog box is closed
					willClose: () => {
						const verifyBtn = document.getElementById('verify-btn');
						verifyBtn.removeEventListener('click', () => {
							this.handleVerify(id, showverbut);
						});
					},
				});
			})
			.catch((error) => {
				this.setState({ error: error.message });
			});
	}

	getAllUsers() {
		const uri = `http://localhost:4000/user/allusers`;

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
				data.forEach((user) => {
					if (user.emailID !== 'admin@gmail.com') arr.push(user);
				});
				self.setState({
					Users: arr,
				});
				console.log('data', data);
			});
	}

	getAllVehicles() {
		const uri = `http://localhost:4000/vehicle/allvehicles`;

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
				data.forEach((vehicle) => {
					arr.push(vehicle);
				});
				self.setState({
					vehicles: arr,
				});
				console.log('data', data);
			});
	}

	deleteUserAndVehicleAndPools(userId) {
		// Delete the user
		fetch(`http://localhost:4000/user/${userId}`, {
			method: 'DELETE',
		})
			.then((response) => {
				if (response.status !== 200) {
					console.log('Failed to delete user');
				}
				console.log('User deleted successfully');

				// Delete the vehicle belonging to the user
				return fetch(`http://localhost:4000/vehicle/${userId}`, {
					method: 'DELETE',
				});
			})
			.then((response) => {
				if (response.status !== 200) {
					console.log('Failed to delete vehicle');
				}
				console.log('Vehicle deleted successfully');

				// Delete any pools associated with the user
				return fetch(`http://localhost:4000/ride/deletePool/${userId}`, {
					method: 'DELETE',
				});
			})
			.then((response) => {
				if (response.status !== 200) {
					console.log('Failed to delete pools');
				}
				console.log('Pools deleted successfully');

				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'User is deleted',
					showConfirmButton: false,
					timer: 1500,
				});
				window.location.reload();
			})
			.catch((error) => {
				console.log('Error deleting user, vehicle, and pools:', error);
			});
	}

	calculateAverageRating(feedback) {
		const total = feedback.reduce((acc, curr) => acc + curr.rating, 0);
		const avg = total / feedback.length;
		return avg.toFixed(1);
	}

	displayStars(numStars, maxStars) {
		const fullStars = Math.floor(numStars);
		console.log('fullstars', fullStars);
		const halfStar = numStars % 1 >= 0.5 ? '★' : '☆';
		console.log('mod', numStars % 1);
		console.log('half stars', halfStar);
		const emptyStars = maxStars - fullStars - (halfStar === '★' ? 1 : 0);
		console.log('empty stars', emptyStars);

		const stars =
			numStars % 1 >= 0.5
				? '★'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars)
				: '★'.repeat(fullStars) + '☆'.repeat(emptyStars);

		console.log('stars', stars);
		return stars;
	}

	render() {
		console.log('users in main', this.state.Users);

		return (
			<div className="App">
				<div className="AppGlassNoDiv">
					<Sidebar />
					<div>
						<table>
							<thead>
								<tr>
									<th>#</th>
									<th>First Name</th>
									<th>Username</th>
									<th>Email ID</th>
									<th>Mobile Number</th>
									<th>Feedback</th>
									<th>Average Rating</th>
									<th>Driver License</th>
									<th>Delete</th>
								</tr>
							</thead>
							<tbody>
								{this.state.Users?.map((user, index) => {
									const sortedFeedback = user.feedback
										.sort((a, b) => {
											const aTimestamp = new Date(
												parseInt(a._id.toString().substring(0, 8), 16) * 1000
											);
											const bTimestamp = new Date(
												parseInt(b._id.toString().substring(0, 8), 16) * 1000
											);
											return bTimestamp - aTimestamp;
										})
										.slice(0, 3);

									const showVerifyButton = user?.verified;

									return (
										<tr key={user._id}>
											<td>{index + 1}</td>
											<td>{user.firstname}</td>
											<td>{user.username}</td>
											<td>{user.emailID}</td>
											<td>{user.mobileNumber}</td>
											<td>
												{sortedFeedback.map((feedback, idx) => (
													<div key={idx}>
														<p>
															{' '}
															{idx + 1}. Message: {feedback.message}
														</p>
														<p>
															Rating: {this.displayStars(feedback.rating, 5)}
														</p>
													</div>
												))}
											</td>
											<td>
												{user.feedback.length > 0 ? (
													<div>
														<p>
															{this.displayStars(
																this.calculateAverageRating(user.feedback),
																5
															)}
														</p>
													</div>
												) : (
													<p>No ratings yet</p>
												)}
											</td>
											{this.state.vehicles.some(
												(vehicle) => vehicle.driverID === user._id
											) ? (
												<button
													onClick={() =>
														this.showImage(user._id, !showVerifyButton)
													}
												>
													Has vehicle
												</button>
											) : (
												<a>No Vehicle</a>
											)}
											<td>
												<button
													onClick={() =>
														this.deleteUserAndVehicleAndPools(user._id)
													}
												>
													Delete
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}
