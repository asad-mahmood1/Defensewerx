// const { S3, Credentials } = require('ibm-cos-sdk');
// const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fs = require('fs');
const IBMCOS = require('ibm-cos-sdk');


// dotenv.config();

// const cos = new S3({
//   endpoint: process.env.cos_endpoint,
//   apiKeyId: process.env.cos_apikey,
//   ibmAuthEndpoint: process.env.cos_ibm_auth_endpoint,
//   serviceInstanceId: process.env.cos_resource_instance_id,
//   credentials: new Credentials(
//     process.env.cos_access_key_id,
//     process.env.cos_secret_access_key,
//     null
//   ),
//   signatureVersion: 'v4'
// });
// const cos = new S3({
console.log('Init COS ...');  // dev
// console.log('__dirname:', __dirname);   // dev
// console.log('COS endpoint:', process.env.cos_endpoint);  // dev
const cos = new IBMCOS.S3({
  endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
//   endpoint: new IBMCOS.Endpoint(process.env.cos_endpoint),
  apiKeyId: 'sas7UVIvOiBZ4wZW10xJ_Q8FKYjyWXHD07ZvzkZBCv8h',
  ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
  serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/e9df4ab0fb964de69672d9a1a34567a1:724746b7-c866-4255-9586-68663aae6803::',
  signatureVersion: 'iam',
  s3ForcePathStyle: true
});


async function listFilesFromBucket(bucketName) {
    console.log('listFilesFromBucket running ...');  // dev
    const result = await cos.listObjects({
        Bucket: bucketName
    }).promise();

    if (result === null || result.Contents === null) {
        return [];
    }

    return result.Contents.map(object => object.Key);
}
exports.listFilesFromBucket = listFilesFromBucket;
// const fileList = await listFilesFromBucket(process.env.bucketName);
// console.log('fileList:', JSON.stringify(fileList, null, 2));  // dev

async function getPresignedUrl(bucket, fileName, operation) {

    console.log('getPresignedUrl running ...');  // dev

    const url = await cos.getSignedUrl(operation, {
        Bucket: bucket,
        Key: fileName,
    });

    return url;
}
exports.getPresignedUrl = getPresignedUrl;
// module.exports = {cos, listFilesFromBucket, getPresignedUrl}


function getItem(bucketName, itemName, callback) {
  console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
  return cos.getObject({
      Bucket: 'operationdragonflydevelopment-donotdelete-pr-d6s1sx3xos4xaw',
      Key: itemName
  }).promise()
  .then((data) => {
    if (data != null) {
      console.log('File Contents: ' + Buffer.from(data.Body).toString().substring(0, 800));
      callback(null, data.Body);
    }
  })
  .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
      callback(e);
  });
}
exports.getItem = getItem;


function getBucketContents(callback) {
    console.log(`Retrieving bucket contents from: ${bucketName}`);
    return cos.listObjects(
      {Bucket: bucketName},
    ).promise()
    .then((data) => {
      if (data != null && data.Contents != null) {
        for (var i = 0; i < data.Contents.length; i++) {
          var itemKey = data.Contents[i].Key;
          var itemSize = data.Contents[i].Size;
          console.log(`Item: ${itemKey} (${itemSize} bytes).`)
        }
        callback(null, data.Contents);
      }
    })
    .catch((err) => {
      console.error(`ERROR: ${err.code} - ${err.message}\n`);
      callback(err);
    });
}
exports.getBucketContents = getBucketContents;




// getBucketContents((err, result) => {
//   if (err) {
//     console.log('getBucketContents err = ' + err);
//   } else {
//     console.log('getBucketContents data.Contents = ' + JSON.stringify(result, null, 2));
//   }
// }); // dev

/*
const bucketName = process.env.bucketName;
const itemName = 'alerts.csv';
getItem(bucketName, itemName, (err, result) => {
  if (err) {
    console.log('getItem err:', err);
  } else {
    console.log('getItem done');

    // Write JSON to disk
    const data = JSON.stringify(result, null, 2);
    fs.writeFile('csv2jsonTest.json', data, (err) => {
      if (err) {
        console.log('fs.writeFile error:', err);
      } else {
        console.log('Data written to file');
      }
    });  // dev

  }
}); // dev
*/

