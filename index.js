const querystring = require('querystring');
const _ = require('lodash');
const axios = require('axios');

const iopipe = require('@iopipe/iopipe')({
  token: process.env.IOPipeToken,
  enabled: !_.isNil(process.env.IOPipeToken)
});

const functions = {};

functions.generateResponse = (msgs) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml'
    },
    body: `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${_.join(msgs, '\n')}</Message></Response>`
  };
  return response;
};

functions.fetchCarrierInfo = async (phoneNumber) => {
  console.log(`fetchCarrierInfo(${phoneNumber})`);
  const result = await axios.get(`https://lookups.twilio.com/v1/PhoneNumbers/${phoneNumber}?Type=carrier&Type=caller-name`, {
    auth: {
      username: process.env.TwilioAccountSid,
      password: process.env.TwilioAuthToken
    }
  });
  return result.data;
};

functions.escapeXml = (text) => {
  const output = text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  return output;
};

exports.handler = iopipe(async (event, context, callback) => {
  // console.log(JSON.stringify(event));
  try {
    // Parse Twilio params.
    const twilioParams = querystring.parse(event.body);
    // console.log(JSON.stringify(twilioParams));

    // Fetch caller and carrier info
    const carrierInfo = await functions.fetchCarrierInfo(twilioParams.Body);
    // console.log(JSON.stringify(carrierInfo, null, 3));

    // Create response
    const msgs = [
      `${functions.escapeXml(carrierInfo.carrier.name)} - (${functions.escapeXml(carrierInfo.carrier.type)})`
    ];
    if (carrierInfo.caller_name.caller_name) {
      msgs.push(`${functions.escapeXml(carrierInfo.caller_name.caller_name)}`);
    }
    // console.log(JSON.stringify(msgs, null, 3));

    // Package Twilio response
    const response = functions.generateResponse(msgs);
    // console.log(response);

    return callback(null, response);
  }
  catch (err) {
    console.log(err);
    return callback(err, 'error');
  }
});
