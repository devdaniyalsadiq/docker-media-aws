const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")
const path = require("node:path")
const fs = require("node:fs/promises")
const ffmpeg = require("fluent-ffmpeg")

const RESOLUTIONS = [
  { name: "360p", width: 480, height: 360 },
  { name: "480p", width: 858, height: 480 },
  { name: "720p", width: 1280, height: 720 }
]

async function transcoder(originalVideoPath, s3Client) {
  //transcoding the file
  const promises = RESOLUTIONS.map((resolution) => {
    const getMilliseconds = new Date().getMilliseconds()
    const output = `transcoded/video-${getMilliseconds}-${resolution.name}.mp4`

    return new Promise((resolve) => {
      ffmpeg(originalVideoPath)
        .output(output)
        .withVideoCodec("libx264")
        .withAudioCodec("aac")
        .withSize(`${resolution.width}x${resolution.height}`)
        .on("end", async () => {
          const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: output
          })

          await s3Client.send(command)
          console.log("File Uploaded SuccessfUlly")
          resolve(output)
        })
        .format("mp4")
        .run()
    })
  })

  await Promise.all(promises)
  process.exit(0)
}

async function downloadingFileFromS3(s3Client) {
  //downloading the file from s3
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: process.env.KEY
  })

  try {
    const result = await s3Client.send(command)
    console.log("result from getting file from s3 => ", result)
    if (!result) {
      throw new Error("Error while getting the file from s3")
    }

    const originalFilePath = "videos/main-video.mp4"
    await fs.writeFile(originalFilePath, result.Body)
    const originalVideoPath = path.resolve(originalFilePath)
    console.log("Original Video Path = > ", originalVideoPath)
    return originalVideoPath
  } catch (error) {
    console.error("Error while downloading the file s3", error.message)
  }
}

export const functions = { downloadingFileFromS3, transcoder }
