// step 1 here we are fetching data from json file and converting it in objects to use in javasacript
fetch("output_cleaned.json")
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
          <td class="cell-fy22" id="fy22-${rowIndex}" > ${Income_statement["FY'22"]}</td>
          <td class="cell-fy23" id="fy23-${rowIndex}" > ${Income_statement["FY'23"]}</td>
          <td class="cell-fy24" id="fy24-${rowIndex}" > ${Income_statement["FY'24"]}</td>  

        </tr>
      `;
      rowIndex++;
    }

    placeholder.innerHTML = out;
  });
