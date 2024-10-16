// Load the CSV file and parse it
document.addEventListener('DOMContentLoaded', function () {
    Papa.parse('reserves.csv', {
        download: true,
        header: true,
        complete: function (results) {
            const data = results.data;
            populateCentreSelect(data);
        }
    });
});

// Populate the centre dropdown// Load CSV file and parse data
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

function populateCentreSelect(data) {
    const centreSelect = document.getElementById('centreSelect');
    const centres = Array.from(new Set(data.map(row => row.CENTRE).filter(Boolean))); // Unique Centres

    centres.forEach(centre => {
        const option = document.createElement('option');
        option.value = centre;
        option.textContent = centre;
        centreSelect.appendChild(option);
    });
}

// Filter centres based on input search
function filterCentres() {
    const input = document.getElementById('centreSearch').value.toLowerCase();
    const centreSelect = document.getElementById('centreSelect');
    
    Array.from(centreSelect.options).forEach(option => {
        option.style.display = option.value.toLowerCase().includes(input) ? '' : 'none';
    });
}

// Display data for the selected centre
function selectCentre() {
    const selectedCentre = document.getElementById('centreSelect').value;
    const reservesDataDiv = document.getElementById('reservesData');

    // Clear any previous data
    reservesDataDiv.innerHTML = '';

    Papa.parse('reserves.csv', {
        download: true,
        header: true,
        complete: function (results) {
            const data = results.data;

            // Filter rows by selected centre
            const filteredData = data.filter(row => row.CENTRE === selectedCentre);

            if (filteredData.length > 0) {
                filteredData.forEach(row => {
                    const reserveInfo = document.createElement('div');
                    reserveInfo.classList.add('reserve-info');
                    
                    // Display relevant columns
                    reserveInfo.innerHTML = `
                        <p><strong>Centre:</strong> ${row.CENTRE}</p>
                        <br>
                        <p><strong>8.5 Herb 8:</strong> ${row['8.5 Herb 8']}</p>
                        <p><strong>1L Herb 8:</strong> ${row['1L Herb 8']}</p>
                        <br>
                        <p><strong>Straw 9:</strong> ${row['Straw 9']}</p>
                        <p><strong>Straw 10:</strong> ${row['Straw 10']}</p>
                        <p><strong>Straw 11:</strong> ${row['Straw 11']}</p>
                        <p><strong>Straw 12:</strong> ${row['Straw 12']}</p>
                        <p><strong>Straw 13:</strong> ${row['Straw 13']}</p>
                        <p><strong>Straw 14:</strong> ${row['Straw 14']}</p>
                        <p><strong>Straw 15:</strong> ${row['Straw 15']}</p>
                        <p><strong>Straw 16:</strong> ${row['Straw 16']}</p>
                        <p><strong>Straw 17:</strong> ${row['Straw 17']}</p>
                        <p><strong>Straw 18:</strong> ${row['Straw 18']}</p>
                        <p><strong>Straw 19:</strong> ${row['Straw 19']}</p>
                        <p><strong>Straw 20:</strong> ${row['Straw 20']}</p>
                        <p><strong>Straw 21:</strong> ${row['Straw 21']}</p>
                        <p><strong>Straw 22:</strong> ${row['Straw 22']}</p>
                        <br>
                        <br>
                        <p><strong>8.5cm Straw 9:</strong> ${row['8.5cm Straw 9']}</p>
                        <p><strong>8.5cm Straw 10:</strong> ${row['8.5cm Straw 10']}</p>
                        <p><strong>8.5cm Straw 11:</strong> ${row['8.5cm Straw 11']}</p>
                        <p><strong>8.5cm Straw 12:</strong> ${row['8.5cm Straw 12']}</p>
                        <p><strong>8.5cm Straw 13:</strong> ${row['8.5cm Straw 13']}</p>
                        <p><strong>8.5cm Straw 14:</strong> ${row['8.5cm Straw 14']}</p>
                        <p><strong>8.5cm Straw 15:</strong> ${row['8.5cm Straw 15']}</p>
                        <p><strong>8.5cm Straw 16:</strong> ${row['8.5cm Straw 16']}</p>
                        <p><strong>8.5cm Straw 17:</strong> ${row['8.5cm Straw 17']}</p>
                        <p><strong>8.5cm Straw 18:</strong> ${row['8.5cm Straw 18']}</p>
                        <p><strong>8.5cm Straw 19:</strong> ${row['8.5cm Straw 19']}</p>
                        <p><strong>8.5cm Straw 20:</strong> ${row['8.5cm Straw 20']}</p>
                        <p><strong>8.5cm Straw 21:</strong> ${row['8.5cm Straw 21']}</p>
                        <p><strong>8.5cm Straw 22:</strong> ${row['8.5cm Straw 22']}</p>
                        <br>
                        <p><strong>SPEA 9:</strong> ${row['SPEA 9']}</p>
                        <p><strong>SPEA 10:</strong> ${row['SPEA 10']}</p>
                        <p><strong>SPEA 11:</strong> ${row['SPEA 11']}</p>
                        <p><strong>SPEA 12:</strong> ${row['SPEA 12']}</p>
                        <p><strong>SPEA 13:</strong> ${row['SPEA 13']}</p>
                        <p><strong>SPEA 14:</strong> ${row['SPEA 14']}</p>
                        <p><strong>SPEA 15:</strong> ${row['SPEA 15']}</p>
                        <p><strong>SPEA 16:</strong> ${row['SPEA 16']}</p>
                        <p><strong>SPEA 17:</strong> ${row['SPEA 17']}</p>
                        <p><strong>SPEA 18:</strong> ${row['SPEA 18']}</p>
                        <p><strong>SPEA 19:</strong> ${row['SPEA 19']}</p>
                        <br>
                        <p><strong>8.5cm S/Peas 10:</strong> ${row['8.5cm S/Peas 10']}</p>
                        <p><strong>8.5cm S/Peas 11:</strong> ${row['8.5cm S/Peas 11']}</p>
                        <p><strong>8.5cm S/Peas 12:</strong> ${row['8.5cm S/Peas 12']}</p>
                        <p><strong>8.5cm S/Peas 13:</strong> ${row['8.5cm S/Peas 13']}</p>
                        <p><strong>8.5cm S/Peas 14:</strong> ${row['8.5cm S/Peas 14']}</p>
                        <p><strong>8.5cm S/Peas 15:</strong> ${row['8.5cm S/Peas 15']}</p>
                        <p><strong>8.5cm S/Peas 16:</strong> ${row['8.5cm S/Peas 16']}</p>
                        <p><strong>8.5cm S/Peas 17:</strong> ${row['8.5cm S/Peas 17']}</p>
                        <p><strong>8.5cm S/Peas 18:</strong> ${row['8.5cm S/Peas 18']}</p>
                        <p><strong>8.5cm S/Peas 19:</strong> ${row['8.5cm S/Peas 19']}</p>
                        <br>
                        <p><strong>Grafted 14:</strong> ${row['Grafted 14']}</p>
                        <p><strong>Grafted 16:</strong> ${row['Grafted 16']}</p>
                        <p><strong>Grafted 18:</strong> ${row['Grafted 18']}</p>
                        <br>
                        <p><strong>Grafted Chilli 14:</strong> ${row['Grafted Chilli 14']}</p>
                        <p><strong>Grafted Chilli 16:</strong> ${row['Grafted Chilli 16']}</p>
                        <p><strong>Grafted Chilli 18:</strong> ${row['Grafted Chilli 18']}</p>
                        <br>
                        <p><strong>Dyna Chilli 15:</strong> ${row['Dyna Chilli 15']}</p>
                        <p><strong>Dyna Chilli 17:</strong> ${row['Dyna Chilli 17']}</p>
                        <br>
                        <p><strong>P/Bean 15:</strong> ${row['P/Bean 15']}</p>
                        <p><strong>P/Bean 17:</strong> ${row['P/Bean 17']}</p>
                        <p><strong>P/Bean 19:</strong> ${row['P/Bean 19']}</p>
                        <br>
                        <p><strong>Sweet Potato 17:</strong> ${row['Sweet Potato 17']}</p>
                        <p><strong>Heritage Tom 18:</strong> ${row['Heritage Tom 18']}</p>
                        <p><strong>Heritage Tom 20:</strong> ${row['Heritage Tom 20']}</p>
                        <br>
                        <p><strong>1L Veg 20:</strong> ${row['1L Veg 20']}</p>
                        <p><strong>1L Veg 22:</strong> ${row['1L Veg 22']}</p>
                        <br>
                        <p><strong>Autumn Strip:</strong> ${row['Autumn Strip']}</p>
                        <br>
                        <p><strong>Wildflower Week 12:</strong> ${row['Wildflower Week 12']}</p>                    
                    `;
                    reservesDataDiv.appendChild(reserveInfo);
                });
            } else {
                reservesDataDiv.innerHTML = '<p>No data found for the selected centre.</p>';
            }
        }
    });
}

// Clear search and reset dropdown
function clearSearch() {
    document.getElementById('centreSearch').value = '';
    document.getElementById('centreSelect').selectedIndex = 0;
    document.getElementById('reservesData').innerHTML = '';
}
