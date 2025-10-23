const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const BASE_URL = 'https://graph.facebook.com/v24.0';

function getFirstAdAccount() {
    if (!fs.existsSync('ad_accounts.json')) {
        throw new Error('ad_accounts.json not found. Run the main script first to fetch ad accounts.');
    }

    const adAccountsData = JSON.parse(fs.readFileSync('ad_accounts.json', 'utf8'));
    
    if (!adAccountsData.data || adAccountsData.data.length === 0) {
        throw new Error('No ad accounts found in ad_accounts.json');
    }

    return adAccountsData.data[0];
}

async function fetchAdInsights(accessToken, adAccountId) {
    console.log(`Fetching insights for ad account: ${adAccountId}`);
    
    const response = await axios.get(`${BASE_URL}/${adAccountId}/insights`, {
        params: {
            access_token: accessToken,
            time_range: JSON.stringify({
                since: '2025-08-01',
                until: '2025-08-25'
            }),
            fields: [
                'spend',
                'clicks',
                'cpc',
                'purchase_roas',
                'actions'
            ].join(','),
            action_attribution_windows: ['7d_click', '1d_view']
        }
    });

    return response.data;
}

function calculateMetrics(insightsData) {
    if (!insightsData.data || insightsData.data.length === 0) {
        return {
            period: '01/08/2025 - 25/08/2025',
            forbrug: 0,
            revenue: 0,
            roas: 0,
            clicks: 0,
            cpc: 0
        };
    }

    let totalSpend = 0;
    let totalClicks = 0;
    let totalRevenue = 0;
    let totalRoas = 0;

    insightsData.data.forEach(insight => {
        totalSpend += parseFloat(insight.spend || 0);
        totalClicks += parseInt(insight.clicks || 0);
        
        if (insight.purchase_roas && insight.purchase_roas.length > 0) {
            totalRoas += parseFloat(insight.purchase_roas[0].value || 0);
        }

        if (insight.actions) {
            insight.actions.forEach(action => {
                if (action.action_type === 'purchase' && action.value) {
                    totalRevenue += parseFloat(action.value);
                }
            });
        }
    });

    const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const avgRoas = insightsData.data.length > 0 ? totalRoas / insightsData.data.length : 0;

    return {
        period: '01/08/2025 - 25/08/2025',
        forbrug: Math.round(totalSpend * 100) / 100,
        revenue: Math.round(totalRevenue * 100) / 100,
        roas: Math.round(avgRoas * 100) / 100,
        clicks: totalClicks,
        cpc: Math.round(avgCpc * 100) / 100
    };
}

function displayMetrics(adAccount, metrics) {
    console.log('\n=== AD ACCOUNT METRICS ===');
    console.log(`Account: ${adAccount.name} (${adAccount.id})`);
    console.log(`Currency: ${adAccount.currency || 'N/A'}`);
    console.log('\n--- Metrics for Period ---');
    console.log(`Period: ${metrics.period}`);
    console.log(`Forbrug (Ad Spend): ${metrics.forbrug} ${adAccount.currency || ''}`);
    console.log(`Revenue: ${metrics.revenue} ${adAccount.currency || ''}`);
    console.log(`ROAS: ${metrics.roas}`);
    console.log(`Clicks: ${metrics.clicks}`);
    console.log(`CPC: ${metrics.cpc} ${adAccount.currency || ''}`);
}

async function main() {
    const accessToken = process.env.FB_ACCESS_TOKEN;
    
    if (!accessToken) {
        console.error('Error: FB_ACCESS_TOKEN environment variable is not set.');
        process.exit(1);
    }

    try {
        const firstAdAccount = getFirstAdAccount();
        console.log(`Using first ad account: ${firstAdAccount.name} (${firstAdAccount.id})`);

        const insightsData = await fetchAdInsights(accessToken, firstAdAccount.id);
        const metrics = calculateMetrics(insightsData);
        
        displayMetrics(firstAdAccount, metrics);

        const outputFile = 'ad_metrics.json';
        const output = {
            adAccount: firstAdAccount,
            metrics: metrics,
            rawInsights: insightsData
        };
        
        fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
        console.log(`\nMetrics data saved to ${outputFile}`);
        
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