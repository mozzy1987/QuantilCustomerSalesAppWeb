// Load CSV file and parse data
const loadCSVData = async () => {
    const response = await fetch('reserves.csv'); // Ensure the CSV file is in the same directory
    const data = await response.text();
    return parseCSV(data);
};

// Parse CSV data
const parseCSV = (data) => {
    const lines = data.split('\n').map(line => line.trim()).filter(line => line);
    const result = [];
    const headers = lines[0].split(',').map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j] ? currentLine[j].trim() : '';
        }
        result.push(obj);
    }
    return result;
};

// Filter and display data based on selected centre
const filterCentre = () => {
    const selectedCentre = document.getElementById('centreSelect').value;
    const tableBody = document.getElementById('orderTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing data

    if (!selectedCentre) {
        return; // Exit if no centre is selected
    }

    const filteredData = reserves.filter(reserve => reserve.CENTRE === selectedCentre);

    if (filteredData.length > 0) {
        const productHeaders = Object.keys(filteredData[0]).filter(key => key !== 'CENTRE');

        productHeaders.forEach((product) => {
            const row = document.createElement('tr');

            const productCell = document.createElement('td');
            productCell.textContent = product; 
            row.appendChild(productCell);

            const reservesCell = document.createElement('td');
            reservesCell.textContent = filteredData[0][product] ? filteredData[0][product] : 0; 
            row.appendChild(reservesCell);

            const inputCell = document.createElement('td');
            const inputField = document.createElement('input');
            inputField.type = 'number';
            inputField.placeholder = "Enter amount"; 
            inputCell.appendChild(inputField);
            row.appendChild(inputCell);

            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 3; 
        noDataCell.textContent = "No data available for the selected centre.";
        row.appendChild(noDataCell);
        tableBody.appendChild(row);
    }
};

// Load and display centres and data on page load
let reserves = [];
window.onload = async () => {
    reserves = await loadCSVData();
    populateCentreDropdown();
};

const populateCentreDropdown = () => {
    const centreSelect = document.getElementById('centreSelect');
    const uniqueCentres = [...new Set(reserves.map(reserve => reserve.CENTRE))];

    uniqueCentres.forEach(centre => {
        const option = document.createElement('option');
        option.value = centre;
        option.textContent = centre;
        centreSelect.appendChild(option);
    });
};

// Function to send input data as CSV to Google Drive
const uploadCSV = async () => {
    const tableBody = document.getElementById('orderTable').querySelector('tbody');
    let csvContent = "Product,2024 Reserves,2025 Reserves\n"; 

    Array.from(tableBody.rows).forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const product = cells[0].textContent;
            const reserves2024 = cells[1].textContent;
            const reserves2025 = cells[2].querySelector('input').value || ''; 
            csvContent += `${product},${reserves2024},${reserves2025}\n`; 
        }
    });

    const response = await fetch('http://localhost:3000/upload-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ csvData: csvContent, fileName: 'order_data.csv' })
    });

    if (response.ok) {
        alert('CSV uploaded successfully!');
    } else {
        alert('Failed to upload CSV.');
    }
};

// Add event listener to the button
document.getElementById('sendEmailButton').addEventListener('click', uploadCSV);
