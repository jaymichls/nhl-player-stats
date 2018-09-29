import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      activeTab: 0,
      skaters: [],
      goalies: []
    };
  }
  async componentDidMount() {
    let {
      data: {
        data: {
          player_stats: { goalies, skaters }
        }
      }
    } = await axios.get(
      "https://d290qmen6zswb.cloudfront.net/web_player_table?league=nhl&season=2017&season_type=reg"
    );
    skaters = skaters
      .map(skater => {
        const value = Object.keys(pointMap).reduce((accum, field) => {
          accum += skater[field] * pointMap[field];
          return accum;
        }, 0);
        return { ...skater, value };
      })
      .sort((a, b) => desc(a, b, "value"));
    goalies = goalies
      .map(goalie => {
        const value = Object.keys(goaliePointMap).reduce((accum, field) => {
          accum += goalie[field] * goaliePointMap[field];
          return accum;
        }, 0);
        return { ...goalie, value };
      })
      .sort((a, b) => desc(a, b, "value"));

    this.setState({ goalies, skaters });
  }

  handleChangeTab = (event, activeTab) => {
    this.setState({ activeTab });
  };

  render() {
    const { activeTab, skaters, goalies } = this.state;

    return (
      <div>
        <Tabs value={activeTab} onChange={this.handleChangeTab}>
          <Tab label="Players" />
          <Tab label="Goalies" />
        </Tabs>
        {activeTab == 0 ? (
          <ReactTable columns={skaterColumns} data={skaters} />
        ) : null}
        {activeTab == 1 ? (
          <ReactTable columns={goalieColumns} data={goalies} />
        ) : null}
      </div>
    );
  }
}

export default App;

const pointMap = {
  points: 3,
  penalty_minutes: 0.5,
  power_play_points: 1,
  short_handed_goals: 1,
  shots_on_goal: 0.5
};

const goaliePointMap = {
  wins: 3,
  goals_against: -1.5,
  saves: 0.5,
  shutouts: 4
};

const skaterColumns = [
  {
    id: "name",
    accessor: "player_name_formatted",
    Header: "Name"
  },
  {
    id: "value",
    accessor: "value",
    Header: "Value"
  },

  {
    id: "points",
    accessor: "points",
    Header: "Points"
  },
  {
    id: "goals",
    accessor: "goals",
    Header: "Goals"
  },
  {
    id: "assists",
    accessor: "assists",
    Header: "Assists"
  },
  {
    id: "PM",
    accessor: "penalty_minutes",
    Header: "Value"
  },
  {
    id: "ppp",
    accessor: "power_play_points",
    Header: "PPP"
  },
  {
    id: "shorthandedgoals",
    accessor: "short_handed_goals",
    Header: "Short handed G"
  },
  {
    id: "shotsongoal",
    accessor: "shots_on_goal",
    Header: "Shots on goal"
  }
];

const goalieColumns = [
  {
    id: "name",
    accessor: "player_name_formatted",
    Header: "Name"
  },
  {
    id: "value",
    accessor: "value",
    Header: "Value"
  },
  {
    id: "wins",
    accessor: "wins",
    Header: "Wins"
  },
  {
    id: "goalsagainst",
    accessor: "goals_against",
    Header: "Goals Against"
  },
  {
    id: "saves",
    accessor: "saves",
    Header: "Saves"
  },
  {
    id: "shutouts",
    accessor: "shutouts",
    Header: "Shutouts"
  }
];
