// routes.js
const { Router } = require('express');
// const {
//     getPresignedUrl,
//     listFilesFromBucket,
// } = require('./cos.js');


const async = require('async');
const cos = require('./cos.js');
const Discovery = require('ibm-watson/discovery/v2');
const fs = require('fs');
const { IamAuthenticator } = require('ibm-watson/auth');
const { parse } = require('fast-csv');  // stream CSV reader
const { Readable } = require('stream');
const router = Router();

router.get('/alert', (req, res) => {
// router.get('/:bucketName/files/:fileName', (req, res) => {
// function getFileName(bucketName, fileName, callback) {
  // const { bucketName, fileName } = req.params;
  let bucketName = 'operationdragonflydevelopment-donotdelete-pr-d6s1sx3xos4xaw';
  let fileName = 'alerts.csv';

  console.log('req.params.bucketName:', bucketName);  // dev
  console.log('req.params.fileName:', fileName);  // dev

  // const bucketName = process.env.bucketName;
  // const fileName = 'alerts.csv';
  let dataBody = [];  // CSV contents in a buffer I believe
  let dataObj = []; //  CSV contents changed to an object

  async.series([

    (callback) => {
      // Placeholder
      callback();
    }
    , (callback) => {
      cos.getItem(bucketName, fileName, (err, result) => {    // "result" contains JSON from CSV
        if (err) {
          console.log('getItem err:', err);
          callback(err);
        } else {
          console.log('getItem done');
          dataBody = result;
          callback();
        }
      });
    }
    , (callback) => {
      // Convert CSV to an object/JSON
      const stream = Readable.from(dataBody);
      readCsv(stream, (err, result) => {
        if (err) {
          console.log('readCsv error:', err);
          callback(err);
        } else {
          // console.log('readCsv result:', JSON.stringify(result, null, 2));
          console.log('readCsv result:', JSON.stringify(result, null, 2).substring(0, 800));
          dataObj = result;
          callback();
        }
      });
    }
    /*
    , (callback) => {
      // Write JSON to disk
      const data = JSON.stringify(result, null, 2);
      fs.writeFile('csv2jsonTest.json', data, (err) => {
        if (err) {
          console.log('fs.writeFile error:', err);
          callback(err);
        } else {
          console.log('Data written to file');
          callback();
        }
      });  // dev
    }
    */
    , (callback) => {
      // Placeholder
      callback();
    }
  ], (err) => {
    if (err) {
      console.log('/GET /:bucketName/files/:fileName error:', err);
      res.json(err);
    } else {
      console.log('/GET /:bucketName/files/:fileName done');
      res.json(dataObj);
    }
  });
});
// }


// const bucketName = process.env.bucketName;
// const fileName = 'alerts.csv';
// getFileName(bucketName, fileName, (err, result) => {
//   if (err) {
//     console.log('getFileName error:', err);
//   } else {
//     console.log('getFileName result:', JSON.stringify(result, null, 2));
//   }
// }); // dev

const discoveryClient = new Discovery({
    authenticator: new IamAuthenticator({ apikey: '_bS88b3IHD6v5nNzvS5Rr0ZVxAe6bKCtXa5owf7b2NhA' }),
    // authenticator: new IamAuthenticator({ apikey: 'C7AsMLQoLA44GypizMAjfAfKOT_6eX9PiBU-5cVRvEPI' }),
    version: '2020-08-30',
    url: 'https://api.us-east.discovery.watson.cloud.ibm.com/instances/ba1faef3-e1f0-4ae5-b658-808cb6a00346',
});


// router.get('/:bucketName/files', async (req, res, next) => {
router.get('/:bucketName/files', async (req, res, next) => {
    const { bucketName } = req.params;
    console.log('GET /:bucketName/files requested ...');    // dev
    try {
        const fileList = await cos.listFilesFromBucket(bucketName);
        res.status(200).json({ files: fileList });
    } catch (e) {
        next(e);
    }
});

router.get('/:bucketName/files/:fileName/presigned/download', (req, res, next) => {
    res.locals.operation = 'getObject';

    console.log('GET /:bucketName/files/:fileName/presigned/download requested ...');    // dev

    next();
}, presignedController);

async function presignedController(req, res, next) {
    const { bucketName, fileName } = req.params;
    const { operation } = res.locals;

    console.log('presignedController running ...');    // dev

    try {
        const url = await cos.getPresignedUrl(bucketName, fileName, operation);
        return res.status(200).json({ url });
    } catch(e) {
        next(e);
    }
}




router.get('/search', function (req, res) {
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


function readCsv(csvContent, callback) {
  let rows = [];

  csvContent
  .pipe(parse({ headers: true }))
  .on('data', row => {
      // console.log(row);
      //each row can be written to db
      rows.push(row);
  })
  .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows`);
      callback(null, rows);
  })
  .on('error', error => {
    console.error('readCsv error:', error);
    callback(err);
  });
}

// module.exports = {bucketRoutes: router};
module.exports = router;

