// Define product groups
const productGroupMap = {
    "8.5 Herb 8": 1,
    "1L Herb 8": 1,
    "Straw 9": 2,
    "Straw 10": 2,
    "Straw 11": 2,
    "Straw 12": 2,
    "Straw 13": 2,
    "Straw 14": 2,
    "Straw 15": 2,
    "Straw 16": 2,
    "Straw 17": 2,
    "Straw 18": 2,
    "Straw 19": 2,
    "Straw 20": 2,
    "Straw 21": 2,
    "Straw 22": 2,
    "8.5cm Straw 9": 3,
    "8.5cm Straw 10": 3,
    "8.5cm Straw 11": 3,
    "8.5cm Straw 12": 3,
    "8.5cm Straw 13": 3,
    "8.5cm Straw 14": 3,
    "8.5cm Straw 15": 3,
    "8.5cm Straw 16": 3,
    "8.5cm Straw 17": 3,
    "8.5cm Straw 18": 3,
    "8.5cm Straw 19": 3,
    "8.5cm Straw 20": 3,
    "8.5cm Straw 21": 3,
    "8.5cm Straw 22": 3,
    "SPEA 9": 4,
    "SPEA 10": 4,
    "SPEA 11": 4,
    "SPEA 12": 4,
    "SPEA 13": 4,
    "SPEA 14": 4,
    "SPEA 15": 4,
    "SPEA 16": 4,
    "SPEA 17": 4,
    "SPEA 18": 4,
    "SPEA 19": 4,
    "8.5cm S/Peas 10": 5,
    "8.5cm S/Peas 11": 5,
    "8.5cm S/Peas 12": 5,
    "8.5cm S/Peas 13": 5,
    "8.5cm S/Peas 14": 5,
    "8.5cm S/Peas 15": 5,
    "8.5cm S/Peas 16": 5,
    "8.5cm S/Peas 17": 5,
    "8.5cm S/Peas 18": 5,
    "8.5cm S/Peas 19": 5,
    "Grafted 14": 6,
    "Grafted 16": 6,
    "Grafted 18": 6,
    "Grafted Chilli 14": 7,
    "Grafted Chilli 16": 7,
    "Grafted Chilli 18": 7,
    "P/Bean 15": 8,
    "P/Bean 17": 8,
    "P/Bean 19": 8,
    "Sweet Potato 17": 9,
    "Heritage Tom 18": 10,
    "Heritage Tom 20": 10,
    "1L Veg 20": 11,
    "1L Veg 22": 11,
    "Autumn Strip": 12,
    "Wildflower Week 12": 13,
};

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

            // Get the group number for the current product
            const groupNumber = productGroupMap[product] || 0; // Default to group 0 if not found

            // Apply the correct color class based on the group number
            let rowClass;
            switch (groupNumber) {
                case 1:
                    rowClass = 'product-group1';
                    break;
                case 2:
                    rowClass = 'product-group2';
                    break;
                case 3:
                    rowClass = 'product-group3';
                    break;
                case 14:
                    rowClass = 'product-group14';
                    break;
                default:
                    rowClass = ''; // No class for undefined groups
            }
            row.classList.add(rowClass);

            // Create cells for product name, reserves, input, and buttons
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
            inputField.maxLength = 2; // Max 2 digits
            inputCell.appendChild(inputField);
            row.appendChild(inputCell);

            // Create buttons for "Full" and "Half"
            const buttonCell = document.createElement('td');
            const fullButton = document.createElement('button');
            fullButton.textContent = 'Full';
            fullButton.onclick = () => inputField.value = 30;
            const halfButton = document.createElement('button');
            halfButton.textContent = 'Half';
            halfButton.onclick = () => inputField.value = 15;

            buttonCell.appendChild(fullButton);
            buttonCell.appendChild(halfButton);
            row.appendChild(buttonCell);

            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 4; // Updated colspan to match new columns
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
