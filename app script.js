function importCSVDataToForm() {
  var form = FormApp.openById('GOOGLE_FORM_ID');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var formItems = form.getItems();
  
  // Assuming the first row contains column headings
  var headers = data[0];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var formResponse = form.createResponse();
    
    for (var j = 0; j < Math.min(row.length, formItems.length); j++) {
      var item = formItems[j];
      var itemTitle = item.getTitle();
      var columnIndex = headers.indexOf(itemTitle);
      
      // Skip if the column doesn't exist in the headers or the form item
      if (columnIndex === -1) continue;
      
      var itemType = item.getType();
      var response;

      switch(itemType) {
        case FormApp.ItemType.TEXT:
          if (row[columnIndex] !== '') {
            response = item.asTextItem().createResponse(row[columnIndex]);
          } else {
            console.log('Empty cell found for text item: ' + itemTitle);
          }
          break;
        case FormApp.ItemType.MULTIPLE_CHOICE:
          if (row[columnIndex] !== '') {
            response = item.asMultipleChoiceItem().createResponse(row[columnIndex]);
          } else {
            console.log('Empty cell found for multiple choice item: ' + itemTitle);
          }
          break;
        // Add other cases for different item types as needed
        default:
          // Handle unsupported item types
          continue;
      }

      // Ensure response is not empty before adding it to the form response
      if (response && response.getResponse()) {
        formResponse.withItemResponse(response);
      }
    }

    // Try submitting the response
    try {
      var formSubmit = formResponse.submit();
      console.log('Form submitted successfully. Response ID: ' + formSubmit.getId());
    } catch (e) {
      console.error('Error submitting form response: ' + e);
    }
  }
}
