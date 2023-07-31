import React from 'react';
import '../App.css';

function FilterSort(props) {
  return (
    <div className="FilterSort">
      <div className="Filter_Container">
        <span className="Filter_title">Filters</span>
        <hr />
        <div className="Filters">
          <span>Source</span>
          {props.response.length > 0 ? (
            <select className="Filter-source" onChange={props.filterResponse}>
              <option value={'All'}>All</option>
              <option value={'Arxiv'}>Arxiv</option>
              <option value={'USPTO'}>USPTO</option>
              <option value={'TechCrunch'}>TechCrunch</option>
              <option value={'DHS'}>DHS</option>
            </select>
          ) : (
            <select
              disabled
              className="Filter-source"
              onChange={props.filterResponse}
            >
              <option value={'All'}>All</option>
              <option value={'Arxiv'}>Arxiv</option>
              <option value={'USPTO'}>USPTO</option>
              <option value={'TechCrunch'}>TechCrunch</option>
              <option value={'DHS'}>DHS</option>
            </select>
          )}
          {/* <span>Date</span>
          <div>
            <span>Year</span>
            {props.result.length > 0 ? (
              <select className="Filter-source" onChange={props.filterResponse}>
                <option value={'All'}>All</option>
                {props.result[0].map((option, i) => {
                  let newDate = option.Date.split('-');
                  return <option value={newDate[0]}>{newDate[0]}</option>;
                })}
              </select>
            ) : (
              <select
                disabled
                className="Filter-source"
                onChange={props.filterResponse}
              >
                <option value={'All'}>All</option>
              </select>
            )}
          </div> */}
          {/* Add date filtering dropdown similar to source filter */}
        </div>
      </div>
      <div className="Sort_Container">
        <span className="Sort_title">Sort By</span>
        <hr />
        <div className="Sorts">
          <span>Date</span>
          {props.response.length > 0 ? (
            <select className="Filter-source" onChange={props.sortResponse}>
              <option value={'None'}>None</option>
              <option value={'New'}>New</option>
              <option value={'Old'}>Old</option>
            </select>
          ) : (
            <select
              disabled
              className="Filter-source"
              onChange={props.sortResponse}
            >
              <option value={'None'}>None</option>
              <option value={'New'}>New</option>
              <option value={'Old'}>Old</option>
            </select>
          )}
          <span>Confidence Score</span>
          {props.response.length > 0 ? (
            <span>
              <select className="Filter-source" onChange={props.sortResponse}>
                <option value={'None'}>None</option>
                <option value={'Highest'}>Highest</option>
                <option value={'Lowest'}>Lowest</option>
              </select>
              <span>
                {' '}
                <label id={'scorelabel'} for={'minscore'}>
                  Min
                </label>
                <input
                  onChange={props.scoreSort}
                  type={'number'}
                  id={'minscore'}
                  name={'minscore'}
                  min={'0'}
                  max={'100'}
                  value={props.scoring[0]}
                />{' '}
                <label id={'scorelabel'} for={'maxscore'}>
                  Max
                </label>
                <input
                  onChange={props.scoreSort}
                  type={'number'}
                  id={'maxscore'}
                  name={'maxscore'}
                  min={'0'}
                  max={'100'}
                  value={props.scoring[1]}
                />
              </span>
            </span>
          ) : (
            <span>
              <select
                disabled
                className="Filter-source"
                onChange={props.sortResponse}
              >
                <option value={'None'}>None</option>
                <option value={'Highest'}>Highest</option>
                <option value={'Lowest'}>Lowest</option>
              </select>
              <span>
                {' '}
                <label id={'scorelabel'} for={'minscore'}>
                  Min
                </label>
                <input
                  disabled
                  type={'number'}
                  id={'minscore'}
                  name={'minscore'}
                  min={'0'}
                  max={'100'}
                  value={0}
                />{' '}
                <label id={'scorelabel'} for={'maxscore'}>
                  Max
                </label>
                <input
                  disabled
                  type={'number'}
                  id={'maxscore'}
                  name={'maxscore'}
                  min={'0'}
                  max={'100'}
                  value={100}
                />
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterSort;
