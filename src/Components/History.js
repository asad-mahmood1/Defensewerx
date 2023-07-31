import React from 'react';
import '../App.css';

function History(props) {
  return (
    <div className="History-container">
      <span className="History-title">Recent Search History</span>
      <hr />
      <div className="History-card-container">
        {props.history.map((card, i) => {
          return (
            <div className="History-card" key={i + 'h'}>
              <div
                onClick={(e) => {
                  props.clickSearch(e.target.innerText);
                }}
                className="History-card-title"
              >
                {card.title}
              </div>
              <div className="History-card-date">{card.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
