const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const BASE_URL = 'https://graph.facebook.com/v24.0';

async function fetchAdAccounts(accessToken) {
    console.log('Fetching Facebook ad accounts...');
    
    const response = await axios.get(`${BASE_URL}/me/adaccounts`, {
        params: {
            access_token: accessToken,
            fields: [
                'id',
                'name',
                'account_status',
                'business_name',
                'currency',
                'timezone_name',
                'account_id',
                'business',
                'capabilities',
                'created_time',
                'funding_source'
            ].join(',')
        }
    });

    return response.data;
}

function displayAdAccounts(adAccountsData) {
    if (!adAccountsData.data || adAccountsData.data.length === 0) {
        console.log('No ad accounts found or no access granted.');
        return;
    }

    console.log(`\nFound ${adAccountsData.data.length} ad account(s):\n`);
    
    adAccountsData.data.forEach((account, index) => {
        console.log(`--- Ad Account ${index + 1} ---`);
        console.log(`ID: ${account.id}`);
        console.log(`Name: ${account.name}`);
        console.log(`Account ID: ${account.account_id}`);
        console.log(`Status: ${account.account_status}`);
        console.log(`Currency: ${account.currency}`);
        console.log(`Timezone: ${account.timezone_name}`);
        console.log(`Business: ${account.business_name || 'N/A'}`);
        console.log(`Created: ${account.created_time ? new Date(account.created_time).toLocaleDateString() : 'N/A'}`);
        
        if (account.capabilities && account.capabilities.length > 0) {
            console.log(`Capabilities: ${account.capabilities.join(', ')}`);
        }
        
        console.log('');
    });

    if (adAccountsData.paging) {
        console.log('Pagination info:');
        if (adAccountsData.paging.previous) {
            console.log('  Previous page available');
        }
        if (adAccountsData.paging.next) {
            console.log('  Next page available');
        }
    }
}

async function main() {
    const accessToken = process.env.FB_ACCESS_TOKEN;
    
    if (!accessToken) {
        console.error('Error: FB_ACCESS_TOKEN environment variable is not set.');
        process.exit(1);
    }

    try {
        const adAccountsData = await fetchAdAccounts(accessToken);
        displayAdAccounts(adAccountsData);
        
        const outputFile = 'ad_accounts.json';
        fs.writeFileSync(outputFile, JSON.stringify(adAccountsData, null, 2));
        console.log(`Ad accounts data saved to ${outputFile}`);
        
    } catch (error) {
        console.error('Application failed:', error.message);
        
        if (error.response?.data?.error) {
            const fbError = error.response.data.error;
            console.log('\nFacebook API Error Details:');
            console.log(`Code: ${fbError.code}`);
            console.log(`Type: ${fbError.type}`);
            console.log(`Message: ${fbError.message}`);
        }
        
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}