import React, { Component } from 'react';
import MainDash from '../MainDash/MainDash.jsx';
import RightSide from '../RigtSide/RightSide';
import Sidebar from '../Sidebar.jsx';

class Admin extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="App">
				<div className="AppGlass">
					<Sidebar />
					<MainDash />
					<RightSide />
				</div>
			</div>
		);
	}
}

export default Admin;
