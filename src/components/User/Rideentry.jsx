import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Map from './Map';
const Swal = require('sweetalert2');

/**
 * The basic architecture for displaying a ride in Listings.jsx.
 */
class Rideentry extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: '', //driver
			userNotFound: false,
			shouldShowDelete: this.props.shouldShowDelete,
			shouldShowJoin: this.props.shouldShowJoin,
			shouldShowComplete: this.props.shouldShowComplete,
			shouldShowFeedback: this.props.shouldShowFeedback,
			poolDetails: this.props,
			poolID: this.props.rideID,
			memberID: JSON.parse(localStorage.getItem('userID')), //user rider
			hasGivenFeedback: false,
			rides: [],
			showMap: false,
			choseJoin: false,
			waypoint: '',
			// setShowModal: false,
			showModal: false,
		};

		this.showDate = this.showDate.bind(this);

		this.showPrice = this.showPrice.bind(this);

		this.handleclick = this.handleclick.bind(this);
		this.handleJoin = this.handleJoin.bind(this);
		this.handleclickDelete = this.handleclickDelete.bind(this);
		this.handleclickComplete = this.handleclickComplete.bind(this);
		this.handleclickFeedback = this.handleclickFeedback.bind(this);
		this.getRidesAsRider = this.getRidesAsRider.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleHideModal = this.handleHideModal.bind(this);
		this.handleclickVersion = this.handleclickVersion.bind(this);

		// this.checkToken = this.checkToken.bind(this);

		this.checkToken();
		this.getUser(this.props.driverID);
		this.getRidesAsRider();
	}

	handleHideModal() {
		this.setState({
			showModal: false,
		});
		// setShowModal(false);
	}

	handleShowModal() {
		console.log('inside handle show modal');
		this.setState({
			showModal: true,
		});
		// setShowModal(true);

		console.log(this.state.setShowModal);
	}

	handleJoin(event) {
		console.log('inside handle Join');

		const target = event.target;
		const value = target.value;
		const name = target.name;

		console.log('name and value', name, value);

		this.setState({
			[name]: value,
		});

		console.log(this.state.waypoint);
	}

	checkToken() {
		console.log('called check token in ride entry');
		const userID = JSON.parse(localStorage.getItem('userID'));
		console.log('user in newride', userID);

		if (userID) {
			this.setState({
				memberID: userID,
				poolID: this.state.poolDetails.rideID,
			});

			console.log('this state in check token', this.state);
		}
	}

	async handleclick() {
		console.log('clicked join.....');
		console.log('rides in join click', this.state.rides);

		let canJoin = false;

		const hasRideWithin10Minutes = this.state.rides.some((r) => {
			if (r.date.slice(0, 10) === this.state.poolDetails.date.slice(0, 10)) {
				console.log('matched with', r);
				console.log('date of matches', r.date);
				const rideTime = new Date(r.date).getTime();
				console.log('ride time', rideTime);
				const now = new Date(this.state.poolDetails.date).getTime();
				console.log('now time', now);
				const timeDiff = Math.abs(rideTime - now);
				console.log('time diff', timeDiff);
				const diffInMinutes = Math.round(timeDiff / (1000 * 60)); // Convert milliseconds to minutes
				console.log('diff in mins', diffInMinutes);
				console.log('return ', diffInMinutes >= 0 && diffInMinutes <= 10);
				return diffInMinutes >= 0 && diffInMinutes <= 10;
			} else {
				return false;
			}
		});

		// If the user has a ride within 10 minutes, display an alert and prevent them from joining
		if (!hasRideWithin10Minutes) {
			canJoin = true;
		}

		console.log('has ride within 10 min?', hasRideWithin10Minutes, canJoin);

		if (!canJoin) {
			// alert(
			// 	'You have a ride within the next 10 minutes. You cannot join this ride.'
			// );
			Swal.fire(
				'',
				'You have a ride within the next 10 minutes. You cannot join this ride',
				'question'
			);
		} else {
			console.log('entered else');
			// this.setState({ showMap: true });
			console.log('ride to be joined:', this.state);

			this.setState({
				choseJoin: true,
			});

			console.log('this state in join', this.state);

			// const uri = `http://localhost:4000/ride/joinPool`;

			// // const self = this;

			// const body = JSON.stringify(this.state);

			// fetch(uri, {
			// 	method: 'POST',
			// 	body,
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// })
			// 	.then((response) => {
			// 		if (response.status === 200) {
			// 			console.log('joined');
			// 			Swal.fire({
			// 				position: 'top-end',
			// 				icon: 'success',
			// 				title: 'Ride saved in your account',
			// 				showConfirmButton: false,
			// 				timer: 1500,
			// 			});
			// 			// window.location.reload();
			// 		}
			// 	})
			// 	.catch((err) => {
			// 		console.log('Request failed', err);
			// 	});
		}
	}

	async handleclickVersion() {
		console.log('clicked join.....');
		console.log('rides in join click', this.state.rides);

		let canJoin = false;

		const hasRideWithin10Minutes = this.state.rides.some((r) => {
			if (r.date.slice(0, 10) === this.state.poolDetails.date.slice(0, 10)) {
				console.log('matched with', r);
				console.log('date of matches', r.date);
				const rideTime = new Date(r.date).getTime();
				console.log('ride time', rideTime);
				const now = new Date(this.state.poolDetails.date).getTime();
				console.log('now time', now);
				const timeDiff = Math.abs(rideTime - now);
				console.log('time diff', timeDiff);
				const diffInMinutes = Math.round(timeDiff / (1000 * 60)); // Convert milliseconds to minutes
				console.log('diff in mins', diffInMinutes);
				console.log('return ', diffInMinutes >= 0 && diffInMinutes <= 10);
				return diffInMinutes >= 0 && diffInMinutes <= 10;
			} else {
				return false;
			}
		});

		// If the user has a ride within 10 minutes, display an alert and prevent them from joining
		if (!hasRideWithin10Minutes) {
			canJoin = true;
		}

		console.log('has ride within 10 min?', hasRideWithin10Minutes, canJoin);

		if (!canJoin) {
			// alert(
			// 	'You have a ride within the next 10 minutes. You cannot join this ride.'
			// );
			Swal.fire(
				'',
				'You have a ride within the next 10 minutes. You cannot join this ride',
				'question'
			);
		} else {
			console.log('entered else');
			console.log('ride to be joined:', this.state);

			const uri = `http://localhost:4000/ride/joinPool`;

			const body = JSON.stringify(this.state);

			fetch(uri, {
				method: 'POST',
				body,
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => {
					if (response.status === 200) {
						console.log('joined');
						Swal.fire({
							position: 'top-end',
							icon: 'success',
							title: 'Ride saved in your account',
							showConfirmButton: false,
							timer: 1500,
						});
						// window.location.reload();
					}
				})
				.catch((err) => {
					console.log('Request failed', err);
				});
		}
	}

	async handleclickDelete() {
		console.log('clicked Delete.....');

		console.log('ride to be deleted:', this.state.poolID);

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
					const uri = `http://localhost:4000/ride/${this.state.poolID}`;

					// const self = this;

					fetch(uri, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						},
					})
						.then((response) => {
							if (response.status === 200) {
								swalWithBootstrapButtons.fire(
									'Deleted!',
									'Your file has been deleted.',
									'success'
								);
								window.location.reload();
							}
						})
						.catch((err) => {
							console.log('Request failed', err);
						});
				} else if (
					/* Read more about handling dismissals below */
					result.dismiss === Swal.DismissReason.cancel
				) {
					swalWithBootstrapButtons.fire(
						'Cancelled',
						'Ride is not deleted :)',
						'error'
					);
				}
			});
	}

	handleclickComplete() {
		console.log('clicked complete.....');
		console.log('this state in complete', this.state);

		console.log('ride to be completed:', this.state.poolDetails.rideID);

		const uri = `http://localhost:4000/ride/${this.state.poolDetails.rideID}`;

		fetch(uri, {
			method: 'PUT',
			// body: formdata,
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			if (response.status === 200) {
				console.log('completed ');
				localStorage.setItem(
					'poolDetails',
					JSON.stringify(this.state.poolDetails)
				);
				window.location.replace('/payment');
			} else {
				console.log('not completed');
			}
		});
	}

	handleclickFeedback() {
		console.log('clicked feedback...');

		localStorage.setItem(
			'driverID',
			JSON.stringify(this.state.poolDetails.driverID)
		);
		window.location.replace('/feedback');
	}

	/**
	 * Prettify the date a little bit.
	 */
	showDate() {
		const date = new Date(this.props.date);

		const dateString = date.toLocaleDateString();
		const timeString = date.toLocaleTimeString();

		return (
			<td className="RideEntryField" id="datestamp">
				{dateString} {timeString}
			</td>
		);
	}

	/**
	 * Render price of ride.
	 */
	showPrice() {
		if (this.props.price === 0) {
			return (
				<td>
					<p className="RideEntryFieldPrice">free</p>
				</td>
			);
		} else {
			return (
				<td>
					<p className="RideEntryFieldPrice">Rs. {this.props.price}</p>
				</td>
			);
		}
	}

	/**
	 * From the ride object, extract the driver's ID to look them up in the DB and get relevant infos.
	 */
	getUser(driverID) {
		var uri = `http://localhost:4000/user/${driverID}`;

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
			.then((founduser) => {
				console.log('founduser driver', founduser);
				if (founduser) {
					self.setState({
						user: founduser,
					});
					console.log('found user in hehe:', self.state.user);

					const hasGivenFeedback = self.state.user?.feedback.some(
						(feedback) => feedback.fromID === this.state.memberID
					);

					self.setState({
						hasGivenFeedback: hasGivenFeedback,
					});
					console.log('hasGivenFeedback?', self.state.hasGivenFeedback);

					console.log('user in ride entry:' + self.state.user.firstname);
				}
			})
			.catch((error) => {
				console.log('error in getting the rider', error);

				self.setState({
					userNotFound: true,
				});
			});
	}

	getRidesAsRider() {
		const uri = `http://localhost:4000/ride/rides`;

		// Get user id and send it in with the post request.

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
				data.forEach((ride) => {
					ride.poolMembers?.forEach((element) => {
						if (this.state.memberID === element.memberID) {
							arr.push(ride);
						}
					});
				});

				this.setState({
					rides: arr,
				});

				console.log('my rides from rideentry', this.state.rides);
			});
	}

	/**
	 * Render a listing.
	 */
	render() {
		// TODO: add a button to toggle the mode to edit. This button will only be visible if the driver id matches the userid. Should the edit button show up on the listings page? What should the edit page look like? Like the listing or like the new ride entry page? Answer: more like the new ride entry page.
		if (this.state.userNotFound) {
			return null;
		} else {
			let memberJoined = false;
			this.props.poolMembers?.forEach((element) => {
				if (this.state?.memberID === element.memberID) memberJoined = true;
			});
			if (this.props.driverID === this.state?.memberID) memberJoined = true;
			return (
				<table className="RideEntry">
					<tbody>
						<tr>
							<td className="RideEntryName">
								{this.state.user.firstname + ' ' + this.state.user.lastname}
							</td>
							<this.showDate />
						</tr>
						<tr>
							<td>
								<ul className="RideEntryField">
									<li className="RideEntryField">
										Pickup: {this.props.departure}
									</li>
									<li className="RideEntryField">
										Drop-off: {this.props.destination}
									</li>
								</ul>
							</td>
							<this.showPrice />
						</tr>
						<tr>
							<td>
								<p className="RideEntryFieldNumber">
									{this.props.numberOfSeats}
								</p>
							</td>
							{this.state.shouldShowJoin && (
								<td>
									<button
										type="submit"
										className={
											!this.props.numberOfSeats || memberJoined
												? 'disableBtn'
												: 'btn'
										}
										onClick={this.handleclick}
									>
										Join
									</button>
								</td>
							)}
							{this.state.shouldShowJoin && this.state.choseJoin && (
								<td>
									<input
										className="RideEntryField"
										type="text"
										name="waypoint"
										value={this.state.waypoint}
										onChange={this.handleJoin}
									/>
									<Button variant="primary" onClick={this.handleShowModal}>
										Show Map
									</Button>
									<Modal
										show={this.state.showModal}
										onHide={this.handleHideModal}
									>
										<Modal.Header closeButton>
											<Modal.Title>Map Modal</Modal.Title>
										</Modal.Header>
										<Modal.Body style={{ height: '400px' }}>
											<Map
												searchQueries={[
													this.state.poolDetails.departure,
													this.state.waypoint,
													this.state.poolDetails.destination,
												]}
											/>
										</Modal.Body>
										<Modal.Footer>
											<Button
												variant="secondary"
												onClick={this.handleclickVersion}
											>
												Confirm
											</Button>
										</Modal.Footer>
									</Modal>
								</td>
							)}
							{this.state.shouldShowDelete && (
								<td>
									<button
										type="submit"
										className={'btn'}
										onClick={this.handleclickDelete}
									>
										Delete
									</button>
								</td>
							)}
							{this.state.shouldShowComplete && (
								<td>
									<button
										type="submit"
										className={'btn'}
										onClick={this.handleclickComplete}
									>
										Complete
									</button>
								</td>
							)}
							{this.state.shouldShowFeedback && (
								<td>
									<button
										type="submit"
										className={
											this.state.hasGivenFeedback ? 'disableBtn' : 'btn'
										}
										onClick={this.handleclickFeedback}
									>
										Give Feedback
									</button>
								</td>
							)}
						</tr>
					</tbody>
				</table>
			);
		}
	}
}

export default Rideentry;
