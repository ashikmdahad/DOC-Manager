const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();
const s3 = new S3Client({
  region: process.env.S3_REGION||'us-east-1',
  endpoint: process.env.S3_ENDPOINT||undefined,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE==='true',
  credentials: process.env.S3_ACCESS_KEY?{ accessKeyId:process.env.S3_ACCESS_KEY, secretAccessKey:process.env.S3_SECRET_KEY }:undefined
});
async function putObject(bucket,key,body,contentType){ await s3.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:body,ContentType:contentType})); return `s3://${bucket}/${key}`; }
async function signGet(bucket,key,expires=300){ const cmd=new GetObjectCommand({Bucket:bucket,Key:key}); return getSignedUrl(s3,cmd,{expiresIn:expires}); }
module.exports = { putObject, signGet };
