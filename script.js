let customers = []; // Declare the customers variable

// Function to load CSV data
function loadCSVData() {
    Papa.parse("customers.csv", {
        download: true,
        header: true,
        complete: function(results) {
            customers = results.data; // Assign parsed data to the customers variable
            console.log("Loaded customers data: ", customers); // Log loaded data
        },
        error: function(error) {
            console.error("Error loading CSV: ", error);
        }
    });
}

// Filter customers based on search input
function filterCustomers() {
    const searchInput = document.getElementById("customerSearch").value.trim().toLowerCase();
    const filteredCustomers = customers.filter(customer => 
        customer.Customer_Name && customer.Customer_Name.toLowerCase().includes(searchInput)
    );

    // Use a Set to collect unique customer names
    const uniqueCustomers = {};
    filteredCustomers.forEach(customer => {
        if (!uniqueCustomers[customer.Customer_Name]) {
            uniqueCustomers[customer.Customer_Name] = customer; // Store the customer object for further use
        }
    });

    // Update the dropdown with unique customer names
    const customerSelect = document.getElementById("customerSelect");
    customerSelect.innerHTML = '<option value="">Select a customer</option>'; // Clear previous options

    for (const customerName in uniqueCustomers) {
        const customer = uniqueCustomers[customerName];
        const option = document.createElement("option");
        option.value = customer.Account_Number; // Using Account Number as the value
        option.textContent = customer.Customer_Name; // Display Customer Name
        customerSelect.appendChild(option);
    }
}

// Function to load locations into the location dropdown
function loadLocations(selectedCustomer) {
    const locations = {};

    customers.forEach(customer => {
        if (customer.Account_Number === selectedCustomer) {
            const location = customer.Location;
            if (!locations[location]) {
                locations[location] = true; // Unique locations only
            }
        }
    });

    const locationSelect = document.getElementById("locationSelect");
    locationSelect.innerHTML = '<option value="">Select a location</option>'; // Clear previous options

    for (const location in locations) {
        const option = document.createElement("option");
        option.value = location; // Use the location as the value
        option.textContent = location; // Display the location
        locationSelect.appendChild(option);
    }
}

// Function to search for customer details
function searchCustomer() {
    const selectedAccountNumber = document.getElementById("customerSelect").value;

    if (!selectedAccountNumber) {
        document.getElementById("accountInfo").innerHTML = "Please select a customer.";
        document.getElementById("customerTableBody").innerHTML = ""; // Clear table
        return;
    }

    // Load locations based on the selected customer
    loadLocations(selectedAccountNumber);

    // Display Account Number and Customer Name at the top
    const accountInfo = customers.find(customer => customer.Account_Number === selectedAccountNumber);
    document.getElementById("accountInfo").innerHTML = `
        <p><strong>Account Number:</strong> ${accountInfo.Account_Number}</p>
        <p><strong>Customer Name:</strong> ${accountInfo.Customer_Name}</p>
    `;
}

// Function to show data based on selected location
function showDataForLocation() {
    const selectedAccountNumber = document.getElementById("customerSelect").value;
    const selectedLocation = document.getElementById("locationSelect").value;

    if (!selectedAccountNumber || !selectedLocation) {
        document.getElementById("customerTableBody").innerHTML = ""; // Clear table
        return;
    }

    const filteredCustomers = customers.filter(customer => 
        customer.Account_Number === selectedAccountNumber && customer.Location === selectedLocation
    );

    if (filteredCustomers.length === 0) {
        document.getElementById("customerTableBody").innerHTML = "No data found for this location.";
        return;
    }

    // Combine data for totals and volume by invoice group
    const combinedData = {};

    filteredCustomers.forEach(customer => {
        const invoiceGroup = customer.Invoice_Group;

        if (!combinedData[invoiceGroup]) {
            combinedData[invoiceGroup] = {
                Total: 0,
                Volume: 0,
            };
        }

        combinedData[invoiceGroup].Total += parseFloat(customer.Total); // Sum totals
        combinedData[invoiceGroup].Volume += parseInt(customer.Volume); // Sum volumes
    });

    // Build the table body for the selected customer and location
    let tableBody = "";
    for (const invoiceGroup in combinedData) {
        const data = combinedData[invoiceGroup];
        tableBody += `
            <tr>
                <td>${invoiceGroup}</td>
                <td>£${data.Total.toFixed(2)}</td>
                <td>${data.Volume}</td>
            </tr>
        `;
    }

    document.getElementById("customerTableBody").innerHTML = tableBody;
}

// Clear search function
function clearSearch() {
    document.getElementById("customerSearch").value = "";
    document.getElementById("customerSelect").innerHTML = '<option value="">Select a customer</option>'; // Clear dropdown
    document.getElementById("locationSelect").innerHTML = '<option value="">Select a location</option>'; // Clear location dropdown
    document.getElementById("accountInfo").innerHTML = ""; // Clear account info
    document.getElementById("customerTableBody").innerHTML = ""; // Clear table
}

// Function to select a customer from the dropdown
function selectCustomer() {
    const selectedAccountNumber = document.getElementById("customerSelect").value;

    if (selectedAccountNumber) {
        // Call searchCustomer with the selected account number
        searchCustomer();
    }
}

// Function to select a location from the dropdown
function selectLocation() {
    showDataForLocation();
}

// Load CSV data when the page loads
window.onload = loadCSVData;
