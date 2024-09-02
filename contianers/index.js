const { S3Client } = require("@aws-sdk/client-s3")
const { functions } = require("./functions")

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
})

async function init() {
  const originalVideoPath = await functions.downloadingFileFromS3(s3Client)
  await functions.transcoder(originalVideoPath, s3Client)
}

init()
