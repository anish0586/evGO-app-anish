import React, { Component } from "react";
import "./App.css";

import axios from "axios";

class App extends Component {
  state = {
    error: null,
    isLoaded: false,
    items: []
  };

  getSpaceXLaunches = async (query) => {
    try {
      const response = await axios.post("https://api.spacex.land/graphql/", {
        query
      });

      // Log the response so we can look at it in the console
      console.log(response.data);

      //Set data to load in the table
      this.setState(() => ({
        isLoaded: true,
        items: response.data.data.launches
      }));
    } catch (error) {
      //add the error into the state to show in the page
      this.setState(() => ({ error }));
    }
  };

  addItem(e) {
    // Prevent button click from submitting form
    e.preventDefault();

    //Get the search critera from the form, to be added in the query
    const missionName = document.getElementById("missionName");
    const rocketName = document.getElementById("rocketName");
    const launchYear = document.getElementById("LaunchYear");

    //create the graphQL query based on the input
    const query = `
    query {
        launches(find: {mission_name: "${missionName.value}", rocket_name: "${rocketName.value}", launch_year: "${launchYear.value}"}) {
            launch_date_local
            mission_name
            rocket {
              rocket_name
            }
            links {
              video_link
            }
        }
    }
    `
    this.getSpaceXLaunches(query);
  }

  //render the table based on the output received from api
  renderTableData(items) {
    return items.map((item) => {
      return (
        <tr key={item.mission_name}>
          <td>{item.mission_name}</td>
          <td>{item.rocket.rocket_name}</td>
          <td>{item.launch_date_local}</td>
          <td><a href={item.links.video_link} target="_blank" rel="noopener noreferrer">{item.links.video_link}</a></td>
        </tr>
      );
    });
  }

  //controls for the header and filter section
  renderFilterSection() {
    return (
      <div>
      <h1 id="mission" className="title">
        Space X Mission Information - EVgo Exercise
      </h1>
      <section className="section">
      <form align="center" id="addItemForm">
        <input type="text" className="input" id="missionName" placeholder="Mission Name"/>
        <input type="text" className="input" id="rocketName" placeholder="Rocket Name"/>
        <input type="text" className="input" id="LaunchYear" placeholder="Launch Year, eg 2020"/>
        <button className="button" onClick={this.addItem}>Search</button>
      </form>
    </section>
    </div>)
  }

  render() {
    const { error, isLoaded, items } = this.state;
    
    //this line will make the function addItem understand this
    this.addItem = this.addItem.bind(this);

    //if the api result in error, show the error message
    if (error) {
      return <div>{error.message}</div>;
    } else if (!isLoaded) {
      //on page load, will just show the filter section
      return this.renderFilterSection();
    } else {
      return (
        <div>
          {this.renderFilterSection()}
          <table id="mission_data" className="mission">
            <tbody className="mission">
              <tr>
                <th key="mission_name">Mission Name</th>
                <th key="rocket_name">Rocket Name</th>
                <th key="launch_date">Launch Date</th>
                <th key="links">Video Link</th>
              </tr>
              {this.renderTableData(items)}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default App;
