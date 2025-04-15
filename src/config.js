export const awsConfig = {
  region: "us-east-1", // Your region
  apiGateway: {
    REGION: "us-east-1", // Your region
    URL: "https://nit6ve4jb5.execute-api.us-east-1.amazonaws.com/prod", // From API Gateway deployment
  },
  cognito: {
    REGION: "us-east-1", // Your region
    USER_POOL_ID: "us-east-1_dr6rjrXhV", // From Cognito setup
    APP_CLIENT_ID: "52cskvkc5dm5ss23oudsf6hvgj", // From Cognito setup
    IDENTITY_POOL_ID: "us-east-1:7e39a937-8d94-403c-a1fb-e9836ba19aa8", // From Cognito setup
  },
};
