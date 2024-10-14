let customers = [];

function loadCSVData() {
    Papa.parse("customers.csv", {
        download: true,
        header: true,
        complete: function(results) {
            customers = results.data;
            console.log("CSV Data Loaded:", customers); // Check the loaded data
        },
        error: function(error) {
            console.error("Error loading CSV data:", error); // Log any loading errors
        }
    });
}

// Call the loadCSVData function when the page loads
window.onload = function() {
    loadCSVData();
};

function searchCustomer() {
    const searchInput = document.getElementById("customerSearch").value.toLowerCase();
    const customerTableBody = document.getElementById("customerTableBody");

    if (!customerTableBody) {
        console.error("Customer table body element not found.");
        return;
    }

    // Clear previous results
    customerTableBody.innerHTML = '';

    // Filter customers based on search input
    const filteredCustomers = customers.filter(customer => 
        customer.Customer_Name.toLowerCase().includes(searchInput)
    );

    // If no customers found, show message
    if (filteredCustomers.length === 0) {
        customerTableBody.innerHTML = "<tr><td colspan='4'>No customer found. Please try again.</td></tr>";
        return;
    }

    // Populate the table with filtered customers
    filteredCustomers.forEach(customer => {
        const row = `<tr>
            <td>${customer.Account_Number}</td>
            <td>${customer.Customer_Name}</td>
            <td>${customer.Invoice_Group}</td>
            <td>£${parseFloat(customer.Total).toFixed(2)}</td>
        </tr>`;
        customerTableBody.innerHTML += row;
    });
}

function clearSearch() {
    document.getElementById("customerSearch").value = '';
    document.getElementById("customerTableBody").innerHTML = '';
}
