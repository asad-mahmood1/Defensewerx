require('dotenv').config({ path: 'server/.env' });
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.port || 8080;
const cors = require('cors');

const { bucketRoutes } = require('./routes.js');

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
app.use('/api/buckets', bucketRoutes);

const Discovery = require('ibm-watson/discovery/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const discoveryClient = new Discovery({
  authenticator: new IamAuthenticator({ apikey: '_bS88b3IHD6v5nNzvS5Rr0ZVxAe6bKCtXa5owf7b2NhA' }),
  version: '2020-08-30',
  url: 'https://api.us-east.discovery.watson.cloud.ibm.com/instances/ba1faef3-e1f0-4ae5-b658-808cb6a00346',
});

/*var ibm = require('ibm-cos-sdk');
var util = require('util');

var config = {
  endpoint: process.env.endpoint,
  apiKeyId: process.env.cosapi,
  serviceInstanceId: process.env.token,
  signatureVersion: 'iam',
};

var cos = new ibm.S3(config);*/

app.get('/search', function (req, res) {
  discoveryClient
    .query({
      projectId: '36df8991-2821-4edd-b00b-d5e946669669',
      collectionIds: [
        // USPTO
        '6a68c899-78de-1f84-0000-018898843003',
        // ARXIV 2
        'b2072fda-e81c-a94b-0000-01887dd6f2da',
        // DHS USE CASES - Lacking due to collection data needing cleaning.
        //'b2072fda-e81c-a94b-0000-01887d931593',
        // TECH CRUNCH - Lacking due to collection data needing cleaning.
        //'f9de9f28-d5aa-ac14-0000-0189ad90ddd1',
        // BLENDED COLLECTION - Lacking due to collection data needing cleaning.
        // '17706ef4-955e-78d3-0000-0187e72d9cb8',
      ],
      naturalLanguageQuery: req.query.search,
      count: 250,
    })
    .then((data) => {
      console.log(data.result.results);
      res.send(data.result.results);
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.get('/alert', function (req, res) {
//   function doCreateBucket() {
//     console.log('Creating bucket');
//     return cos
//       .getObject
//       .promise();
//   }
// discoveryClient
//   .query({
//     projectId: process.env.project,
//     collectionIds: [
//       // COS BUCKET
//       '0eb64dee-b000-d692-0000-01848c070862',
//       // ARXIV 2
//       'fb944183-5a80-9529-0000-01853204c4c2',
//       // DHS USE CASES - Lacking due to collection data needing cleaning.
//       // 'eeb89391-18a8-8d0f-0000-0187b8bed825',
//       // TECH CRUNCH - Lacking due to collection data needing cleaning.
//       // '63b8d97a-7e74-aecf-0000-01847dc50eaf',
//       // BLENDED COLLECTION - Lacking due to collection data needing cleaning.
//       // '17706ef4-955e-78d3-0000-0187e72d9cb8',
//     ],
//     naturalLanguageQuery: req.query.search,
//     count: 250,
//   })
//   .then((data) => {
//     console.log(data.result.results);
//     res.send(data.result.results);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// });

// const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// const API_KEY = process.env.api;

// function getToken(errorCallback, loadCallback) {
//   const req = new XMLHttpRequest();
//   req.addEventListener('load', loadCallback);
//   req.addEventListener('error', errorCallback);
//   req.open('POST', 'https://iam.cloud.ibm.com/identity/token');
//   req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//   req.setRequestHeader('Accept', 'application/json');
//   req.send(
//     'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + API_KEY
//   );
// }

// function apiPost(scoring_url, token, payload, loadCallback, errorCallback) {
//   const oReq = new XMLHttpRequest();
//   oReq.addEventListener('load', loadCallback);
//   oReq.addEventListener('error', errorCallback);
//   oReq.open('POST', scoring_url);
//   oReq.setRequestHeader('Accept', 'application/json');
//   oReq.setRequestHeader('Authorization', 'Bearer ' + token);
//   oReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
//   oReq.send(payload);
// }

// app.get('/search', function (req, res) {
//   console.log(req.query.search);
//   getToken(
//     (err) => console.log(err),
//     function () {
//       let tokenResponse;
//       try {
//         tokenResponse = JSON.parse(this.responseText);
//       } catch (ex) {
//         // TODO: handle parsing exception
//       }
//       // NOTE: manually define and pass the array(s) of values to be scored in the next line
//       const payload =
//         '{"input_data": [{"values": "' +
//         req.query.search +
//         '?", "fields": "question"}]}';
//       const scoring_url =
//         'https://us-south.ml.cloud.ibm.com/ml/v4/deployments/defensewerxdeployment/predictions?version=2023-04-24';
//       apiPost(
//         scoring_url,
//         tokenResponse.access_token,
//         payload,
//         function (resp) {
//           let parsedPostResponse;
//           try {
//             parsedPostResponse = JSON.parse(this.responseText);
//           } catch (ex) {
//             // TODO: handle parsing exception
//           }
//           // console.log('Scoring response' + req.query.search);
//           // console.log(parsedPostResponse);
//           // console.log(parsedPostResponse.predictions[0].values);
//           // console.log(parsedPostResponse.predictions[0].values);
//           res.send(parsedPostResponse.predictions[0].values);
//         },
//         function (error) {
//           console.log(error);
//         }
//       );
//     }
//   );
// });

app.listen(port, () => console.log(`Server is running on ${port}...`));
