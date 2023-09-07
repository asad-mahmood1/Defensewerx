const { S3, Credentials } = require('ibm-cos-sdk');
const dotenv = require('dotenv');

dotenv.config();

const cos = new S3({
  endpoint: process.env.cos_endpoint,
  apiKeyId: process.env.cos_apikey,
  ibmAuthEndpoint: process.env.cos_ibm_auth_endpoint,
  serviceInstanceId: process.env.cos_resource_instance_id,
  credentials: new Credentials(
    process.env.cos_access_key_id,
    process.env.cos_secret_access_key,
    null
  ),
  signatureVersion: 'v4'
});

async function listFilesFromBucket(bucketName) {
    const result = await cos.listObjects({
        Bucket: bucketName
    }).promise();

    if (result === null || result.Contents === null) {
        return [];
    }

    return result.Contents.map(object => object.Key);
}

async function getPresignedUrl(bucket, fileName, operation) {
    const url = await cos.getSignedUrl(operation, {
        Bucket: bucket,
        Key: fileName,
    });

    return url;
}

module.exports = {cos, listFilesFromBucket, getPresignedUrl}
