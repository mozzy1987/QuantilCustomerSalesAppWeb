const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const { centre, formData } = JSON.parse(event.body);

    // Create CSV content
    const csvContent = formData.map(row => row.join(',')).join('\n');
    const filePath = path.join('/tmp', `${centre}.csv`);

    try {
        fs.writeFileSync(filePath, csvContent);
        return {
            statusCode: 200,
            body: 'CSV file created successfully.',
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error saving CSV: ${error.message}`,
        };
    }
};
