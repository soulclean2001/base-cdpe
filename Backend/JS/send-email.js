/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { SendEmailCommand, SESClient } = require('@aws-sdk/client-ses')
const { config } = require('dotenv')

config()
// Create SES service object.
const sesClient = new SESClient({
  region: 'ap-southeast-1',
  credentials: {
    secretAccessKey: '',
    accessKeyId: ''
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendVerifyEmail = async (toAddress, subject, body) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: 'hirosaki217@gmail.com',
    toAddresses: toAddress,
    body,
    subject
  })

  try {
    return await sesClient.send(sendEmailCommand)
  } catch (e) {
    console.error('Failed to send email.', e)
    return e
  }
}

sendVerifyEmail('freedisable@gmail.com', 'Xác thực tài khoản', '<h1>Xác minh ứng dụng web của bạn</h1>')
