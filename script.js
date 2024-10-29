let customers = [];

// Function to load customers CSV data
function loadCustomersData() {
    Papa.parse("customers.csv", {
        download: true,
        header: true,
        complete: function(results) {
            customers = results.data;
            console.log("Loaded customers data: ", customers);
        },
        error: function(error) {
            console.error("Error loading customers CSV: ", error);
        }
    });
}

// Filter customers based on search input
function filterCustomers() {
    const searchInput = document.getElementById("customerSearch").value.trim().toLowerCase();
    const filteredCustomers = customers.filter(customer => 
        customer.Customer_Name && customer.Customer_Name.toLowerCase().includes(searchInput)
    );

    const customerSelect = document.getElementById("customerSelect");
    customerSelect.innerHTML = '<option value="">Select a customer</option>';

    const uniqueCustomerNames = [...new Set(filteredCustomers.map(c => c.Customer_Name))];
    uniqueCustomerNames.forEach(customer => {
        const option = document.createElement("option");
        option.value = customer;
        option.textContent = customer;
        customerSelect.appendChild(option);
    });
}

// Populate location dropdown based on selected customer
function selectCustomer() {
    const selectedCustomerName = document.getElementById("customerSelect").value;
    const locationSelect = document.getElementById("locationSelect");
    locationSelect.innerHTML = '<option value="">Select a location</option>';

    const filteredLocations = customers
        .filter(customer => customer.Customer_Name === selectedCustomerName)
        .map(customer => customer.Location);

    const uniqueLocations = [...new Set(filteredLocations)];
    uniqueLocations.forEach(location => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });

    // Clear previously displayed details
    document.getElementById("accountInfo").innerHTML = "";
    document.getElementById("customerTableBody").innerHTML = "";
}

// Display customer data based on selected location
function showDataForLocation() {
    const selectedCustomerName = document.getElementById("customerSelect").value;
    const selectedLocation = document.getElementById("locationSelect").value;

    if (!selectedCustomerName || !selectedLocation) {
        document.getElementById("customerTableBody").innerHTML = "";
        return;
    }

    const filteredCustomers = customers.filter(customer => 
        customer.Customer_Name === selectedCustomerName && customer.Location === selectedLocation
    );

    const combinedData = {};

    filteredCustomers.forEach(customer => {
        const invoiceGroup = customer.Invoice_Group;

        if (!combinedData[invoiceGroup]) {
            combinedData[invoiceGroup] = { Total: 0, Volume: 0 };
        }

        combinedData[invoiceGroup].Total += parseFloat(customer.Total);
        combinedData[invoiceGroup].Volume += parseInt(customer.Volume);
    });

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

// Show customer and contact details
function showCustomerDetails() {
    const selectedCustomerName = document.getElementById("customerSelect").value;
    const customerDetailsDiv = document.getElementById("customerDetails");

    if (!selectedCustomerName) {
        customerDetailsDiv.innerHTML = "<p>Please select a customer to view details.</p>";
        customerDetailsDiv.style.display = "block";
        return;
    }

    const selectedCustomer = customers.find(customer => customer.Customer_Name === selectedCustomerName);
    const selectedContact = contacts.find(contact => 
        contact["Customer Name"] === selectedCustomerName
    );

    if (selectedCustomer && selectedContact) {
        customerDetailsDiv.innerHTML = `
            <h3>Customer Details</h3>
            <p><strong>Customer Name:</strong> ${selectedCustomer.Customer_Name}</p>
            <p><strong>Location:</strong> ${selectedCustomer.Location}</p>
            <p><strong>Invoice Group:</strong> ${selectedCustomer.Invoice_Group}</p>
            <p><strong>Total Spend:</strong> £${parseFloat(selectedCustomer.Total).toFixed(2)}</p>
            <p><strong>Volume:</strong> ${selectedCustomer.Volume}</p>

            <h3>Contact Details</h3>
            <p><strong>Contact Name:</strong> ${selectedContact["Contact Name"]}</p>
            <p><strong>Address Line 1:</strong> ${selectedContact["Address Line 1"]}</p>
            <p><strong>Address Line 2:</strong> ${selectedContact["Address Line 2"] || ''}</p>
            <p><strong>Town:</strong> ${selectedContact["Address Town"]}</p>
            <p><strong>County:</strong> ${selectedContact["Address County"]}</p>
            <p><strong>Postcode:</strong> ${selectedContact["Address Postcode"]}</p>
            <p><strong>Telephone:</strong> ${selectedContact["Telephone"]}</p>
            <p><strong>Mobile Number:</strong> ${selectedContact["Mobile Number"]}</p>
        `;
        customerDetailsDiv.style.display = "block";
    } else {
        customerDetailsDiv.innerHTML = "<p>No contact details found for this customer.</p>";
        customerDetailsDiv.style.display = "block";
    }
}

// Clear search function
function clearSearch() {
    document.getElementById("customerSearch").value = "";
    document.getElementById("customerSelect").innerHTML = '<option value="">Select a customer</option>';
    document.getElementById("locationSelect").innerHTML = '<option value="">Select a location</option>';
    document.getElementById("accountInfo").innerHTML = "";
    document.getElementById("customerTableBody").innerHTML = "";
    document.getElementById("customerDetails").style.display = "none";
}

// Load CSV data for customers when the page loads
window.onload = loadCustomersData;


// Display customer data based on selected location
function showDataForLocation() {
    const selectedCustomerName = document.getElementById("customerSelect").value;
    const selectedLocation = document.getElementById("locationSelect").value;

    if (!selectedCustomerName || !selectedLocation) {
        document.getElementById("customerTableBody").innerHTML = "";
        document.getElementById("accountInfo").innerHTML = "";
        return;
    }

    // Filter customers for the selected customer and location
    const filteredCustomers = customers.filter(customer => 
        customer.Customer_Name === selectedCustomerName && customer.Location === selectedLocation
    );

    const combinedData = {};
    
    // Calculate total spend for the selected customer and location
    const totalSpend = filteredCustomers.reduce((sum, customer) => {
        const invoiceGroup = customer.Invoice_Group;
        
        if (!combinedData[invoiceGroup]) {
            combinedData[invoiceGroup] = { Total: 0, Volume: 0 };
        }

        combinedData[invoiceGroup].Total += parseFloat(customer.Total);
        combinedData[invoiceGroup].Volume += parseInt(customer.Volume);
        
        // Sum up total spend
        return sum + parseFloat(customer.Total);
    }, 0);

    // Display total spend for the selected customer and location
    const accountInfoDiv = document.getElementById("accountInfo");
    accountInfoDiv.innerHTML = `<h2>Total Spend for ${selectedCustomerName} at ${selectedLocation}: £${formatNumber(totalSpend.toFixed(2))}</h2>`;

    let tableBody = "";
    for (const invoiceGroup in combinedData) {
        const data = combinedData[invoiceGroup];
        tableBody += `
            <tr>
                <td>${invoiceGroup}</td>
                <td>£${formatNumber(data.Total.toFixed(2))}</td>
                <td>${data.Volume}</td>
            </tr>
        `;
    }

    document.getElementById("customerTableBody").innerHTML = tableBody;
}


// Helper function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

