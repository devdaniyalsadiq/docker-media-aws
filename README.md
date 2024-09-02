Media Processing Architecture
This repository contains the architecture and implementation details of our media processing pipeline. The system is designed to efficiently process media files uploaded by users, leveraging AWS S3, SQS, Node.js, and FFmpeg in a Dockerized environment.

Overview
The architecture can be summarized as follows:

Temporary Storage:

Users upload their media files (up to 100MB) to a temporary S3 bucket named Temp.
Message Queueing:

Once the file is uploaded, an event is triggered, and a message is sent to an SQS queue. This queue is responsible for handling the processing requests asynchronously.
Polling and Processing:

A set of Node.js workers continuously poll the SQS queue for new messages. Upon receiving a message, the workers start the validation process.
Validation and Processing:

After validation, the Node.js workers trigger a Docker container running FFmpeg. The media file is downloaded into the container for processing.
FFmpeg processes the file according to the specified requirements. After processing, the FFmpeg container is terminated (Kill operation).
Upload to Production:

The processed media file is uploaded to the production S3 bucket named production for further use.
Components
1. AWS S3 (Temporary and Production Buckets)
Temp Bucket: Used for temporary storage of user-uploaded media files. Files should not exceed 100MB.
Production Bucket: Used to store the final processed media files after they have been validated and processed by FFmpeg.
2. AWS SQS (Simple Queue Service)
Handles the queuing of processing requests. Ensures that each media file is processed in an asynchronous manner, allowing the system to scale.
3. Node.js Workers
Poll the SQS queue for new processing requests.
Validate the incoming media files.
Trigger the FFmpeg processing inside a Docker container.
4. Docker and FFmpeg
Dockerized FFmpeg is used for processing the media files.
Once processing is complete, the container is terminated.
Prerequisites
Before running this system, ensure you have the following installed:

Node.js (v14 or later)
Docker
AWS CLI configured with appropriate permissions for S3 and SQS
FFmpeg installed inside the Docker container
