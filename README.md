# Facebook Ad Accounts Fetcher

A simple Node.js application to fetch all available Facebook ad accounts using the Facebook Graph API.

## Prerequisites

1. **Facebook Developer Account**: You need a Facebook Developer account and an app with the necessary permissions
2. **Access Token**: You need a Facebook access token with `ads_read` permission
3. **Node.js**: Make sure you have Node.js installed on your system

## Required Facebook Permissions

Your access token must have the following permissions:
- `ads_read` - To read ad account information

## Installation

1. **Clone or navigate to the project directory**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your access token**:
   - Open the `.env` file
   - Replace `your_facebook_access_token_here` with your actual Facebook access token
   ```
   FB_ACCESS_TOKEN=your_actual_facebook_access_token
   ```

## Usage

Run the application:
```bash
npm start
```

or

```bash
node index.js
```

## What the Application Does

The application will:
1. Use your Facebook access token to authenticate with the Graph API
2. Fetch all ad accounts you have access to
3. Display detailed information about each ad account including:
   - Account ID and Name
   - Account Status
   - Currency and Timezone
   - Business Name
   - Capabilities
   - Creation Date
4. Save the raw JSON response to `ad_accounts.json` file

## Sample Output

```
🔍 Fetching Facebook ad accounts...

✅ Found 2 ad account(s):

--- Ad Account 1 ---
ID: act_1234567890
Name: My Business Ad Account
Account ID: 1234567890
Status: 1
Currency: USD
Timezone: America/New_York
Business: My Business Inc
Created: 1/15/2023
Capabilities: CAN_USE_REACH_AND_FREQUENCY, CAN_USE_BRAND_SAFETY

--- Ad Account 2 ---
ID: act_0987654321
Name: Test Ad Account
Account ID: 0987654321
Status: 1
Currency: EUR
Timezone: Europe/London
Business: N/A
Created: 3/10/2023
Capabilities: CAN_USE_REACH_AND_FREQUENCY

💾 Ad accounts data saved to ad_accounts.json
```

## Error Handling

The application includes comprehensive error handling for common issues:

- **Missing Access Token**: Clear message if `.env` file is not properly configured
- **Invalid Token**: Helpful suggestions for token-related errors
- **Permission Errors**: Guidance on required permissions
- **API Rate Limits**: Proper error messages for API limitations

## Common Error Codes

- **190**: Access token expired or invalid
- **200**: Permission denied - check if your token has `ads_read` permission
- **100**: Invalid parameter - check your API request format

## Getting a Facebook Access Token

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create or select your app
3. Go to Tools & Support > Graph API Explorer
4. Select your app and generate a token with `ads_read` permission
5. For production use, implement proper OAuth flow

## Security Notes

- Never commit your `.env` file to version control
- Keep your access token secure and rotate it regularly
- Use short-lived tokens in production and implement proper token refresh logic

## API Endpoint Used

This application uses the Facebook Graph API endpoint:
```
GET /v18.0/me/adaccounts
```

## File Structure

```
├── index.js          # Main application file
├── package.json      # Node.js dependencies and scripts
├── .env             # Environment variables (your access token)
├── .gitignore       # Git ignore file
├── README.md        # This file
└── ad_accounts.json # Output file (generated after running)
```

## Dependencies

- **axios**: HTTP client for making API requests
- **dotenv**: Load environment variables from `.env` file

## Troubleshooting

1. **"FB_ACCESS_TOKEN environment variable is not set"**
   - Make sure you have a `.env` file in the project root
   - Ensure the token is properly set without quotes

2. **"Permission denied"**
   - Check if your access token has the `ads_read` permission
   - Verify your app has been approved for the necessary permissions

3. **"No ad accounts found"**
   - Your access token might not have access to any ad accounts
   - Check if you're using the correct Facebook account

For more information, refer to the [Facebook Marketing API documentation](https://developers.facebook.com/docs/marketing-api/).