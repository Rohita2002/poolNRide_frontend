import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import Mapbox from 'react-map-gl/dist/esm/mapbox/mapbox';

mapboxgl.accessToken =
	'pk.eyJ1IjoiMzAwMzIwMDIiLCJhIjoiY2xneGFvbDBlMDA0NjNzbXN4dDBkMjd4ciJ9.1cofTXlVr8NQiHQTgBZIeg';

const MAPBOX_ACCESS_TOKEN =
	'pk.eyJ1IjoiMzAwMzIwMDIiLCJhIjoiY2xneGFvbDBlMDA0NjNzbXN4dDBkMjd4ciJ9.1cofTXlVr8NQiHQTgBZIeg';

class Map extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchQueries: this.props.searchQueries,
			markers: [],
		};

		this.mapContainer = React.createRef();
	}

	componentDidMount() {
		console.log('searchQueries', this.state.searchQueries);
		this.state.searchQueries.forEach((searchQuery) => {
			console.log('inside fetch');
			fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?proximity=78.491684,17.387140&access_token=${MAPBOX_ACCESS_TOKEN}`
			)
				.then((response) => response.json())
				.then((data) => {
					const searchResults = data.features;
					if (searchResults.length > 0) {
						const firstResult = searchResults[0];
						const [longitude, latitude] = firstResult.geometry.coordinates;
						console.log(latitude, longitude); // do something with the coordinates

						let marker = new mapboxgl.Marker({
							color: '#8B1874',
							draggable: true,
						})
							.setLngLat([longitude, latitude])
							.setPopup(new mapboxgl.Popup().setHTML('<h1>Hello World!</h1>'))
							.addTo(map);
					}
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		});
		const map = new mapboxgl.Map({
			container: this.mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [78.491684, 17.38714],
			zoom: 9,
		});

		map.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
				showUserHeading: true,
			})
		);

		map.addControl(new mapboxgl.NavigationControl());

		this.map = map;
	}

	componentWillUnmount() {
		this.map.remove();
	}

	render() {
		console.log('in map.jsx');
		return (
			<div style={{ height: '100%' }}>
				<div
					ref={this.mapContainer}
					style={{ height: '100%', width: '100%' }}
				/>
			</div>
		);
	}
}

export default Map;
