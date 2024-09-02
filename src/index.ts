import { ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import type { S3Event } from "aws-lambda"
import dotenv from "dotenv"

dotenv.config()

const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION, SQS_QUEUE_URL } =
  process.env

console.log(`AWS ${AWS_ACCESS_KEY} ${AWS_SECRET_ACCESS_KEY} ${AWS_REGION}`)

const sqsClient = new SQSClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY as string,
    secretAccessKey: AWS_SECRET_ACCESS_KEY as string
  }
})

async function init() {
  const command = new ReceiveMessageCommand({
    QueueUrl: SQS_QUEUE_URL as string,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 15
  })

  while (true) {
    const { Messages } = await sqsClient.send(command)
    if (!Messages) {
      console.log("No Message Received")
      continue
    }
    try {
      for (const message of Messages) {
        const { Body, MessageId } = message

        console.log("Message Received =>", { Body, MessageId })

        if (!Body) continue
        //validate
        const event = JSON.parse(Body) as S3Event
        //Ignore the test event
        if ("Service" in event && "Event" in event) {
          if (event.Event === "s3:TestEvent") continue
        }

        for (const record of event.Records) {
          const { s3 } = record
          const {
            bucket,
            object: { key }
          } = s3
        }
      }
    } catch (error) {}
  }
}

init()
