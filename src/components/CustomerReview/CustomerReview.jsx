import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const CustomerReview = () => {
	const [valuesArray, setValuesArray] = useState([]);
	const [keysArray, setKeysArray] = useState([]);
	const uri = `http://localhost:4000/user/admin/feedbackstats`;

	useEffect(() => {
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
				console.log('data: ', data);
				const valuesArray = Object.values(data);
				console.log('values array:', valuesArray);
				setValuesArray(valuesArray);

				const keysArray = Object.keys(data);
				console.log('keys array:', keysArray);
				setKeysArray(keysArray);
			});
	}, []);

	const data = {
		series: [
			{
				name: 'Review',
				data: valuesArray,
			},
		],
		options: {
			chart: {
				type: 'area',
				height: 'auto',
			},

			fill: {
				colors: ['#fff'],
				type: 'gradient',
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
				colors: ['#ff929f'],
			},
			tooltip: {
				x: {
					format: 'dd/MM/yyyy',
				},
			},
			grid: {
				show: false,
			},
			xaxis: {
				type: 'datetime',
				categories: keysArray,
			},
			yaxis: {
				show: false,
			},
			toolbar: {
				show: false,
			},
		},
	};
	return (
		<div className="CustomerReview">
			<Chart options={data.options} series={data.series} type="area" />
		</div>
	);
};

export default CustomerReview;
