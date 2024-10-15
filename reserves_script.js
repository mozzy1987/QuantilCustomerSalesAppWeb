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

// Populate the centre dropdown
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
                        <p><strong>8.5 Herb 8:</strong> ${row['8.5 Herb 8']}</p>
                        <p><strong>1L Herb 8:</strong> ${row['1L Herb 8']}</p>
                        <p><strong>Total Trays:</strong> ${row['Total Trays']}</p>
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
                        <p><strong>Total Trays (Straw):</strong> ${row['Total Trays']}</p>
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
                        <p><strong>Grafted 14:</strong> ${row['Grafted 14']}</p>
                        <p><strong>Grafted 16:</strong> ${row['Grafted 16']}</p>
                        <p><strong>Grafted 18:</strong> ${row['Grafted 18']}</p>
                        <p><strong>Grafted Chilli 14:</strong> ${row['Grafted Chilli 14']}</p>
                        <p><strong>Grafted Chilli 16:</strong> ${row['Grafted Chilli 16']}</p>
                        <p><strong>Grafted Chilli 18:</strong> ${row['Grafted Chilli 18']}</p>
                        <p><strong>Dyna Chilli 15:</strong> ${row['Dyna Chilli 15']}</p>
                        <p><strong>Dyna Chilli 17:</strong> ${row['Dyna Chilli 17']}</p>
                        <p><strong>P/Bean 15:</strong> ${row['P/Bean 15']}</p>
                        <p><strong>P/Bean 17:</strong> ${row['P/Bean 17']}</p>
                        <p><strong>P/Bean 19:</strong> ${row['P/Bean 19']}</p>
                        <p><strong>Sweet Potato 17:</strong> ${row['Sweet Potato 17']}</p>
                        <p><strong>Heritage Tom 18:</strong> ${row['Heritage Tom 18']}</p>
                        <p><strong>Heritage Tom 20:</strong> ${row['Heritage Tom 20']}</p>
                        <p><strong>1L Veg 20:</strong> ${row['1L Veg 20']}</p>
                        <p><strong>1L Veg 22:</strong> ${row['1L Veg 22']}</p>
                        <p><strong>Autumn Strip:</strong> ${row['Autumn Strip']}</p>
                        <p><strong>Total Pots:</strong> ${row['Total Pots']}</p>
                        <p><strong>Wildflower Week 12:</strong> ${row['Wildflower Week 12']}</p>
                        <!-- Add more columns as needed -->
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
