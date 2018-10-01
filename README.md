# Serverless Carrier Info

This project is for the Serverless Apps for Social Good Hackathon.

Law enforcement officers, fighting human trafficking, need an easy way to get a phone numbers caller ID and carrier info.

This Serverless App, with a Twilio integration, makes that possible.

This function is triggered by a Twilio webhook (via API Gateway).  

Example:
```
SENT:     4101238765
RECEIVED: (mobile) T-Mobile USA, Inc.
          FINDLEY RANDOLPH 
```

Deploy via the AWS Serverless Application Repo here: https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:132093761664:applications~Carrier-Info

## Twilio Account
First, we need to create a Twilio account and get the `Account SID` and `Auth Token`

Create your Twilio account here:
https://www.twilio.com/try-twilio

## Package and Deploy
Now it's time to create our Lambda function.

`npm run stack-up`

There is an output parameter called `ApiUrl` that you will need in the next step.  This will be your Twilio webhook url.

## Twillio Webhook Setup
Twilio needs to call our Lambda function every time it gets a message. 
- Click on the Products tab.
- Select the Programmable SMS box and hit Continue.
- Give your project a name.
- Invite teammates if you need to.
- Click the 'Get Started' button within the Programmable SMS box.
- Get a Twilio phone number.
- Navigate to your phone numbers:  https://www.twilio.com/console/phone-numbers/incoming
- Click on your number and scroll down to 'Messaging'
- Add your new `ApiUrl` from the previous step 'A message comes in' webhook.

[![](docs/webhook.png)](webhook.png)

## IOpipe
Serverless monitoring?

Click here to get your IOpipe token so you can monitor the performance of your Lambdas.  https://www.iopipe.com/

IOpipe use is optional.  If you don't want to use IOpipe then just leave the `IOPipeToken` param empty when deploying.