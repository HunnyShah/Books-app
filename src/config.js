export const awsConfig = {
  region: "us-east-1", // Your region
  apiGateway: {
    REGION: "us-east-1", // Your region
    URL: "YOUR_API_GATEWAY_URL", // From API Gateway deployment
  },
  cognito: {
    REGION: "us-east-1", // Your region
    USER_POOL_ID: "YOUR_USER_POOL_ID", // From Cognito setup
    APP_CLIENT_ID: "YOUR_APP_CLIENT_ID", // From Cognito setup
    IDENTITY_POOL_ID: "YOUR_IDENTITY_POOL_ID", // From Cognito setup
  },
};
