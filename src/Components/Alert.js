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
                {res.abstract || res.abstract_text || res.text}
              </div>
              {res.author ? (
                <div className="ResponseCard-Author">
                  Author(s): {res.author || 'undefined'}
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
