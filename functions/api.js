'use strict';var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const axios = require('axios');

const express = require('express');
const app = express();
const cors = require('cors')({ origin: true });

app.use(cors);
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

const pointMap = {
	points: 3,
	penaltyMinutes: 0.5,
	ppPoints: 1,
	shGoals: 1,
	shots: 0.5,
	hits: 0.5,
	blockedShots: 0.5 };


const goaliePointMap = {
	wins: 3,
	goalsAgainst: -1.5,
	saves: 0.5,
	shutouts: 4 };


// GET /api/players
app.get('/players', (() => {var _ref = (0, _asyncToGenerator3.default)(function* (req, res) {
		try {
			const [
			{
				data: { data: playerStats } },

			{
				data: { data: extraInfo } }] =

			yield Promise.all([
			axios.get(
			'http://www.nhl.com/stats/rest/skaters?isAggregate=false&reportType=basic&isGame=false&reportName=skatersummary&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22},{%22property%22:%22goals%22,%22direction%22:%22DESC%22},{%22property%22:%22assists%22,%22direction%22:%22DESC%22}]&cayenneExp=gameTypeId=2%20and%20seasonId%3E=20172018%20and%20seasonId%3C=20172018'),

			axios.get(
			'http://www.nhl.com/stats/rest/skaters?isAggregate=false&reportType=basic&isGame=false&reportName=realtime&sort=[{%22property%22:%22hits%22,%22direction%22:%22DESC%22}]&cayenneExp=gameTypeId=2%20and%20seasonId%3E=20172018%20and%20seasonId%3C=20172018')]);



			const players = playerStats.map(function (player) {
				const index = extraInfo.findIndex(
				function ({ playerId }) {return playerId === player.playerId;});

				const playerExtra = index > -1 ? extraInfo[index] : {};
				let playerStats = (0, _extends3.default)({}, player, playerExtra);

				const value = Object.keys(pointMap).reduce(function (accum, field) {
					accum += playerStats[field] * pointMap[field];
					return accum;
				}, 0);

				return (0, _extends3.default)({}, playerStats, { value });
			});

			return res.status(200).json(players);
		} catch (error) {
			console.log(error);
			return res.status(500);
		}
	});return function (_x, _x2) {return _ref.apply(this, arguments);};})());

app.get('/goalies', (() => {var _ref2 = (0, _asyncToGenerator3.default)(function* (req, res) {
		try {
			let {
				data: { data: goalies } } =
			yield axios.get(
			'http://www.nhl.com/stats/rest/goalies?isAggregate=false&reportType=goalie_basic&isGame=false&reportName=goaliesummary&sort=[{%22property%22:%22wins%22,%22direction%22:%22DESC%22}]&cayenneExp=gameTypeId=2%20and%20seasonId%3E=20172018%20and%20seasonId%3C=20172018');

			console.log(goalies.length);
			goalies = goalies.map(function (goalie) {
				const value = Object.keys(goaliePointMap).reduce(function (accum, field) {
					accum += goalie[field] * goaliePointMap[field];
					return accum;
				}, 0);
				return (0, _extends3.default)({}, goalie, { value });
			});
		} catch (error) {
			console.log(error);
			return res.status(500);
		}
	});return function (_x3, _x4) {return _ref2.apply(this, arguments);};})());

module.exports = app;