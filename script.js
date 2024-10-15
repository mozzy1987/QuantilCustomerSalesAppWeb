let customers = []; // Declare the customers variable
let filteredCustomers = []; // To hold filtered customer results

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

// Function to search for customer details
function searchCustomer() {
    const selectedAccountNumber = document.getElementById("customerSelect").value;

    if (!selectedAccountNumber) {
        document.getElementById("accountInfo").innerHTML = "Please select a customer.";
        document.getElementById("customerTableBody").innerHTML = ""; // Clear table
        return;
    }

    // Filter to find the selected customer
    const selectedCustomers = customers.filter(customer => 
        customer.Account_Number === selectedAccountNumber
    );

    if (selectedCustomers.length === 0) {
        document.getElementById("accountInfo").innerHTML = "No customer found. Please try again.";
        document.getElementById("customerTableBody").innerHTML = ""; // Clear table
        return;
    }

    // Display Account Number and Customer Name at the top
    const accountInfo = selectedCustomers[0]; // Since we have filtered by Account Number
    document.getElementById("accountInfo").innerHTML = `
        <p><strong>Account Number:</strong> ${accountInfo.Account_Number}</p>
        <p><strong>Customer Name:</strong> ${accountInfo.Customer_Name}</p>
    `;

    // Build the table body for the selected customer
    let tableBody = "";
    selectedCustomers.forEach(customer => {
        tableBody += `
            <tr>
                <td>${customer.Invoice_Group}</td>
                <td>£${customer.Total}</td>
                <td>${customer.Volume}</td>
            </tr>
        `;
    });
    document.getElementById("customerTableBody").innerHTML = tableBody;
}

// Clear search function
function clearSearch() {
    document.getElementById("customerSearch").value = "";
    document.getElementById("customerSelect").innerHTML = '<option value="">Select a customer</option>'; // Clear dropdown
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

// Load CSV data when the page loads
window.onload = loadCSVData;
