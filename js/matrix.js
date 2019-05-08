/* Twelve-Tone Matrix Generator
 * Author: Andreas Ruiz-Gehrt, April 2019. */

/* A function to make the table layout. */
function tableMake() {
    var table  = document.getElementById('table');
    for(var i = 0; i < 14; i++){
        var tr = table.insertRow();
        for(var j = 0; j < 14; j++){
            var td = tr.insertCell();
            td.appendChild(document.createTextNode('-'));
            td.style.color = "#ffffff";
        }
    }
}

/* Highlighting for table row and columns. */
$(document).ready(function() {
                  var tblCells = $("td");
                  tblCells
                  .on("mouseover", function() {
                      var index = $(this).index();
                      $(this).parent().find("td").addClass("hover");
                      tblCells.filter(":nth-child(" + (index+1) + ")").addClass("hover");
                      })
                  .on("mouseout", function() {
                      tblCells.removeClass("hover");
                      });
                  });

/* A 2d array to contain the matrix data. */
var matrixData = new Array(12);
for (i = 0; i < 12; i++) {
    matrixData[i] = new Array(12);
}

/* A var to hold notation state (int/sharp/flat). */
var tableState = "integers";

/* Arrays to buffer between matrixData and output tableState "sharps" and "flats". */
var sharpsBuffer = ["C", "C" + '\u266F', "D", "D" + '\u266F', "E", "F", "F" + '\u266F', "G", "G" + '\u266F', "A", "A" + '\u266F', "B"];
var flatsBuffer = ["C", "D" + '\u266D', "D", "E" + '\u266D', "E", "F", "G" + '\u266D', "G", "A" + '\u266D', "A", "B" + '\u266D', "B"];


/* A count of the number of elements in table. */
var tableCount = 0;

/* A function which returns the output-formatted pitch value, based on the table's current state (ints, sharps, or flats). */
function pitchBuffer(state, pitch) {
    if (state == "integers") {
        return pitch;
    } else if (state == "sharps") {
        return sharpsBuffer[pitch];
    } else {
        return flatsBuffer[pitch];
    }
}

/* A function which returns the pitch's value Mod 12. */
function pitchModulus(pitchVal) {
    var output = pitchVal;
    if (output < 0) {
        output += 12;
    } else if (output > 11) {
        output %= 12;
    }
    return output;
}


/* A function to update matrixData after each consecutive user-input pitch (from row P0). */
function matrixCalculate() {
    if (tableCount == 1) {
        return;
    }
    
    //Signed distance between current-input pitch and first-input pitch.
    var currDistance = matrixData[0][tableCount - 1] - matrixData[0][0];
    
    // Update next new row
    for (i = 0; i < tableCount; i++) {
        transposedVal = matrixData[0][i] - currDistance;
        matrixData[tableCount - 1][i] = pitchModulus(transposedVal);
    }
    
    // Update next new column
    for (i = 1; i < tableCount - 1; i++) {
        transposedVal = matrixData[i][0] + currDistance;
        matrixData[i][tableCount - 1] = pitchModulus(transposedVal);
    }
}

/* Update rows and columns based on the number of pitches entered. */
function tableFill() {
    // Update header and footer rows and columns
    var verticalHeaderNum = pitchModulus(matrixData[0][tableCount - 1] - matrixData[0][0]);
    var horizontalHeaderNum = pitchModulus(matrixData[tableCount - 1][0] - matrixData[0][0]);
    
        // Upper header cell: I
        var tblCell = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[tableCount];
        tblCell.childNodes[0].data = "I";
        $(tblCell).append($( "<sub>" + verticalHeaderNum + "</sub>" ));
        tblCell.style.color = "#000000";
        // Lower header cell: RI
        tblCell = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[13].getElementsByTagName("td")[tableCount];
        tblCell.childNodes[0].data = "RI";
        $(tblCell).append($( "<sub>" + verticalHeaderNum + "</sub>" ));
        tblCell.style.color = "#000000";
        // Left header cell: P
        var nextRow = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[tableCount];
        tblCell = nextRow.getElementsByTagName("td")[0];
        tblCell.childNodes[0].data = "P";
        $(tblCell).append($( "<sub>" + horizontalHeaderNum + "</sub>" ));
        tblCell.style.color = "#000000";
        // Right header cell: R
        tblCell = nextRow.getElementsByTagName("td")[13];
        tblCell.childNodes[0].data = "R";
        $(tblCell).append($( "<sub>" + horizontalHeaderNum + "</sub>" ));
        tblCell.style.color = "#000000";

    // Fill in new Row
    for (i = 0; i < tableCount; i++) {
        var bufferedOutput = pitchBuffer(tableState, matrixData[tableCount - 1][i]);
        tblCell = nextRow.getElementsByTagName("td")[i + 1];
        tblCell.childNodes[0].data = bufferedOutput;
        tblCell.style.color = "#000000";
    }
    
    // Fill in new column
    for (i = 0; i < tableCount; i++) {
        bufferedOutput = pitchBuffer(tableState, matrixData[i][tableCount - 1]);
        tblCell = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i + 1].getElementsByTagName("td")[tableCount];
        tblCell.childNodes[0].data = bufferedOutput;
        tblCell.style.color = "#000000";
    }
}

/* A function to remove the last row and column from the table. */
function undoFill() {
    // Reset last row with P-header cell
    for (i = 0; i < tableCount + 1; i++) {
        tblCell = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[tableCount].getElementsByTagName("td")[i];
        tblCell.style.color = "#ffffff";
        if (i == 0) {
            $(tblCell.childNodes[1]).remove();
        }
        tblCell.childNodes[0].data = "-"
    }
    
    // Reset R-header cell
    tblCell = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[tableCount].getElementsByTagName("td")[13];
    tblCell.style.color = "#ffffff";
    $(tblCell.childNodes[1]).remove();
    tblCell.childNodes[0].data = "-"
    
    // Reset last Column with I-header cell
    for (i = 0; i < tableCount + 1; i++) {
        tblCell = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[tableCount];
        tblCell.style.color = "#ffffff";
        if (i == 0) {
            $(tblCell.childNodes[1]).remove();
        }
        tblCell.childNodes[0].data = "-"
    }
    
    // Reset RI-header cell
    tblCell = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[13].getElementsByTagName("td")[tableCount];
    tblCell.style.color = "#ffffff";
    $(tblCell.childNodes[1]).remove();
    tblCell.childNodes[0].data = "-"
}


function inputPitch(pitchVal) {
    if (tableCount == 12) {
        return;
    } else {
        matrixData[0][tableCount] = pitchVal;
        tableCount++;
        matrixCalculate();
        tableFill();
    }
    
}

/* A function to remove the last user-input pitch from the table. */
function delPitch() {
    if (tableCount == 0) {
        return;
    } else {
        undoFill();
        tableCount--;
        document.getElementById("input-" + matrixData[0][tableCount]).disabled = false;
    }
}

/* Button handler for input pitches. */
function pitchBtn(val) {
    inputPitch(val);
    document.getElementById("input-" + val).disabled = true;
}


function tableStateUpdate() {
    // Update table
    for (i = 0; i < tableCount; i++) {
        for (j = 0; j < tableCount; j++) {
            document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i + 1].getElementsByTagName("td")[j + 1].childNodes[0].data = pitchBuffer(tableState, matrixData[i][j]);
        }
    }
    
    // Update input-pitch buttons
    for (i = 0; i < 12; i++) {
      document.getElementById("input-" + i).innerHTML = pitchBuffer(tableState, i);
    }
}
                                                                                                                                                                            

function stateChange(newState) {
    tableState = newState;
    if (newState == "integers") {
        document.getElementById("state-btn-integers").disabled = true;
        document.getElementById("state-btn-sharps").disabled = false;
        document.getElementById("state-btn-flats").disabled = false;
        tableStateUpdate();
    } else if (newState == "sharps") {
        document.getElementById("state-btn-integers").disabled = false;
        document.getElementById("state-btn-sharps").disabled = true;
        document.getElementById("state-btn-flats").disabled = false;
        tableStateUpdate();
    } else {
        document.getElementById("state-btn-integers").disabled = false;
        document.getElementById("state-btn-sharps").disabled = false;
        document.getElementById("state-btn-flats").disabled = true;
        tableStateUpdate();
    }
}

/* Distance from starting pitch to zero, used to revert fixed-do conversion. */
var doDistance = 0;

function fixedDoConvert() {
    if (tableCount < 12) {
        window.alert("Please complete the Twelve-Tone Row (P0) first.");
    } else {
        doDistance = matrixData[0][0];
        // Update table
        for (i = 0; i < 12; i++) {
            for (j = 0; j < 12; j++) {
                document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i + 1].getElementsByTagName("td")[j + 1].childNodes[0].data = pitchBuffer(tableState, pitchModulus(matrixData[i][j] - doDistance));            }
        }
        
        // Disable delete button
        document.getElementById("del-pitch-btn").disabled = true;
        
        // Change fixed-do buton
        document.getElementById("fixed-do-btn").hidden = true;
        document.getElementById("fixed-do-btn-undo").hidden = false;
        
        // Convert matrixData
        for (i = 0; i < 12; i++) {
            for (j = 0; j < 12; j++) {
                matrixData[i][j] = pitchModulus(matrixData[i][j] - doDistance);
            }
        }
    }
    
}

/* Resets the table and buttons to before fixed-do conversion. */
function fixedDoConvertUndo() {
    // Undo table conversion
    for (i = 0; i < 12; i++) {
        for (j = 0; j < 12; j++) {
            document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i + 1].getElementsByTagName("td")[j + 1].childNodes[0].data = pitchBuffer(tableState, pitchModulus(matrixData[i][j] + doDistance));
        }
    }
    
    // Reenable delete button
    document.getElementById("del-pitch-btn").disabled = false;
    
    // Change-back fixed-do button
    document.getElementById("fixed-do-btn").hidden = false;
    document.getElementById("fixed-do-btn-undo").hidden = true;

    // Undo matrixData conversion
    for (i = 0; i < 12; i++) {
        for (j = 0; j < 12; j++) {
            matrixData[i][j] = pitchModulus(matrixData[i][j] + doDistance);
        }
    }
}

tableMake();
