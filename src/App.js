import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import checkboxHOC from "react-table/lib/hoc/selectTable";

import "react-table/react-table.css";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
const CheckboxTable = checkboxHOC(ReactTable);

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
      players: [],
      goalies: [],
      selection: []
    };
  }
  async componentDidMount() {
    let [
      { data: players },
      {
        data: {
          data: {
            player_stats: { goalies }
          }
        }
      }
    ] = await Promise.all([
      axios(
        "https://us-central1-nhl-player-stats.cloudfunctions.net/api/players"
      ),
      axios(
        "https://d290qmen6zswb.cloudfront.net/web_player_table?league=nhl&season=2017&season_type=reg"
      )
    ]);

    goalies = goalies
      .map(goalie => {
        const value = Object.keys(goaliePointMap).reduce((accum, field) => {
          accum += goalie[field] * goaliePointMap[field];
          return accum;
        }, 0);
        return { ...goalie, value };
      })
      .sort((a, b) => desc(a, b, "value"));
    players.sort((a, b) => desc(a, b, "value"));

    this.setState({ goalies, players });
  }

  handleChangeTab = (event, activeTab) => {
    this.setState({ activeTab });
  };

  toggleSelection = (key, shift, row) => {
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  isSelected = key => {
    return this.state.selection.includes(key);
  };

  toggleAll = () => {
    //
  };

  render() {
    const { activeTab, players, goalies } = this.state;
    const checkboxProps = {
      keyField: 'playerId',
      toggleAll: this.toggleAll,
      selectAll: false,
      isSelected: this.isSelected,
      toggleSelection: this.toggleSelection,
      selectType: "checkbox"
    };

    return (
      <div>
        <Tabs value={activeTab} onChange={this.handleChangeTab}>
          <Tab label="Players" />
          <Tab label="Goalies" />
        </Tabs>
        {activeTab == 0 ? (
          <CheckboxTable
            columns={skaterColumns}
            data={players}
            {...checkboxProps}
          />
        ) : null}
        {activeTab == 1 ? (
          <CheckboxTable
            columns={goalieColumns}
            data={goalies}
            {...checkboxProps}
          />
        ) : null}
      </div>
    );
  }
}

export default App;

const goaliePointMap = {
  wins: 3,
  goals_against: -1.5,
  saves: 0.5,
  shutouts: 4
};
const skaterColumns = [
  {
    id: "name",
    accessor: "playerName",
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
    id: "penalty_minutes",
    accessor: "penaltyMinutes",
    Header: "PM"
  },
  {
    id: "ppp",
    accessor: "ppPoints",
    Header: "PPP"
  },
  {
    id: "shorthandedgoals",
    accessor: "shGoals",
    Header: "Short handed G"
  },
  {
    id: "shotsongoal",
    accessor: "shots",
    Header: "Shots"
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
