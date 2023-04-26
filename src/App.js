import './App.css';
import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Route,
} from 'react-router-dom';
import { Routes } from 'react-router-dom/dist';

// import NavBar from './components/NavBar.jsx';
import Admin from './components/Admin/Admin.jsx';
import Landing from './components/Landing';
import About from './components/About';
import Signup from './components/Signup';
import Signin from './components/Signin';
import HomeUser from './components/User/HomeUser'
import MyAccount from './components/User/MyAccount';
import NewRide from './components/User/NewRide';
import Payment from './components/User/Payment';
import Feedback from './components/User/Feedback';
import ViewUsers from './components/Admin/ViewUsers';
import ViewPools from './components/Admin/ViewPools';
// import Mapbox from './components/User/MapBox';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isUserSignedIn: false,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			isAdmin: false,
		};

		this.updateWidth = this.updateWidth.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateWidth);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWidth);
	}

	updateWidth() {
		this.setState({
			screenWidth: window.innerWidth,
		});
	}

	render() {
		return (
			<div className="AppBefore">
				{/* <NavBar /> */}
				<Router>
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/admin" element={<Admin />} />
						<Route path="/about" element={<About />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/signin" element={<Signin />} />
						<Route path="/homeuser" element={<HomeUser />} />
						<Route path="/myaccount" element={<MyAccount />} />
						<Route path="/newride" element={<NewRide />} />
						<Route path="/payment" element={<Payment />} />
						<Route path="/feedback" element={<Feedback />} />
						<Route path="/viewusers" element={<ViewUsers />} />
						<Route path="/viewpools" element={<ViewPools />} />
						{/* <Route path="/mapbox" element={<Mapbox />} /> */}
					</Routes>
				</Router>
			</div>
		);
	}
}

export default App;
