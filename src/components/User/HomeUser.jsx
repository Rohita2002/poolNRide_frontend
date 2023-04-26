import React, { Component } from "react";
import Sidebar from "../Sidebar.jsx";
import { Navigate } from "react-router-dom";
import DynamicRides from "./DynamicRides.jsx";

export class HomeUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: JSON.parse(localStorage.getItem("userID")),
      Rides: null,
      category: "",
      date: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.getAllRides = this.getAllRides.bind(this);
    this.filterRidesByCategoryAndDate =
      this.filterRidesByCategoryAndDate.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);

    this.getAllRides();
  }

  /**
   * Depending on state, get the list of all relevant rides from mongodb.
   */

  getAllRides() {
    const uri = `https://poolnride-api.onrender.com/ride/rides`;

    // Get user id and send it in with the post request.

    const self = this;

    fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
          Rides: map,
        });
        console.log("data", data);
      });
  }

  handleChange(event) {
    console.log("handle change called");
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  filterRidesByCategoryAndDate() {
    console.log("inside filtering...");
    const { Rides, category, date } = this.state;
    if (!Rides || !category) {
      return [];
    }

    let filteredRides = Rides.get(category);
    console.log("filtered Rides", filteredRides);

    if (date) {
      const dateObj = new Date(date);
      filteredRides = filteredRides.filter((ride) => {
        const rideDate = new Date(ride.date);
        return rideDate.toDateString() === dateObj.toDateString();
      });
    }

    return filteredRides;
  }

  handleDateChange(date) {
    this.setState({
      date: date,
    });
    console.log("date of ride: " + this.state.date);
  }

  render() {
    if (!this.state.userID) {
      return <Navigate to="/signin" />;
    }

    console.log("user in homepage", this.state.userID);

    console.log("stating in listing", this.state.Rides);
    const categories = this.state.Rides
      ? Array.from(this.state.Rides.keys())
      : [];

    const filteredRides = this.filterRidesByCategoryAndDate(); // get the filtered rides
    console.log("filered rides in listing", filteredRides);

    return (
      <div className="App">
        <div className="AppGlassNoDiv">
          <Sidebar />

          <div className="Listing">
            <select
              className="NewRideFormInput"
              name="category"
              value={this.state.category}
              onChange={this.handleChange}
            >
              {categories.map((category) => {
                return (
                  <option key={category} value={category}>
                    {category}
                  </option>
                );
              })}
            </select>
            <input
              className="NewRideFormInput"
              type="date"
              name="date"
              value={this.state.date}
              onChange={this.handleChange}
              min={new Date().toISOString().split("T")[0]}
            />

            {filteredRides.length > 0 && ( // only render if there are filtered rides
              <div>
                <DynamicRides
                  rides={filteredRides}
                  shouldShowJoin={true}
                ></DynamicRides>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default HomeUser;
