function openStatement(evt, statementName) {
  // Hide all tab content
  document.querySelectorAll(".table_container").forEach((tab) => {
    tab.style.display = "none";
  });

  // Remove "active" class from all tab links
  document.querySelectorAll(".tablinks").forEach((link) => {
    link.classList.remove("active");
  });

  // Show the selected tab and mark it as active
  document.getElementById(statementName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

const boldItems = [
  "Net Revenues",
  "Total Revenue",
  "Net Income",
  "Operating Income",
  "Gross Profit",
  "EBITDA",
  "Earnings Before Taxes",
  "Net Income (Prior to Minority Int.)",
  "Total Current Assets",
  "Total Non Current Assets",
  "Total Assets",
  "Total Current Liabilities",
  "Total Non Current Liabilities",
  "Total Liabilities",
  "Shareholders' Equity",
  "Total Shareholders Equity",
  "Total Liabilities & Shareholders Equity",
  "Cash Flow from Operating Activities",
  "Cash Flow from Investing Activities",
  "Cash Flow from Financing Activities",
  "Beginning Cash",
  "Ending Cash",
  "Unadjusted EBITDA",
  "Adj. EBITDA",
  "Company Adjusted EBITDA",
  "Adj. Operating Cash Flow",
  "Adj. Free Cash Flow (Pre-WC Changes)",
  "Adj. Free Cash Flow",
  "Free Cash Flow",
  "($ in millions)",
  "Total Debt (Unsecured)",
  "Total Net Debt",
  "Total Enterprise Value",
  "LTM 3Q'24 Adj. EBITDA",
  "Total Debt",
  "Net Debt",
  "Total Leverage",
  "TEV/EBITDA",
  "ICR (based on Adj. EBITDA)",
  "OCF",
  "FCF",
  "Comparable Debt:",
  "Yeild per Ton (Yeild/Total Leverage)",
];

// Function to format bold items
function formatBoldItems(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  table.querySelectorAll("tr").forEach((row) => {
    const firstCell = row.querySelector("td:first-child"); // Get the "Particulars" column
    if (firstCell && boldItems.includes(firstCell.textContent.trim())) {
      row.classList.add("bold-item"); // Add bold styling
      firstCell.classList.add("bold-particulars"); // Ensure "Particulars" column is bolded too
    }
  });
}

// Reusable accounting formatter
function formatAccounting(value) {
  if (isNaN(value)) return value; // Return as-is if not a number
  if (value === 0) return "-";
  return (
    value
      .toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace("-", "")
      .replace(/^\d/, (match) => (value < 0 ? `(${match}` : match)) +
    (value < 0 ? ")" : "")
  );
}

// Format only numeric cells, skipping date rows based on ID
function formatTableNumbers(tableId) {
  const table = document.querySelector(tableId);
  if (!table) {
    console.error(`Table with ID ${tableId} not found`);
    return;
  }

  // Get all rows, filter out the ones with "row-0" ID or other date criteria
  const rows = Array.from(table.querySelectorAll("tr")).filter((row) => {
    return !row.id.includes("row-0"); // Exclude rows with "row-0" ID
  });

  rows.forEach((row) => {
    // Process each cell in the row
    row.querySelectorAll("td").forEach((cell) => {
      const cellContent = cell.textContent.trim();

      // Try to parse as a number
      const numericValue = parseFloat(cellContent.replace(/[^0-9.-]/g, ""));
      if (!isNaN(numericValue)) {
        // If numeric, format it
        cell.textContent = formatAccounting(numericValue); //calling the format accounting function on each numeric value.
      }
    });
  });
}

// Function to populate the table with data
function populateTable(data) {
  let placeholder = document.querySelector("#data-output");
  let out = "";
  let rowIndex = 0; // Counter to create unique IDs for rows
  for (let Income_statement of data) {
    out += `
      <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
        <td id="particulars-${rowIndex}" class="first-column"> ${
      Income_statement.Particulars ?? "" //Replace null/undefined with an empty string
    }</td>
        <td id="fy18-${rowIndex}"> ${Income_statement["FY'18"] ?? ""}</td>
        <td id="fy19-${rowIndex}"> ${Income_statement["FY'19"] ?? ""}</td>
        <td id="fy20-${rowIndex}"> ${Income_statement["FY'20"] ?? ""}</td>
        <td id="fy21-${rowIndex}"> ${Income_statement["FY'21"] ?? ""}</td>
        <td id="q1'22-${rowIndex}"> ${Income_statement["Q1'22"] ?? ""}</td>
        <td id="q2'22-${rowIndex}"> ${Income_statement["Q2'22"] ?? ""}</td>
        <td id="q3'22-${rowIndex}"> ${Income_statement["Q3'22"] ?? ""}</td>
        <td id="q4'22-${rowIndex}"> ${Income_statement["Q4'22"] ?? ""}</td>
        <td id="fy22-${rowIndex}"> ${Income_statement["FY'22"] ?? ""}</td>
        <td id="q1'23-${rowIndex}"> ${Income_statement["Q1'23"] ?? ""}</td>
        <td id="q2'23-${rowIndex}"> ${Income_statement["Q2'23"] ?? ""}</td>
        <td id="q3'23-${rowIndex}"> ${Income_statement["Q3'23"] ?? ""}</td>
        <td id="q4'23-${rowIndex}"> ${Income_statement["Q4'23"] ?? ""}</td>
        <td id="fy23-${rowIndex}"> ${Income_statement["FY'23"] ?? ""}</td>
        <td id="q1'24-${rowIndex}"> ${Income_statement["Q1'24"] ?? ""}</td>
        <td id="q2'24-${rowIndex}"> ${Income_statement["Q2'24"] ?? ""}</td>
        <td id="ltm-${rowIndex}"> ${Income_statement["LTM"] ?? ""}</td>
      </tr>
    `;
    rowIndex++;
  }
  placeholder.innerHTML = out;

  // After populating the table, format the numbers
  formatTableNumbers("#data-output");

  // Apply bold formatting
  formatBoldItems("#data-output");
}

// Fetch data and populate the table
fetch("Intel Corp_IS_Clean_Json")
  .then((response) => response.json())
  .then((Income_statements) => {
    populateTable(Income_statements);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });

// Function to populate the table with data
function populateTable_BS(data) {
  let placeholder = document.querySelector("#data-output_BS");
  let out = "";
  let rowIndex = 0; // Counter to create unique IDs for rows
  for (let Balance_sheet of data) {
    out += `
      <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
        <td id="particulars-${rowIndex}" class="first-column"> ${
      Balance_sheet.Particulars ?? "" //Replace null/undefined with an empty string
    }</td>
        <td id="fy18-${rowIndex}"> ${Balance_sheet["FY'18"] ?? ""}</td>
        <td id="fy19-${rowIndex}"> ${Balance_sheet["FY'19"] ?? ""}</td>
        <td id="fy20-${rowIndex}"> ${Balance_sheet["FY'20"] ?? ""}</td>
        <td id="fy21-${rowIndex}"> ${Balance_sheet["FY'21"] ?? ""}</td>
        <td id="q1'22-${rowIndex}"> ${Balance_sheet["Q1'22"] ?? ""}</td>
        <td id="q2'22-${rowIndex}"> ${Balance_sheet["Q2'22"] ?? ""}</td>
        <td id="q3'22-${rowIndex}"> ${Balance_sheet["Q3'22"] ?? ""}</td>
        <td id="q4'22-${rowIndex}"> ${Balance_sheet["Q4'22"] ?? ""}</td>
        <td id="fy22-${rowIndex}"> ${Balance_sheet["FY'22"] ?? ""}</td>
        <td id="q1'23-${rowIndex}"> ${Balance_sheet["Q1'23"] ?? ""}</td>
        <td id="q2'23-${rowIndex}"> ${Balance_sheet["Q2'23"] ?? ""}</td>
        <td id="q3'23-${rowIndex}"> ${Balance_sheet["Q3'23"] ?? ""}</td>
        <td id="q4'23-${rowIndex}"> ${Balance_sheet["Q4'23"] ?? ""}</td>
        <td id="fy23-${rowIndex}"> ${Balance_sheet["FY'23"] ?? ""}</td>
        <td id="q1'24-${rowIndex}"> ${Balance_sheet["Q1'24"] ?? ""}</td>
        <td id="q2'24-${rowIndex}"> ${Balance_sheet["Q2'24"] ?? ""}</td>
        <td id="ltm-${rowIndex}"> ${Balance_sheet["LTM"] ?? ""}</td>
      </tr>
    `;
    rowIndex++;
  }
  placeholder.innerHTML = out;

  // After populating the table, format the numbers
  formatTableNumbers("#data-output_BS");

  // Apply bold formatting
  formatBoldItems("#data-output_BS");
}

// Fetch data and populate the table
fetch("Intel Corp_BS_Clean_Json")
  .then((response) => response.json())
  .then((Balance_sheets) => {
    populateTable_BS(Balance_sheets);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });

// Function to populate the table with data
function populateTable_CF(data) {
  let placeholder = document.querySelector("#data-output_CF");
  let out = "";
  let rowIndex = 0; // Counter to create unique IDs for rows
  for (let CF_sheet of data) {
    out += `
      <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
        <td id="particulars-${rowIndex}" class="first-column"> ${
      CF_sheet.Particulars ?? "" //Replace null/undefined with an empty string
    }</td>
        <td id="fy18-${rowIndex}"> ${CF_sheet["FY'18"] ?? ""}</td>
        <td id="fy19-${rowIndex}"> ${CF_sheet["FY'19"] ?? ""}</td>
        <td id="fy20-${rowIndex}"> ${CF_sheet["FY'20"] ?? ""}</td>
        <td id="fy21-${rowIndex}"> ${CF_sheet["FY'21"] ?? ""}</td>
        <td id="q1'22-${rowIndex}"> ${CF_sheet["Q1'22"] ?? ""}</td>
        <td id="q2'22-${rowIndex}"> ${CF_sheet["Q2'22"] ?? ""}</td>
        <td id="q3'22-${rowIndex}"> ${CF_sheet["Q3'22"] ?? ""}</td>
        <td id="q4'22-${rowIndex}"> ${CF_sheet["Q4'22"] ?? ""}</td>
        <td id="fy22-${rowIndex}"> ${CF_sheet["FY'22"] ?? ""}</td>
        <td id="q1'23-${rowIndex}"> ${CF_sheet["Q1'23"] ?? ""}</td>
        <td id="q2'23-${rowIndex}"> ${CF_sheet["Q2'23"] ?? ""}</td>
        <td id="q3'23-${rowIndex}"> ${CF_sheet["Q3'23"] ?? ""}</td>
        <td id="q4'23-${rowIndex}"> ${CF_sheet["Q4'23"] ?? ""}</td>
        <td id="fy23-${rowIndex}"> ${CF_sheet["FY'23"] ?? ""}</td>
        <td id="q1'24-${rowIndex}"> ${CF_sheet["Q1'24"] ?? ""}</td>
        <td id="q2'24-${rowIndex}"> ${CF_sheet["Q2'24"] ?? ""}</td>
        <td id="q3'24-${rowIndex}"> ${CF_sheet["Q3'24"] ?? ""}</td>
        <td id="ltm-${rowIndex}"> ${CF_sheet["LTM"] ?? ""}</td>
      </tr>
    `;
    rowIndex++;
  }
  placeholder.innerHTML = out;

  // After populating the table, format the numbers
  formatTableNumbers("#data-output_CF");

  // Apply bold formatting
  formatBoldItems("#data-output_CF");
}

// Fetch data and populate the table
fetch("Intel Corp_CF_Clean_Json")
  .then((response) => response.json())
  .then((CF_sheets) => {
    populateTable_CF(CF_sheets);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });

//Adding dotted line on sub-total line items in FCF
const subtotalItems = [
  "Working Capital Source / (Use)",
  "Reversal of EBITDA Adj.",
  "($ in millions)",
  "Total Debt (Unsecured)",
  "Total Net Debt",
  "Total Equity",
  "Total Enterprise Value",
];
//Function to apply dotted top border to speciific rows
function applySubtotalFormatting(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  table.querySelectorAll("tr").forEach((row) => {
    const firstCellSubtotal = row.querySelector("td:first-child");
    if (
      firstCellSubtotal &&
      subtotalItems.includes(firstCellSubtotal.textContent.trim())
    ) {
      row.classList.add("subtotal");
      firstCellSubtotal.classList.add("subtotal-particulars");
    }
  });
}

// Function to populate the table with data
function populateTable_FCF(data) {
  let placeholder = document.querySelector("#data-output_FCF");
  let out = "";
  let rowIndex = 0; // Counter to create unique IDs for rows
  for (let FCF_sheet of data) {
    out += `
      <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
        <td id="particulars-${rowIndex}" class="first-column"> ${
      FCF_sheet.Particulars ?? "" //Replace null/undefined with an empty string
    }</td>
        <td id="fy18-${rowIndex}"> ${FCF_sheet["FY'18"] ?? ""}</td>
        <td id="fy19-${rowIndex}"> ${FCF_sheet["FY'19"] ?? ""}</td>
        <td id="fy20-${rowIndex}"> ${FCF_sheet["FY'20"] ?? ""}</td>
        <td id="fy21-${rowIndex}"> ${FCF_sheet["FY'21"] ?? ""}</td>
        <td id="q1'22-${rowIndex}"> ${FCF_sheet["Q1'22"] ?? ""}</td>
        <td id="q2'22-${rowIndex}"> ${FCF_sheet["Q2'22"] ?? ""}</td>
        <td id="q3'22-${rowIndex}"> ${FCF_sheet["Q3'22"] ?? ""}</td>
        <td id="q4'22-${rowIndex}"> ${FCF_sheet["Q4'22"] ?? ""}</td>
        <td id="fy22-${rowIndex}"> ${FCF_sheet["FY'22"] ?? ""}</td>
        <td id="q1'23-${rowIndex}"> ${FCF_sheet["Q1'23"] ?? ""}</td>
        <td id="q2'23-${rowIndex}"> ${FCF_sheet["Q2'23"] ?? ""}</td>
        <td id="q3'23-${rowIndex}"> ${FCF_sheet["Q3'23"] ?? ""}</td>
        <td id="q4'23-${rowIndex}"> ${FCF_sheet["Q4'23"] ?? ""}</td>
        <td id="fy23-${rowIndex}"> ${FCF_sheet["FY'23"] ?? ""}</td>
        <td id="q1'24-${rowIndex}"> ${FCF_sheet["Q1'24"] ?? ""}</td>
        <td id="q2'24-${rowIndex}"> ${FCF_sheet["Q2'24"] ?? ""}</td>
        <td id="q3'24-${rowIndex}"> ${FCF_sheet["Q3'24"] ?? ""}</td>
        <td id="ltm-${rowIndex}"> ${FCF_sheet["LTM"] ?? ""}</td>
      </tr>
    `;
    rowIndex++;
  }
  placeholder.innerHTML = out;

  // After populating the table, format the numbers
  formatTableNumbers("#data-output_FCF");

  // Apply bold formatting
  formatBoldItems("#data-output_FCF");

  //Apply dotted subtotal line
  applySubtotalFormatting("#data-output_FCF");
}

// Fetch data and populate the table
fetch("Intel Corp_FCF_Clean_Json")
  .then((response) => response.json())
  .then((FCF_sheets) => {
    populateTable_FCF(FCF_sheets);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });
/////
/*function formatNumber(value) {
  if (!isNaN(value) && value !== "" && value !== null) {
    return (
      Number(value)
        .toLocaleString("en-US", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
        .replace("-", "")
        .replace(/^\d/, (match) => (value < 0 ? `(${match}` : match)) +
      (value < 0 ? ")" : "")
    );
  }

  return value; // Keep text as it is
}

// Function to format only numeric values in the table (called after rendering)
function formatCSTableNumbers(tableId) {
  // console.log("Running formatTableNumbers on:", tableId); // Debugging
  const table = document.getElementById(tableId);
  if (!table) {
    // console.error("Table not found:", tableId);
    return;
  }
  table.querySelectorAll("td").forEach((cell) => {
    let num = parseFloat(cell.textContent.replace(/,/g, "")); // Remove commas before checking
    if (!isNaN(num) && num > 0 && num < 1) {
      console.log("Formatting:", cell.textContent, "→", formatNumber(num)); // Debugging
      cell.textContent = formatNumber(num);
    }
  });
}*/

/////
function formatNumber(value) {
  if (!isNaN(value) && value !== "" && value !== null) {
    return (
      Number(value)
        .toLocaleString("en-US", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
        .replace("-", "") // Remove negative sign
        .replace(/^\d/, (match) => (value < 0 ? `(${match}` : match)) +
      (value < 0 ? ")" : "") // Wrap negative values in parentheses
    );
  }
  return value; // Keep text (like dates) unchanged
}
function isDate(value) {
  // Check if the value follows the MM-DD-YYYY or similar date format
  return /^\d{2}-\d{2}-\d{2,4}$/.test(value);
}

function isNumeric(value) {
  // Check if the entire string is a valid number (no extra characters)
  return !isDate(value) && /^-?\d+(\.\d+)?$/.test(value);
}

function formatCSTableNumbers(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  table.querySelectorAll("td").forEach((cell) => {
    let text = cell.textContent.trim();

    // Skip formatting if it's not a valid number
    if (!isNumeric(text)) return;

    let num = Number(text); // Convert to number safely
    if (num > 0 && num < 1) {
      // Convert small decimals to percentages
      cell.textContent = (num * 100).toFixed(2) + "%";
    } else {
      // Format numbers with commas & parentheses for negatives
      cell.textContent = formatNumber(num);
    }
  });
}

/*function formatCSTablePercentages(tableId) {
  // console.log("Running formatTableNumbers on:", tableId); // Debugging
  const table = document.getElementById(tableId);
  if (!table) {
    // console.error("Table not found:", tableId);
    return;
  }
  table.querySelectorAll("td").forEach((cell) => {
    const value = parseFloat(cell.textContent.replace(/,/g, ""));
    if (!isNaN(value) && value > 0 && value < 1) {
      cell.textContent = (value * 100).toFixed(1) + "%";
    }

    // let num = parseFloat(cell.textContent.replace(/,/g, "")); // Remove commas before checking
    // if (!isNaN(num)) {
    //   // console.log("Formatting:", cell.textContent, "→", formatNumber(num)); // Debugging
    //   cell.textContent = formatNumber(num);
    // }
  });
}*/

//Adding line on capital structure
const cssubtotalItems = [
  "Total Debt (Unsecured)",
  "Total Net Debt",
  "Total Equity",
  "Total Enterprise Value",
  "Total Debt",
  "Net Debt",
  "OCF",
  "FCF",
  "Total Leverage",
  "TEV/EBITDA",
];
//Function to apply dotted top border to speciific rows
function applySubtotalFormattingCS(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  table.querySelectorAll("tr").forEach((row) => {
    const firstCellSubtotalCS = row.querySelector("td:first-child");
    if (
      firstCellSubtotalCS &&
      cssubtotalItems.includes(firstCellSubtotalCS.textContent.trim())
    ) {
      row.classList.add("subtotalcs");
    }
  });
}

//Adding sperator for data lables
const csLableSeprator = ["($ in millions)"];

//Function to apply dotted top border to speciific rows
function applycsLabelSeprator(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  table.querySelectorAll("tr").forEach((row) => {
    const firstLabelCS = row.querySelector("td:first-child");
    if (
      firstLabelCS &&
      csLableSeprator.includes(firstLabelCS.textContent.trim())
    ) {
      row.classList.add("label_seprator");
    }
  });
}

//Adding formating of EBITDA Multiple
const csEBITDA = [
  "LTM 3Q'24 Adj. EBITDA",
  "ICR (based on Adj. EBITDA)",
  "Yeild per Ton (Yeild/Total Leverage)",
];

//Function to apply fomating
function applycsEBITDAFormat(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  table.querySelectorAll("tr").forEach((row) => {
    const firstEBITDACS = row.querySelector("td:first-child");
    if (firstEBITDACS && csEBITDA.includes(firstEBITDACS.textContent.trim())) {
      row.classList.add("format_EBITDA_multiple");
    }
  });
}

// Function to populate the table with data
function populateTable_CS(data) {
  console.log("received data", data);
  let placeholder = document.querySelector("#data-output_CS");
  let out = "";
  let rowIndex = 0; // Counter to create unique IDs for rows
  for (let Capital_sheet of data) {
    console.log("Processing Row", Capital_sheet);
    out += `
      <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
        <td id="column-${rowIndex}"> ${
      Capital_sheet["Column 0"] ?? "" //Replace null/undefined with an empty string
    }</td>
        <td id="column1-${rowIndex}"> ${Capital_sheet["Column 1"] ?? ""}</td>
        <td id="column2-${rowIndex}"> ${Capital_sheet["Column 2"] ?? ""}</td>
        <td id="column3-${rowIndex}"> ${Capital_sheet["Column 3"] ?? ""}</td>
        <td id="column4-${rowIndex}"> ${Capital_sheet["Column 4"] ?? ""}</td>
        <td id="column5-${rowIndex}"> ${Capital_sheet["Column 5"] ?? ""}</td>
        <td id="column6-${rowIndex}"> ${Capital_sheet["Column 6"] ?? ""}</td>
        <td id="column7-${rowIndex}"> ${Capital_sheet["Column 7"] ?? ""}</td>
        <td id="column8-${rowIndex}"> ${Capital_sheet["Column 8"] ?? ""}</td>
        <td id="column9-${rowIndex}"> ${Capital_sheet["Column 9"] ?? ""}</td>
        <td id="column10-${rowIndex}"> ${Capital_sheet["Column 10"] ?? ""}</td>
        <td id="column11-${rowIndex}"> ${Capital_sheet["Column 11"] ?? ""}</td>
        <td id="column12-${rowIndex}"> ${Capital_sheet["Column 12"] ?? ""}</td>
        <td id="column13-${rowIndex}"> ${Capital_sheet["Column 13"] ?? ""}</td>
        <td id="column14-${rowIndex}"> ${
      Capital_sheet["Column 14"] ?? ""
    }</td>       
      </tr>
    `;
    rowIndex++;
  }
  placeholder.innerHTML = out;

  // // After populating the table, format the numbers
  formatCSTableNumbers("data-output_CS");
  // formatCSTablePercentages("data-output_CS");

  // Apply bold formatting
  formatBoldItems("#data-output_CS");

  //Apply dotted subtotal line
  applySubtotalFormattingCS("#data-output_CS");

  //Apply Label Seprator
  applycsLabelSeprator("#data-output_CS");

  //Apply formating to EBITDA Muliple
  applycsEBITDAFormat("#data-output_CS");
}

// Fetch data and populate the table
fetch("CS_Clean_Json")
  .then((response) => response.json())
  .then((Capital_sheet) => {
    populateTable_CS(Capital_sheet);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });

// Function to populate the table with data
function populateTable_Comps(data) {
  console.log(data);
  let placeholder = document.querySelector("#data-output_Comps");
  let out = "";
  let rowIndex = 0; // Counter to create unique IDs for rows
  for (let Comps_sheet of data) {
    console.log("Processing Row", Comps_sheet);
    out += `
      <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
        <td id="column-${rowIndex}"> ${
      Comps_sheet["Column 0"] ?? "" //Replace null/undefined with an empty string
    }</td>
        <td id="column1-${rowIndex}"> ${Comps_sheet["Column 1"] ?? ""}</td>
        <td id="column2-${rowIndex}"> ${Comps_sheet["Column 2"] ?? ""}</td>
        <td id="column3-${rowIndex}"> ${Comps_sheet["Column 3"] ?? ""}</td>
        <td id="column4-${rowIndex}"> ${Comps_sheet["Column 4"] ?? ""}</td>
        <td id="column5-${rowIndex}"> ${Comps_sheet["Column 5"] ?? ""}</td>
      </tr>
    `;
    rowIndex++;
  }
  placeholder.innerHTML = out;

  // After populating the table, format the numbers
  formatCSTableNumbers("data-output_Comps");

  // Apply bold formatting
  formatBoldItems("#data-output_Comps");

  //Apply dotted subtotal line
  applySubtotalFormattingCS("#data-output_Comps");

  //Apply Label Seprator
  applycsLabelSeprator("#data-output_Comps");

  //Apply formating to EBITDA Muliple
  applycsEBITDAFormat("#data-output_Comps");
}

// Fetch data and populate the table
fetch("Intel Corp_Comps_Clean_Json")
  .then((response) => response.json())
  .then((Comps_sheets) => {
    populateTable_Comps(Comps_sheets);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });

/*// Reusable accounting formatter
function formatAccounting(value) {
  if (isNaN(value)) return value; // Return as-is if not a number
  return (
    value
      .toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
      .replace("-", "")
      .replace(/^\d/, (match) => (value < 0 ? `(${match}` : match)) +
    (value < 0 ? ")" : "")
  );
}
  

/// selecting Row 0 of the dates
const row_0 = document.getElementById("#row-0");
console.log(row_0);

// Function to format only numeric cells
function formatTableNumbers(tableId) {
  const table = document.querySelector(tableId); // Use querySelector for the table
  if (!table) {
    console.error(`Table with ID ${tableId} not found`);
    return; // Exit if table not found
  }

  // Find all cells that contain numeric data (e.g., cells in FY columns)
  table.querySelectorAll("td").forEach((cell) => {
    // Try to parse the value, only format if it's a number
    const value = parseFloat(cell.textContent.replace(/[^0-9.-]+/g, "")); // Remove any non-numeric characters

    if (!isNaN(value)) {
      // If the value is numeric, format it
      cell.textContent = formatAccounting(value); // Format only numeric values
      console.log(value);
    }
  });
}

// Function to populate the table with data
function populateTable(data) {
  let placeholder = document.querySelector("#data-output");
  let out = "";
  let rowIndex = 0; // Counter to create unique IDs for rows
  for (let Income_statement of data) {
    out += `
      <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
        <td class="cell-particulars" id="particulars-${rowIndex}"> ${Income_statement.Particulars}</td>
        <td class="cell-fy18" id="fy18-${rowIndex}"> ${Income_statement["FY'18"]}</td>
        <td class="cell-fy19" id="fy19-${rowIndex}"> ${Income_statement["FY'19"]}</td>
        <td class="cell-fy20" id="fy20-${rowIndex}"> ${Income_statement["FY'20"]}</td> 
        <td class="cell-fy21" id="fy21-${rowIndex}"> ${Income_statement["FY'21"]}</td>
        <td class="cell-q1'22" id="q1'22-${rowIndex}"> ${Income_statement["Q1'22"]}</td>
        <td class="cell-q2'22" id="q2'22-${rowIndex}"> ${Income_statement["Q2'22"]}</td> 
        <td class="cell-q3'22" id="q3'22-${rowIndex}"> ${Income_statement["Q3'22"]}</td>
        <td class="cell-q4'22" id="q4'22-${rowIndex}"> ${Income_statement["Q4'22"]}</td>
        <td class="cell-fy22" id="fy22-${rowIndex}"> ${Income_statement["FY'22"]}</td>
        <td class="cell-q1'23" id="q1'23-${rowIndex}"> ${Income_statement["Q1'23"]}</td>
        <td class="cell-q2'23" id="q2'23-${rowIndex}"> ${Income_statement["Q2'23"]}</td> 
        <td class="cell-q3'22" id="q3'23-${rowIndex}"> ${Income_statement["Q3'23"]}</td>
        <td class="cell-q4'22" id="q4'23-${rowIndex}"> ${Income_statement["Q4'23"]}</td>
        <td class="cell-fy23" id="fy23-${rowIndex}"> ${Income_statement["FY'23"]}</td>
        <td class="cell-q1'24" id="q1'24-${rowIndex}"> ${Income_statement["Q1'24"]}</td>
        <td class="cell-q2'24" id="q2'24-${rowIndex}"> ${Income_statement["Q2'24"]}</td> 
        <td class="cell-q2'24.1" id="q2'24.1-${rowIndex}"> ${Income_statement["Q2'24"]}</td>
      </tr>
    `;
    rowIndex++;
  }
  placeholder.innerHTML = out;

  // After table is populated, call the format function
  formatTableNumbers("#data-output");
}

// Fetch data and populate the table
fetch("Intel Corp_IS_Clean_Json")
  .then(function (response) {
    return response.json();
  })
  .then(function (Income_statements) {
    populateTable(Income_statements);
  })
  .catch(function (error) {
    console.error("Error fetching data: ", error);
  });*/

/*// Reusable accounting formatter
function formatAccounting(value) {
  if (isNaN(value)) return value; // Return as-is if not a number
  return (
    value
      .toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
      .replace("-", "")
      .replace(/^\d/, (match) => (value < 0 ? `(${match}` : match)) +
    (value < 0 ? ")" : "")
  );
}

// Helper to check if a string is a valid date
function isValidDate(str) {
  const date = new Date(str);
  return (
    !isNaN(date.getTime()) && // Valid date
    str.includes("-") // Contains dashes (likely a date format)
  );
}

// Function to format only numeric cells
function formatTableNumbers(tableId) {
  const table = document.querySelector(tableId); // Use querySelector for the table
  if (!table) {
    console.error(`Table with ID ${tableId} not found`);
    return; // Exit if table not found
  }

  // Find all cells that contain numeric data
  table.querySelectorAll("td").forEach((cell) => {
    const cellContent = cell.textContent.trim();

    // Skip formatting if it's a valid date
    if (isValidDate(cellContent)) {
      console.log(`Skipped date: "${cellContent}"`);
      return;
    }

    // Parse the value and format only numbers
    const value = parseFloat(cellContent.replace(/[^0-9.-]+/g, "")); // Remove any non-numeric characters
    if (!isNaN(value)) {
      cell.textContent = formatAccounting(value); // Format only numeric values
    }
  });
}

// Function to populate the table with data
function populateTable(data) {
  let placeholder = document.querySelector("#data-output");
  let out = "";
  let rowIndex = 0; // Counter to create unique IDs for rows
  for (let Income_statement of data) {
    out += `
      <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
        <td class="cell-particulars" id="particulars-${rowIndex}"> ${Income_statement.Particulars}</td>
        <td class="cell-fy18" id="fy18-${rowIndex}"> ${Income_statement["FY'18"]}</td>
        <td class="cell-fy19" id="fy19-${rowIndex}"> ${Income_statement["FY'19"]}</td>
        <td class="cell-fy20" id="fy20-${rowIndex}"> ${Income_statement["FY'20"]}</td> 
        <td class="cell-fy21" id="fy21-${rowIndex}"> ${Income_statement["FY'21"]}</td>
        <td class="cell-q1'22" id="q1'22-${rowIndex}"> ${Income_statement["Q1'22"]}</td>
        <td class="cell-q2'22" id="q2'22-${rowIndex}"> ${Income_statement["Q2'22"]}</td> 
        <td class="cell-q3'22" id="q3'22-${rowIndex}"> ${Income_statement["Q3'22"]}</td>
        <td class="cell-q4'22" id="q4'22-${rowIndex}"> ${Income_statement["Q4'22"]}</td>
        <td class="cell-fy22" id="fy22-${rowIndex}"> ${Income_statement["FY'22"]}</td>
        <td class="cell-q1'23" id="q1'23-${rowIndex}"> ${Income_statement["Q1'23"]}</td>
        <td class="cell-q2'23" id="q2'23-${rowIndex}"> ${Income_statement["Q2'23"]}</td> 
        <td class="cell-q3'22" id="q3'23-${rowIndex}"> ${Income_statement["Q3'23"]}</td>
        <td class="cell-q4'22" id="q4'23-${rowIndex}"> ${Income_statement["Q4'23"]}</td>
        <td class="cell-fy23" id="fy23-${rowIndex}"> ${Income_statement["FY'23"]}</td>
        <td class="cell-q1'24" id="q1'24-${rowIndex}"> ${Income_statement["Q1'24"]}</td>
        <td class="cell-q2'24" id="q2'24-${rowIndex}"> ${Income_statement["Q2'24"]}</td> 
        <td class="cell-q2'24.1" id="q2'24.1-${rowIndex}"> ${Income_statement["Q2'24"]}</td>
      </tr>
    `;
    rowIndex++;
  }
  placeholder.innerHTML = out;

  // After table is populated, call the format function
  formatTableNumbers("#data-output");
}

// Fetch data and populate the table
fetch("Intel Corp_IS_Clean_Json")
  .then((response) => response.json())
  .then((Income_statements) => {
    populateTable(Income_statements);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });*/

// step 1 here we are fetching data from json file and converting it in objects to use in javasacript
/*fetch("Intel Corp_IS_Clean_Json")
  .then(function (response) {
    return response.json();
  })

  // step 2 we are selecting all the objects in the dataset and adding it to the varible "placeholder"
  .then(function (Income_statements) {
    let placeholder = document.querySelector("#data-output");
    let out = "";
    let rowIndex = 0; // Counter to create unique IDs for rows
    for (let Income_statement of Income_statements) {
      out += `
        <tr class="row-class-${rowIndex}" id="row-${rowIndex}">
          <td class="cell-particulars" id="particulars-${rowIndex}" > ${Income_statement.Particulars}</td>
          <td class="cell-fy18" id="fy18-${rowIndex}" > ${Income_statement["FY'18"]}</td>
          <td class="cell-fy19" id="fy19-${rowIndex}" > ${Income_statement["FY'19"]}</td>
          <td class="cell-fy20" id="fy20-${rowIndex}" > ${Income_statement["FY'20"]}</td> 
          <td class="cell-fy21" id="fy21-${rowIndex}" > ${Income_statement["FY'21"]}</td>
          <td class="cell-q1'22" id="q1'22-${rowIndex}" > ${Income_statement["Q1'22"]}</td>
          <td class="cell-q2'22" id="q2'22-${rowIndex}" > ${Income_statement["Q2'22"]}</td> 
          <td class="cell-q3'22" id="q3'22-${rowIndex}" > ${Income_statement["Q3'22"]}</td>
          <td class="cell-q4'22" id="q4'22-${rowIndex}" > ${Income_statement["Q4'22"]}</td>
          <td class="cell-fy22" id="fy22-${rowIndex}" > ${Income_statement["FY'22"]}</td>
          <td class="cell-q1'22" id="q1'23-${rowIndex}" > ${Income_statement["Q1'23"]}</td>
          <td class="cell-q2'22" id="q2'23-${rowIndex}" > ${Income_statement["Q2'23"]}</td> 
          <td class="cell-q3'22" id="q3'23-${rowIndex}" > ${Income_statement["Q3'23"]}</td>
          <td class="cell-q4'22" id="q4'23-${rowIndex}" > ${Income_statement["Q4'23"]}</td>
          <td class="cell-fy23" id="fy23-${rowIndex}" > ${Income_statement["FY'23"]}</td>
          <td class="cell-q1'24" id="q1'24-${rowIndex}" > ${Income_statement["Q1'24"]}</td>
          <td class="cell-q2'24" id="q2'24-${rowIndex}" > ${Income_statement["Q2'24"]}</td> 
          <td class="cell-q2'24.1" id="q2'24.1-${rowIndex}" > ${Income_statement["Q2'24"]}</td>
            

        </tr>
      `;
      rowIndex++;
    }

    placeholder.innerHTML = out;
  });

// Reusable accounting formatter
function formatAccounting(value) {
  if (isNaN(value)) return value; // Return as-is if not a number
  return (
    value
      .toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
      .replace("-", "")
      .replace(/^\d/, (match) => (value < 0 ? `(${match}` : match)) +
    (value < 0 ? ")" : "")
  );
}

// Function to format only numeric cells
function formatTableNumbers(tableId) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.error(`Table with ID ${tableId} not found`);
    return;
  } // Exit if table not found

  table.querySelectorAll("td").forEach((cell) => {
    const value = parseFloat(cell.textContent.replace(/[^0-9.-]+/g, "")); // Remove any non-numeric characters
    if (!isNaN(value)) {
      cell.textContent = formatAccounting(value); // Format only numeric values
    }
  });
}

// Automate formatting on page load
document.addEventListener("DOMContentLoaded", () => {
  formatTableNumbers("#data-output");
});

const intel = formatTableNumbers("#intel");
console.log(intel);*/
