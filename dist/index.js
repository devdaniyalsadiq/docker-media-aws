"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_sqs_1 = require("@aws-sdk/client-sqs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION, SQS_QUEUE_URL } = process.env;
console.log(`AWS ${AWS_ACCESS_KEY} ${AWS_SECRET_ACCESS_KEY} ${AWS_REGION}`);
const sqsClient = new client_sqs_1.SQSClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const command = new client_sqs_1.ReceiveMessageCommand({
                QueueUrl: SQS_QUEUE_URL,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 15
            });
            while (true) {
                const { Messages } = yield sqsClient.send(command);
                if (!Messages) {
                    console.log("No Message Received");
                    continue;
                }
                for (const message of Messages) {
                    const { Body, MessageId } = message;
                    console.log("Message Received =>", { Body, MessageId });
                }
            }
        }
        catch (error) {
            console.log("Error while getting messsages from sqs - >", error.message);
        }
    });
}
init();
//# sourceMappingURL=index.js.map