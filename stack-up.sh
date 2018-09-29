# Install production dependencies.
rm -Rf node_modules
npm install --production

# Package the CloudFormation script.
aws cloudformation package \
--template-file stack.yml \
--output-template-file stack-output.yml \
--s3-bucket serverless-carrier-info

# Deploy the CloudFormation script.
aws cloudformation deploy \
--template-file stack-output.yml \
--stack-name serverless-carrier-info \
--capabilities CAPABILITY_IAM \
--parameter-overrides \
TwilioAccountSid=$1 \
TwilioAuthToken=$2 \
IOPipeToken=$3

# Show the CloudFormation output params.
aws cloudformation describe-stacks  \
--stack-name serverless-carrier-info

# Add dev dependencies back
npm install