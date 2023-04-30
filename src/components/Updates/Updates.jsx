import React from 'react';
import './Updates.css';
import { UpdatesData } from '../../Data/Data';

class Updates extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: null,
			verifiedUsers: null,
			completedRides: null,
			xSec: null,
			xSecPool: null,
		};

		this.getUpdateUsers = this.getUpdateUsers.bind(this);
		this.getPoolStats = this.getPoolStats.bind(this);

		this.getUpdateUsers();
		this.getPoolStats();
	}

	getPoolStats() {
		console.log('hi from update.jsx');
		fetch('http://localhost:4000/ride/admin/cpoolstatsSev')
			.then((response) => response.json())
			.then((data) => {
				console.log('hehe', data.completedRidesCount);

				this.setState({
					completedRides: data.completedRidesCount,
					xSecPool: data.timeDiff,
				});
			})
			.catch((error) => console.error(error));
	}

	getUpdateUsers() {
		console.log('hi from update.jsx');
		fetch('http://localhost:4000/user/admin/userstats7days')
			.then((response) => response.json())
			.then((data) => {
				// const usersInLast7Days = stats['usersInLast7Days'];
				console.log('data', data.totalCount);
				console.log('data', data.verifiedUserCount);
				this.setState({
					users: data.totalCount,
					verifiedUsers: data.verifiedUserCount,
					xSec: data.timeDiff,
				});
			})
			.catch((error) => console.error(error));
	}
	render() {
		return (
			<div className="Updates">
				<div className="update">
					{/* <img src={update.img} alt="profile" /> */}
					<div className="noti">
						<div style={{ marginBottom: '0.5rem' }}>
							<span>Total Verified Users</span>
							<span> {this.state.verifiedUsers}</span>
						</div>
					</div>
				</div>
				<div className="update">
					{/* <img src={update.img} alt="profile" /> */}
					<div className="noti">
						<div style={{ marginBottom: '0.5rem' }}>
							<span>Users in last 7 days</span>
							<span> {this.state.users}</span>
						</div>
						<span>{this.state.xSec} ago</span>
					</div>
				</div>
				<div className="update">
					{/* <img src={update.img} alt="profile" /> */}
					<div className="noti">
						<div style={{ marginBottom: '0.5rem' }}>
							<span>Pools completed in last 7 days</span>
							<span> {this.state.completedRides}</span>
						</div>
						<span>{this.state.xSecPool} ago</span>
					</div>
				</div>
			</div>
		);
	}
}

export default Updates;
