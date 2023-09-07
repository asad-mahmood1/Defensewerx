// bucketCorsConfig.js
import { cos } from './cos';
import dotenv from 'dotenv';

dotenv.config();

async function enableCorsRequests(bucketName) {
    try {
        const data = await cos.putBucketCors({
            Bucket: bucketName,
            CORSConfiguration: {
                CORSRules: [
                    {
                        'AllowedMethods': ['PUT'],
                        'AllowedOrigins': ['*'],
                        'AllowedHeaders': ['*'],
                        'ExposeHeaders': ['Etag']
                    }
                ],
            }
        }).promise();
    } catch(e) {
        console.error(`[OBJECT STORAGE] ERROR: ${e.code} - ${e.message}\n`);
        return false;
    }

    console.log(`[OBJECT STORAGE] Configured CORS for ${bucketName}`);
    return true;
}

enableCorsRequests('operationdragonflydevelopment-donotdelete-pr-d6s1sx3xos4xaw');
bucketName = process.env.bucketName;

module.exports = bucketName;
