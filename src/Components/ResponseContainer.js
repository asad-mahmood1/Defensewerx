import React from 'react';
import '../App.css';
import ExportPDF from './ExportPDF';

function ResponseContainer(props) {
  return (
    <div className="ResponseContainer">
      <h3 className="ResponseHeader">
        Here's what we found: {props.result.length ? <span className='numresult'>{props.result.length} Results.</span> : ""} <ExportPDF response={props.result} search={props.search} />
      </h3>
      <div className="ResponseCardContainer">
        {props.loading
          ? 'Loading...'
          : props.result.map((res, i) => {
              let source = '';
              switch (res.result_metadata.collection_id) {
                case '6a68c899-78de-1f84-0000-018898843003':
                  source = 'USPTO';
                  break;
                case 'b2072fda-e81c-a94b-0000-01887dd6f2da':
                  source = 'Arxiv';
                  break;
                case 'b2072fda-e81c-a94b-0000-01887d931593':
                  source = 'DHS';
                  break;
                case 'f9de9f28-d5aa-ac14-0000-0189ad90ddd1':
                  source = 'TechCrunch';
                  break;
                default:
                  source = '';
              }

              return (
                <div key={i + 'result'} className="ResponseCard">
                  <div className="ResponseCard-Title">
                    {res.title}{' '}
                    <div className="ResponseCard-Date">
                      {source}, {res.date.substring(0, res.date.indexOf('T'))},{' '}
                      <span className="ResponseCard-Score">
                        Score:{' '}
                        {Number(
                          Math.ceil(res.result_metadata.confidence * 100)
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  {/* <div className='ResponseCard-Score'>
                    Score: {Number(Math.ceil(res.score * 100))}
                  </div> */}
                  <a
                    className="ResponseCard-Link"
                    href={res.pdf_url || res.url || ''}
                    target={'_blank'}
                  >
                    {res.pdf_url || res.url || ''}
                  </a>
                  <div className="ResponseCard-Content">
                    {res.abstract || res.abstract_text || ''}
                  </div>
                  {res.author ? (
                    <div className="ResponseCard-Author">
                      Author(s): {res.author || 'undefined'}
                    </div>
                  ) : (
                    ''
                  )}
                  {/* <div className='ResponseCard-TechTerm'>
                    <span className='ResponseCard-TechTerm-Label'>
                      Technology Terms:
                    </span>
                  </div>
                  */}
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default ResponseContainer;
