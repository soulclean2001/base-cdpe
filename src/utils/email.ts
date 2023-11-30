import fs from 'fs'
import path from 'path'
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { envConfig } from '~/constants/config'

// Create SES service object.
const sesClient = new SESClient({
  region: envConfig.awsRegion,
  credentials: {
    secretAccessKey: envConfig.awsSecretAccessKey,
    accessKeyId: envConfig.awsAccessKeyId
  }
})

const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf8')
const emailEmptyTemplate = fs.readFileSync(path.resolve('src/templates/email-empty.html'), 'utf8')
const emailJobApplyTemplate = fs.readFileSync(path.resolve('src/templates/email-job-apply.html'), 'utf8')
const emailOrderSuccess = fs.readFileSync(path.resolve('src/templates/email-order-success.html'), 'utf8')

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
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

const sendVerifyEmail = (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: envConfig.sesFromAddress,
    toAddresses: toAddress,
    body,
    subject
  })
  return sesClient.send(sendEmailCommand)
}

export const sendEmail = (
  fromAddress: string = envConfig.sesFromAddress,
  toAddress: string,
  subject: string,
  body: string
) => {
  fromAddress = fromAddress ? fromAddress : envConfig.sesFromAddress
  let template = emailEmptyTemplate
  template = template.replace(/{{data}}/g, body)

  const sendEmailCommand = createSendEmailCommand({
    fromAddress: fromAddress,
    toAddresses: toAddress,
    body: template,
    subject: '[HFWorks]' + subject
  })
  return sesClient.send(sendEmailCommand)
}

export const sendEmailJobApply = (
  toAddress: string,
  data: {
    logo_user: string
    title: string
    company_name: string
    company_logo: string
    job_title: string
    salary: string
    working_location: string
    type_apply: string
    name: string
    message?: string
  },
  template: string = emailJobApplyTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    '[HFWorks]Thông báo ứng tuyển',
    template
      .replace(/{{logo_user}}/g, data.logo_user)
      .replace(/{{title}}/g, data.title)
      .replace(/{{name}}/g, data.name)
      .replace(/{{company_name}}/g, data.company_name)
      .replace(/{{company_logo}}/g, data.company_logo)
      .replace(/{{job_title}}/g, data.job_title)
      .replace(/{{salary}}/g, data.salary)
      .replace(/{{working_location}}/g, data.working_location)
      .replace(/{{type_apply}}/g, data.type_apply)
      .replace(/{{message}}/g, data.message || '')
  )
}

export const sendEmailOrderSuccess = (
  toAddress: string,
  data: {
    day: string
    month: string
    year: string
    order_code: string
    company_name: string
    data_services: string
    order_date: string
    order_status: string
    total: string
    total_has_vat: string
    to_money: string
    working_location: string
  },
  template: string = emailOrderSuccess
) => {
  return sendVerifyEmail(
    toAddress,
    '[HFWorks]Hóa đơn dịch vụ',
    template
      .replace(/{{day}}/g, data.day)
      .replace(/{{month}}/g, data.month)
      .replace(/{{year}}/g, data.year)
      .replace(/{{order_code}}/g, data.order_code)
      .replace(/{{company_name}}/g, data.company_name)
      .replace(/{{data_services}}/g, data.data_services)
      .replace(/{{order_date}}/g, data.order_date)
      .replace(/{{order_status}}/g, data.order_status)
      .replace(/{{total}}/g, data.total)
      .replace(/{{total_has_vat}}/g, data.total_has_vat)
      .replace(/{{to_money}}/g, data.to_money)
      .replace(/{{working_location}}/g, data.working_location)
  )
}

export const sendVerifyRegisterEmail = (
  toAddress: string,
  email_verify_token: string,
  template: string = verifyEmailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    '[HFWorks]Xác thực tài khoản',
    template
      .replace('{{title}}', 'Vui lòng xác thực email của bạn')
      .replace('{{content}}', 'Nhấp vào nút bên dưới để xác thực tài khoản')
      .replace('{{titleLink}}', 'Xác thực')
      .replace('{{link}}', `${envConfig.clientUrl}/email-verifications?token=${email_verify_token}`)
  )
}

export const sendForgotPasswordEmail = (
  toAddress: string,
  forgot_password_token: string,
  template: string = verifyEmailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    '[HFWorks]Quên mật khẩu',
    template
      .replace('{{title}}', 'Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu của mình')
      .replace('{{content}}', 'Nhấp vào nút bên dưới để đặt lại mật khẩu của bạn')
      .replace('{{titleLink}}', 'Đặt lại mật khẩu')
      .replace('{{link}}', `${envConfig.clientUrl}/forgot-password?token=${forgot_password_token}`)
  )
}