// Sidebar imports
import {
	UilEstate,
	UilClipboardAlt,
	UilUsersAlt,
} from '@iconscout/react-unicons';

// Analytics Cards imports
import { UilUsdSquare, UilMoneyWithdrawal } from '@iconscout/react-unicons';

const Admin = JSON.parse(localStorage.getItem('Admin'));
console.log('admin in data', Admin);

// Sidebar Data
export const SidebarData = Admin
	? [
			{
				icon: UilEstate,
				heading: 'Home',
				navigateTo: '/admin',
			},
			{
				icon: UilClipboardAlt,
				heading: 'Users',
				navigateTo: '/viewusers',
			},
			{
				icon: UilUsersAlt,
				heading: 'Pools',
				navigateTo: '/viewpools',
			},
	  ]
	: [
			{
				icon: UilEstate,
				heading: 'Home',
				navigateTo: '/homeuser',
			},
			{
				icon: UilClipboardAlt,
				heading: 'My Account',
				navigateTo: '/myaccount',
			},
			{
				icon: UilUsersAlt,
				heading: 'New Ride',
				navigateTo: '/newride',
			},
	  ];

// Analytics Cards Data
export const cardsData = [
	{
		title: 'Users',
		color: {
			backGround: 'linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)',
			boxShadow: '0px 10px 20px 0px #e0c6f5',
		},
		barValue: 70,
		value: '25,970',
		png: UilClipboardAlt,
		series: [
			{
				name: 'Users',
				data: [31, 40, 28, 51, 42, 109, 100],
			},
		],
	},
	{
		title: 'Active Pools',
		color: {
			backGround: 'linear-gradient(180deg, #FF919D 0%, #FC929D 100%)',
			boxShadow: '0px 10px 20px 0px #FDC0C7',
		},
		barValue: 80,
		value: '14,270',
		png: UilMoneyWithdrawal,
		series: [
			{
				name: 'Active Pools',
				data: [10, 100, 50, 70, 80, 30, 40],
			},
		],
	},
	{
		title: 'Completed Pools',
		color: {
			backGround:
				'linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)',
			boxShadow: '0px 10px 20px 0px #F9D59B',
		},
		barValue: 60,
		value: '4,270',
		png: UilUsdSquare,
		series: [
			{
				name: 'Completed Pools',
				data: [10, 25, 15, 30, 12, 15, 20],
			},
		],
	},
];

// Recent Update Card Data
export const UpdatesData = [
	{
		// img: img1,
		name: 'Andrew Thomas',
		noti: 'has ordered Apple smart watch 2500mh battery.',
		time: '25 seconds ago',
	},
	{
		// img: img2,
		name: 'James Bond',
		noti: 'has received Samsung gadget for charging battery.',
		time: '30 minutes ago',
	},
	{
		// img: img3,
		name: 'Iron Man',
		noti: 'has ordered Apple smart watch, samsung Gear 2500mh battery.',
		time: '2 hours ago',
	},
];
