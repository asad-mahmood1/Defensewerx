import './App.css';
import axios from 'axios';

import Header from './Components/Header.js';
import SearchBar from './Components/SearchBar.js';
import ResponseContainer from './Components/ResponseContainer.js';
import History from './Components/History.js';
import React from 'react';
import FilterSort from './Components/FilterSort';
import Alert from './Components/Alert';
import ExportPDF from './Components/ExportPDF';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      response: [],
      result: [],
      history: [],
      scoring: [0, 100],
      loading: false,
      alert: [
        {
          title: "CONCERNS FROM SOCIAL MEDIA CONTENT",
          date: "2023-05-25",
          score: 0.55,
          text: "Exemplary embodiments provide methods and systems for identifying safety and security threat concerns and safety and wellness climate concerns from social media content. Social media content is searched based identify threatening content and safety and wellness climate concerns relevant to an enterprise, rather than benign user information. Identification of enterprise-relevant threatening content triggers generation and transmission of a threat alert to a device associated with the enterprise. Identification of enterprise-relevant safety and wellness climate concerns in social media content causes information regarding the results to be aggregated and analyzed, with the results of the analysis and aggregation presented to a user via a graphical user interface (e.g., to view results over time).",
          author: ["Natasha Conahan ", "Andrew J. Reischer ", "Gary J. Margolis "],
        },
        {
          title: "GENERATING CYBER SECURITY THREAT INDEX",
          date: "2023-05-25",
          score: 0.55,
          text: "A new approach is proposed to support generating and presenting a single composite Cyber Security Threat Index (CSTI) to a user, wherein the CSTI provides the user with an indication of risk of cyber attacks globally and/or in the context of his/her current networking environment. First, various pools of operational data are collected over networks, systems, and/or products,",
          author: ["Shi Fleming"],
        },
        {
          title: "METHODS OF OPTIMAL PERSONALIZED DAILY HYDRATION",
          date: "2023-05-25",
          score: 0.5,
          text: "Devices and methods analyze daily hydration in an individual. An application can confirm if typical daily water intake by an individual participating is sufficient to maintain hydration and/or can determine an optimal personalized hydration plan to maintain or improve hydration for the individual.",
          author: ["Marchal ", "Eric"],
        },
      ],
    };
  }

  componentDidMount() {
    if (JSON.parse(localStorage.getItem('dw-state'))) {
      this.setState(JSON.parse(localStorage.getItem('dw-state')));
    }
  }

  saveState = () => {
    let currentState = {};
    currentState.history = this.state.history;
    localStorage.setItem('dw-state', JSON.stringify(currentState));
  };

  updateSearch = (e) => {
    let tempState = this.state.search;
    tempState = e.target.value;
    this.setState({ search: tempState }, this.saveState());
  };

  filterResponse = (filterBy) => {
    if (filterBy.target.value === 'All') {
      this.setState({ result: this.state.response }, () => {
        return;
      });
    }
    if (this.state.response.length && filterBy.target.value !== 'All') {
      let filtered = this.state.response.filter((obj) => {
        let source = '';
        if (
          obj.result_metadata.collection_id ===
          '6a68c899-78de-1f84-0000-018898843003'
        ) {
          source = 'USPTO';
        } else if (
          obj.result_metadata.collection_id ===
          'b2072fda-e81c-a94b-0000-01887dd6f2da'
        ) {
          source = 'Arxiv';
        } else if (
          obj.result_metadata.collection_id ===
          'b2072fda-e81c-a94b-0000-01887d931593'
        ) {
          source = 'DHS';
        } else if (
          obj.result_metadata.collection_id ===
          'f9de9f28-d5aa-ac14-0000-0189ad90ddd1'
        ) {
          source = 'TechCrunch';
        }
        return source === filterBy.target.value;
      });
      this.setState({ result: filtered });
    }
  };
  // Test function for handling all filter/sort state changes
  // Refactor filter/sort to use state instead of event handling

  sortResponse = (sortBy) => {
    // Add state handling for sorting to fix refreshing
    // Refactor sorting to handle state changes.
    if (sortBy.target.value === 'None') {
      return;
    }

    if (this.state.response.length && sortBy.target.value !== 'None') {
      let tempState = this.state;

      if (sortBy.target.value === 'Highest') {
        tempState.result.sort(
          (a, b) => b.result_metadata.confidence - a.result_metadata.confidence
        );
      } else if (sortBy.target.value === 'Lowest') {
        tempState.result.sort(
          (a, b) => a.result_metadata.confidence - b.result_metadata.confidence
        );
      }

      if (sortBy.target.value === 'New') {
        tempState.result.sort((a, b) => {
          return new Date(b.date.trim()) - new Date(a.date.trim());
        });
      } else if (sortBy.target.value === 'Old') {
        tempState.result.sort((a, b) => {
          return new Date(a.date.trim()) - new Date(b.date.trim());
        });
      }

      this.setState(tempState);
    }
  };

  scoreSort = (e) => {
    let tempstate = this.state;

    if (e.target.name === 'minscore' && e.target.value >= 0) {
      tempstate.scoring[0] = Number(e.target.value);
    } else if (e.target.name === 'maxscore' && e.target.value <= 100) {
      tempstate.scoring[1] = Number(e.target.value);
    }

    let filtered = tempstate.response.filter((obj) => {
      return (
        Number(Math.ceil(obj.result_metadata.confidence * 100)) >=
          tempstate.scoring[0] &&
        Number(Math.ceil(obj.result_metadata.confidence * 100)) <=
          tempstate.scoring[1]
      );
    });

    this.setState({ scoring: tempstate.scoring, result: filtered });
  };

  searchSkill = () => {
    this.setState({ loading: true }, () => {
      axios
        .get('/search', {
          params: {
            search: this.state.search,
          },
        })
        .then(
          function (res) {
            let currentDate = new Date();
            currentDate =
              'Last Accessed: ' +
              currentDate.getUTCFullYear() +
              '/' +
              (currentDate.getUTCMonth() + 1) +
              '/' +
              currentDate.getUTCDate();

            let tempState = this.state;

            tempState.history.unshift({
              title: this.state.search,
              date: currentDate,
            });

            tempState.response = tempState.result = res.data;
            tempState.loading = false;
            this.setState(tempState, () => {
              this.saveState();
            });
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  clickSearch = (e) => {
    this.setState({ search: e, loading: true }, () => {
      axios
        .get('/search', {
          params: {
            search: this.state.search,
          },
        })
        .then(
          function (res) {
            let tempState = this.state;

            tempState.response = tempState.result = res.data;
            tempState.loading = false;
            this.setState(tempState, () => {
              this.saveState();
            });
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="App-container">
          <div className="App-container1">
            <SearchBar
              updateSearch={this.updateSearch}
              searchSkill={this.searchSkill}
              searchValue={this.state.search}
            />
            {this.state.response.length || this.state.loading ? (
              <ResponseContainer
                loading={this.state.loading}
                result={this.state.result}
                search={this.state.search}
              />
            ) : (
              // <div className="Response-filler"></div>
              <Alert alert={this.state.alert} />
            )}
          </div>
          {/* Remove 1===1 after testing */}
          {this.state.response.length || 1 === 1 ? (
            <div className="App-container2">
              <FilterSort
                filterResponse={this.filterResponse}
                sortResponse={this.sortResponse}
                scoreSort={this.scoreSort}
                result={this.state.result}
                response={this.state.response}
                scoring={this.state.scoring}
              />
              <History
                clickSearch={this.clickSearch}
                history={this.state.history}
              />
            </div>
          ) : (
            <div className="App-container2"></div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
