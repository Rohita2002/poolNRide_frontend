import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Table.css';

function createData(name, trackingId, date, status) {
	return { name, trackingId, date, status };
}

const rows = [
	createData('Lasania Chiken Fri', 18908424, '2 March 2022', 'Approved'),
	createData('Big Baza Bang ', 18908424, '2 March 2022', 'Pending'),
	createData('Mouth Freshner', 18908424, '2 March 2022', 'Approved'),
	createData('Cupcake', 18908421, '2 March 2022', 'Delivered'),
];

const makeStyle = (status) => {
	if (status === 'Approved') {
		return {
			background: 'rgb(145 254 159 / 47%)',
			color: 'green',
		};
	} else if (status === 'Pending') {
		return {
			background: '#ffadad8f',
			color: 'red',
		};
	} else {
		return {
			background: '#59bfff',
			color: 'white',
		};
	}
};

class BasicTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			popCat: null,
		};

		this.getPopCat = this.getPopCat.bind(this);
		this.getPopCat();
	}

	getPopCat() {
		console.log('hi from table.jsx');
		fetch('http://localhost:4000/ride/admin/popcategory')
			.then((response) => response.json())
			.then((data) => {
				// const usersInLast7Days = stats['usersInLast7Days'];
				console.log('data', data.topCategories);

				this.setState({
					popCat: data.topCategories,
				});
			})
			.catch((error) => console.error(error));
	}
	render() {
		console.log('this state', this.state);
		return (
			<div className="Table">
				<h3>Popular Categories</h3>
				<TableContainer
					component={Paper}
					style={{ boxShadow: '0px 13px 20px 0px #80808029' }}
				>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Category</TableCell>
								<TableCell align="left">#Rides</TableCell>
								<TableCell align="left">#Active Rides</TableCell>
								<TableCell align="left">#Completed Rides</TableCell>
								<TableCell align="left">Completion Rate</TableCell>
							</TableRow>
						</TableHead>
						<TableBody style={{ color: 'white' }}>
							{this.state.popCat?.map((cat) => (
								<TableRow
									key={cat._id}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{cat._id}
									</TableCell>
									<TableCell align="left">{cat.rideCount}</TableCell>
									<TableCell align="left">{cat.activeCount}</TableCell>
									<TableCell align="left">{cat.completedCount}</TableCell>
									<TableCell align="left">
										{((cat.completedCount / cat.rideCount) * 100).toFixed(2)}%
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
	}
}

export default BasicTable;
