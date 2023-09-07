// routes.js
const { Router } = require('express');
const {
    getPresignedUrl,
    listFilesFromBucket,
} = require('./cos.js');

const router = Router();

router.get('/:bucketName/files', async (req, res, next) => {
    const { bucketName } = req.params;

    try {
        const fileList = await listFilesFromBucket(bucketName);

        res.status(200).json({ files: fileList });
    } catch (e) {
        next(e);
    }
});

router.get('/:bucketName/files/:fileName/presigned/download', (req, res, next) => {
    res.locals.operation = 'getObject';

    next();
}, presignedController);

async function presignedController(req, res, next) {
    const { bucketName, fileName } = req.params;
    const { operation } = res.locals;

    try {
        const url = await getPresignedUrl(bucketName, fileName, operation);

        return res.status(200).json({ url });
    } catch(e) {
        next(e);
    }
}

module.exports = {bucketRoutes: router};
