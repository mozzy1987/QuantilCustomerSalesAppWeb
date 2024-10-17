const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const path = require('path');

// Your OneDrive app credentials from Azure AD
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;
const redirectUri = 'https://localhost';  // Adjust as needed
const oneDriveFolder = '/path/to/onedrive/folder'; // Path to your OneDrive folder

// Get OAuth2 token for OneDrive
const getAccessToken = async () => {
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    
    const data = {
        client_id: clientId,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    };

    try {
        const response = await axios.post(tokenUrl, qs.stringify(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw new Error('Unable to authenticate with OneDrive.');
    }
};

// Upload file to OneDrive
const uploadFileToOneDrive = async (accessToken, csvContent, fileName) => {
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:${oneDriveFolder}/${fileName}:/content`;

    try {
        const response = await axios.put(uploadUrl, csvContent, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'text/csv'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file to OneDrive:', error.response.data);
        throw new Error('Failed to upload file to OneDrive.');
    }
};

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const { centre, formData } = JSON.parse(event.body);
    const fileName = `${centre}_reserves.csv`;
    const csvContent = formData.map(row => row.join(',')).join('\n');

    try {
        // Get access token for OneDrive
        const accessToken = await getAccessToken();

        // Upload CSV file to OneDrive
        const uploadResponse = await uploadFileToOneDrive(accessToken, csvContent, fileName);
        console.log('File uploaded successfully:', uploadResponse);

        return {
            statusCode: 200,
            body: 'File uploaded to OneDrive successfully.',
        };
    } catch (error) {
        console.error('Error in function:', error.message);
        return {
            statusCode: 500,
            body: `Error: ${error.message}`,
        };
    }
};
