import React from 'react';
import '../App.css';

function SearchBar(props) {
  return (
    <div className="SearchBar-container">
      <span className="SearchBar-title">
        What would you like to research today?
      </span>
      <br />
      <div className="SearchBar">
        <input
          type="search"
          id="searchbar-input"
          name="searchbar-input"
          className="SearchBar-input"
          value={props.searchValue}
          onChange={(e) => props.updateSearch(e)}
        ></input>
        <button
          className="SearchBar-button"
          onClick={() => props.searchSkill()}
        >
          SEARCH
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
