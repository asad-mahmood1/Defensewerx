import React from 'react';
import '../App.css';

function Alert(props) {
  return (
    <div className="AlertContainer">
      <h3 className="ResponseHeader">
        Here are your daily alerts:
      </h3>
      <div className="AlertCardContainer">
        {props.alert.map((res, i) => {
          return (
            <div key={i + 'result'} className="ResponseCard">
              <div className="ResponseCard-Title">
                {res.title}{' '}
                <div className="ResponseCard-Date">
                  {res.date},{' '}
                  <span className="ResponseCard-Score">
                    Threat Score:{' '}
                    {Number(Math.ceil(res.score * 100))}%
                  </span>
                </div>
              </div>
              <div className="ResponseCard-Content">
                {res.text}
              </div>
              {res.threats ? (
                <div className="ResponseCard-Author">
                  Threat(s): {res.threats || 'undefined'}
                </div>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Alert;

