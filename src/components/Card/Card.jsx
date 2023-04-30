import React, { useState, useEffect } from 'react';
import './Card.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion, AnimateSharedLayout } from 'framer-motion';
import { UilTimes } from '@iconscout/react-unicons';
import Chart from 'react-apexcharts';

// parent Card

const Card = (props) => {
	const [expanded, setExpanded] = useState(false);
	return (
		<AnimateSharedLayout>
			{expanded ? (
				<ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
			) : (
				<CompactCard param={props} setExpanded={() => setExpanded(true)} />
			)}
		</AnimateSharedLayout>
	);
};

// Compact Card
function CompactCard({ param, setExpanded }) {
	const [noOfThings, setnoOfThings] = useState(0);
	const [barper, setbarper] = useState(0);
	const Png = param.png;

	if (param.title === 'Users') {
		//?fetch call to get number of users by finding length of array recieved
		const uri = `http://localhost:4000/user/allusers`;
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
				setnoOfThings(arr.length);
			});
		const uri2 = `http://localhost:4000/user/admin/userstats`;
		fetch(uri2, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				// lastValue = Object.values(data).pop();
				// console.log(Object.values(data).pop());
				setbarper(((Object.values(data).pop() - 1) / noOfThings) * 100);
			});
		// setbarper((lastValue/noOfThings) * 100)
	} else if (param.title === 'Active Pools') {
		const uri3 = `http://localhost:4000/ride/rides`;
		fetch(uri3, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (param.title === 'Active Pools') {
					// setbarper()
					if (data.length > 0) {
						var activeRides = 0;
						var completedRides = 0;
						for (const ride of data) {
							if (!ride.completed) {
								activeRides++;
							} else {
								completedRides++;
							}
						}
						setbarper(
							Math.round((activeRides / (activeRides + completedRides)) * 100)
						);
						setnoOfThings(activeRides);
					}
				}
			});
	} else {
		const uri3 = `http://localhost:4000/ride/rides`;
		fetch(uri3, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				// setbarper()
				if (data.length > 0) {
					var activeRides = 0;
					var completedRides = 0;
					for (const ride of data) {
						if (!ride.completed) {
							activeRides++;
						} else {
							completedRides++;
						}
					}
					setbarper(
						Math.round((completedRides / (activeRides + completedRides)) * 100)
					);
					setnoOfThings(completedRides);
				}
			});
	}
	return (
		<motion.div
			className="CompactCard"
			style={{
				background: param.color.backGround,
				boxShadow: param.color.boxShadow,
			}}
			layoutId="expandableCard"
			onClick={setExpanded}
		>
			<div className="radialBar">
				<CircularProgressbar value={barper} text={barper && `${barper}%`} />
				<span>{param.title}</span>
			</div>
			<div className="detail">
				<Png />
				<span>{`${noOfThings}`}</span>
				<span>{`Total ${param.title}`}</span>
			</div>
		</motion.div>
	);
}

// Expanded Card
  function ExpandedCard({ param, setExpanded }) {
    const [valuesArray, setValuesArray] = useState([]);

    useEffect(() => {
      // Fetch data when the component mounts
      fetchData();
    }, []);

    function fetchData() {
      let uri;
      if (param.title === 'Users') {
        uri = `http://localhost:4000/user/admin/userstats`;
      } else if (param.title === 'Active Pools') {
        uri = `http://localhost:4000/ride/admin/apoolstats`;
      } else {
        uri = `http://localhost:4000/ride/admin/cpoolstats`;
      }

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
        });
    }

    function getCategories() {
      const today = new Date();
      const categories = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        const categoryName = `${monthName} ${date.getFullYear()}`;
        categories.push(categoryName);
      }

      return categories;
    }

    var ChartData = {
      options: {
        chart: {
          type: 'area',
          height: 'auto',
        },

        dropShadow: {
          enabled: false,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: '#000',
          opacity: 0.35,
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
          colors: ['white'],
        },
        tooltip: {
          x: {
            format: 'MMM yyyy',
          },
        },
        grid: {
          show: true,
        },
        xaxis: {
          type: 'datetime',
          categories: getCategories(),
        },
      },
      series: [{
        name: param.title,
        data: valuesArray,
      }],
    };

    return (
      <motion.div
        className="ExpandedCard"
        style={{
          background: param.color.backGround,
          boxShadow: param.color.boxShadow,
        }}
        layoutId="expandableCard"
      >
        <div style={{ alignSelf: 'flex-end', cursor: 'pointer', color: 'white' }}>
          <UilTimes onClick={setExpanded} />
        </div>
        <span>{param.title}</span>
        <div className="chartContainer">
          <Chart options={ChartData.options} series={ChartData.series} type="area" />
        </div>
        <span>Last 7 months</span>
      </motion.div>
    );
  }

export default Card;
