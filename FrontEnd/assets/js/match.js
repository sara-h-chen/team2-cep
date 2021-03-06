var scouts = [];
var payments = [];
var manualMatches = [];
var unmatchedScouts = [];
var unmatchedPayments = [];
var recordedPayments = [];
$.get("http://framscouts.org.uk/subsTemp/backend.php",
    function(data) {
        scouts = data;
	    $.get("http://framscouts.org.uk/subsTemp/backend.php?table=matches",
		function(data2) {
		    manualMatches=data2;

			$("#upload").empty();
			$("#upload").append('<form id="fileForm" class="dropzone"><input type="file" id="inputFile" name="csv" accept=".csv"></form><img src="assets/imgs/Upload.png" alt="upload" id="uploadIcon">');
			$('#fileForm').hide();

			$('input[type=file]').change(function(element) {
				var fileReader = new FileReader();
				fileReader.onload = function(event) {
				parsePayments(event.target.result);
				match();
				};

				if ($("#inputFile")[0].files.length > 0) {
					fileReader.readAsText($("#inputFile")[0].files[0]);
				}
			});
		    for(var i=0; i<manualMatches.length; ++i)
		    {
			for(var j=0; j<scouts.length; ++j)
			{
			    if(scouts[j].id == manualMatches[i].scout_id)
			    {
				$("#manualMatchTable").append("<tr id='MM"+scouts[j].id+"'><td>"+scouts[j].id+"</td><td>"+scouts[j].forename+"</td><td>"+scouts[j].surname+"</td><td>"+manualMatches[i].payment_description+"</td><td><button type='button' onclick='deleteMM("+scouts[j].id+");'>Delete Match</button></td></tr>");
				break;
			    }
			}
		    }
		});
		$.get("http://framscouts.org.uk/subsTemp/backend.php?table=payments",
		function(data)
		{
			var currentDate = new Date();
			currentDate.setMonth(currentDate.getMonth()-6);
			
			recordedPayments = data;
			var tableRows = [];
			
			for(var i=0; i<scouts.length; ++i)
			{
				var unpaidMonths = 0;
				
				var appendString = "<tr onclick='onClickRecord("+scouts[i]['id']+")' onmouseover='showScoutPayments("+scouts[i]['id']+")'><td>"+scouts[i]['id']+"</td><td>"+scouts[i]['forename']+"</td><td>"+scouts[i]['surname']+"</td>";
				for(var j=0; j<6; ++j)
				{
					var paidThisMonth = false;
					
					for(var k=0; k<recordedPayments.length; ++k)
					{
						if(recordedPayments[k].scout_id == scouts[i].id)
						{
							if(parseInt(recordedPayments[k].payment_date.substring(3,5)) == currentDate.getMonth()+1 && parseInt(recordedPayments[k].payment_date.substring(6,10)) == currentDate.getFullYear())
							{
								paidThisMonth = true;
								break;
							}
						}
					}
					
					if(paidThisMonth)
					{
						appendString += "<td style='background-color:Lime'></td>";
					}
					else
					{
						appendString += "<td style='background-color:Red'></td>";
						unpaidMonths += 1;
					}
					
					currentDate.setMonth(currentDate.getMonth()+1);
				}
				appendString += "</tr>"
				currentDate.setMonth(currentDate.getMonth()-6);
				var j=0;
				for(j=0; j<tableRows.length; ++j)
				{
					if(unpaidMonths > tableRows[j].unpaidMonths){break;}
				}
				
				tableRows.splice(j,0,{"appendString":appendString, "unpaidMonths":unpaidMonths});
			}
			
			for(var i=0; i<tableRows.length; ++i)
			{
				$("#scoutRecordTable").append(tableRows[i].appendString);
			}
		});
    });

$.get("http://framscouts.org.uk/subsTemp/backend.php?table=saved", function(data)
{
	for(var i=0; i<data.length; ++i)
	{
		$("#savedScoutTable").append("<tr><td>"+data[i].id+"</td><td>"+data[i].forename+"</td><td>"+data[i].surname+"</td><td>"+data[i].reason+"</td><td><button onclick='deleteFlag("+data[i].id+");'>Delete Flag</button></td></tr>");
	}
});

function parsePayments(csv) {
    payments = [];

    var descriptionPos = -1;
    var datePos = -1;
    var amountPos = -1;

    var commaCount = 0;

    var cursor = 0;

    var date = "";
    var description = "";
    var amount = "";

    while(csv[cursor] != '\n') {
        if(csv.substring(cursor, cursor+16) == 'Transaction Date') {
            datePos = commaCount;
            cursor+=15;
        } else if (csv.substring(cursor, cursor+23) == 'Transaction Description') {
            descriptionPos = commaCount;
            cursor+=22;
        } else if (csv.substring(cursor, cursor+13) == 'Credit Amount') {
            amountPos = commaCount;
            cursor+=12;
        } else if (csv[cursor] == ',') {
            commaCount++;
        }

        cursor++;

        if (cursor >= csv.length) {
            payments=[];
            return;
        }
    }

    cursor++;

    commaCount = 0;

    while(cursor<csv.length) {
        if (csv[cursor] == ',') {
            commaCount++;
        } else if (csv[cursor] == '\n') {
            commaCount=0;
            date="";
            description="";
            amount="";
        } else if (commaCount == descriptionPos) {
            while (csv[cursor] != ',' && csv[cursor] != '\n') {
                description += csv[cursor];
                cursor++;
            }
            commaCount++;
        } else if(commaCount == amountPos) {
            while(csv[cursor] != ',' && csv[cursor] != '\n') {
                amount += csv[cursor];
                cursor++;
            }
            commaCount++;
        } else if(commaCount == datePos) {
            while(csv[cursor] != ',' && csv[cursor] != '\n') {
                date += csv[cursor];
                cursor++;
            }
            commaCount++;
        }

        if(date.length>0 && description.length>0 && amount.length>0) {
            if ((parseInt(amount)-14)%9 == 0) {
                payments.push({date:date, description:description, amount:parseInt(amount)});
            }
            amount="";
            date="";
            description="";
        }
        cursor++;
    }
}

// var testScouts = [{id : 0, forname : "Charlie", surname : "Turner", pname : "", parentsName : "Diane Turner", parentsNameAlt : ""}];
// var testPayments = [{date : "03/10/2016", description : "RICHARD TURNER CHARLIE TURNER 00151095632BBGJZRX 090126     30 03OCT16 03:31", amount : 14}, {date : "02/10/2016", description : "RICHARD TURNER CHARLIE TURNER 00151095632BBGJZRX 090126     31 03OCT16 03:31", amount : 28}];

function match(){

    if (scouts.length == 0) {
        alert("Scouts failed to load, please try again");
	location.reload();
        return;
    }
    if (payments.length == 0) {
        alert("No payments available");
	location.reload();
        return;
    }

    $("#main").toggle();
    $("#matching").toggle();

    var matches = [];

    var words1 = [];
    var words2 = [];

    var score = 0;

	var spliceIndex = -1;

    for (var i = manualMatches.length-1; i>=0; --i) {
        words2 = processDescript(manualMatches[i].payment_description);
        for (var j = payments.length-1; j>=0; --j) {
            score = 0;

            words1 = processDescript(payments[j].description);

            for (var k = words1.length-1; k>=0; --k) {
                for (var l = words2.length-1; l>=0; --l) {
                    if (words1[k] == words2[l]) {
                        score += 1;
                    }
                }
            }


            if (score >= 5) {
                for (var k = 0; k<scouts.length; ++k) {
                    if (scouts[k].id == manualMatches[i].scout_id) {
                        var match = {"id":scouts[k].id, "forename" : scouts[k].forename, "surname":scouts[k].surname, "payment_date" : payments[j].date, "payment_amount" : payments[j].amount};
                        matches.push(match);

						spliceIndex = k;

                        $("#matchingTable").append("<tr><td>"+match.forename+"</td><td>"+match.surname+"</td><td>"+match.payment_amount+"</td><td>"+match.payment_date+"</td><td>"+payments[j].description+"</td></tr>");

						payments.splice(j,1);
                        break;
                    }
                }
            }

			if(spliceIndex >= 0)
			{
				scouts.splice(spliceIndex, 1);
			}
			spliceIndex = -1;
        }
    }

    //Match for each scout
	for(var i = scouts.length - 1; i >= 0; i--){
		var forename = processDescript(scouts[i]['forename']);
		var surname = processDescript(scouts[i]['surname']);
		var pname = processDescript(scouts[i]['pname']);
		var parentsName = processDescript(scouts[i]['parentsName']);
		var parentsNameAlt = processDescript(scouts[i]['parentsNameAlt']);

		for(var j = payments.length - 1; j >= 0; j--){

			//Words in description
			words = processDescript(payments[j]["description"]);

			score = 0;

			matchedWords = [];

			var matched = false;

			//Compare scout attributes to each word in description
			for(var k = 0; k < words.length; k++){
				for(fI = 0; fI < forename.length; fI++){
					if(words[k] == forename[fI]){
						matched = true;
						matchedWords.push(forename);
						score += 1;
					}
				}
				for(sI = 0; sI < surname.length; sI++){
					if(words[k] == surname[sI]){
						matched = true;
						matchedWords.push(surname);
						score += 2;
					}
				}
				for(pI = 0; pI < pname.length; pI++){
					if(words[k] == pname[pI]){
						matched = true;
						matchedWords.push(pname);
						score += 1;
					}
				}
				for(pnI = 0; pnI < parentsName.length; pnI++){
					if(words[k] == parentsName[pnI]){
						matched = true;
						matchedWords.push(parentsName);
						score += 2;
					}
				}
				for(pnaI = 0; pnaI < parentsNameAlt.length; pnaI++){
					if(words[k] == parentsNameAlt[pnaI]){
						matched = true;
						matchedWords.push(parentsNameAlt);
						score += 2
					}
				}
			}

			if(score > 10){
				//Create match objects
				match = {id : scouts[i]["id"], forename : scouts[i]["forename"], surname : scouts[i]["surname"], payment_date : payments[j]["date"], payment_amount : payments[j]["amount"]};

				matches.push(match);

				// console.log(match);

				//Display match to user
				$("#matchingTable").append("<tr><td>"+match.forename+"</td><td>"+match.surname+"</td><td>"+match.payment_amount+"</td><td>"+match.payment_date+"</td><td>"+payments[j].description+"</td></tr>");

				//Remove payment
				payments.splice(j,1);
			}
		}
		if(matched){
			scouts.splice(i,1);
		}
	}

    $("#scoutUnmatchedTable").empty();
    $("#paymentUnmatchedTable").empty();
    $("#paymentUnmatchedTable").append("<tr><th>Payment Amount</th><th>Payment Description</th><th>Select</th></tr>");
    $("#scoutUnmatchedTable").append("<tr><th>Forename</th><th>Surname</th><th>Select</th><th>Flag</th></tr>");

    for (var i=0; i<scouts.length; ++i) {
        unmatchedScouts.push({"scout_id" : scouts[i].id,"forename" : scouts[i].forename, "surname" : scouts[i].surname});
        $("#scoutUnmatchedTable").append("<tr id='sid" + scouts[i].id + "'><td>"+scouts[i].forename+"</td><td>"+scouts[i].surname+"</td><td><input type='radio' name='scout' value='sid"+scouts[i].id+"' /></td><td><button onclick='flagScout("+scouts[i].id+")'>Flag</button></td></tr>");
    }

    for (var i=0; i<payments.length; ++i) {
        unmatchedPayments.push({"payment_description" : payments[i].description, "payment_amount" : payments[i].amount, "payment_date" : payments[i].date});
        $("#paymentUnmatchedTable").append("<tr id='pid"+i+"'><td>"+payments[i].amount+"</td><td>"+payments[i].description+"</td><td><input type='radio' name='payment' value='pid"+i+"'></td></tr>");
    }

    var paymentRecords = [];

    for (var i = 0; i<matches.length; ++i) {
        paymentRecords.push({"scout_id":matches[i].id, "payment_date" : matches[i].payment_date, "payment_amount" : matches[i].payment_amount});
    }

    $.ajax({
        type: "POST",
        url: 'http://framscouts.org.uk/subsTemp/backend.php',
        data: JSON.stringify(paymentRecords)
    });

    $("#moveToMM").remove();
	$("#matching").append('<button type="button" id="moveToMM">View Unmatched</button>');
    $('#moveToMM').click(function(element) {
    $('#matching').toggle();
    $('#unmatched').toggle();
    });
}

function processDescript(paymentDes){
    //Remove numerals
    var description = paymentDes.replace(/[^a-z^\s]+/ig, ' ');
    var words = description.split(" ");

    //Remove extra spaces
    for(var i = words.length - 1; i >= 0; i--){
        if(words[i] == ""){
            words.splice(i,1);
        }
        else{
            words[i] = words[i].toLowerCase();
        }
    }
    return words;
}

function sortPayments(recentDate, payments) {
    var notProcessed = [];
    var startDate = new Date(recentDate)
}

function deleteMM(id)
{
    $("#MM"+id).remove();
    $.post("http://framscouts.org.uk/subsTemp/backend.php", {"scout_id":id});
}

function showScoutPayments(scoutID)
{
	$("#scoutPaymentRecordsTable").empty();
	$("#scoutPaymentRecordsTable").append("<tr><th>Amount</th><th>Date</th></tr>");
	var thisScoutsPayments = [];
	for(var i=0; i<recordedPayments.length; ++i)
	{
		if(recordedPayments[i].scout_id == scoutID)
		{
			// console.log(recordedPayments[i].scout_id);
			thisScoutsPayments.push(recordedPayments[i]);
		}
	}

	for(var i=thisScoutsPayments.length-1; i>=0; --i)
	{
		$("#scoutPaymentRecordsTable").append("<tr><td>"+thisScoutsPayments[i].payment_amount+"</td><td>"+thisScoutsPayments[i].payment_date+"</td></tr>");
	}
}

function refreshPaymentRecords()
{
	$.get("http://framscouts.org.uk/subsTemp/backend.php?table=payments",
	function(data)
	{
		recordedPayments = data;
		$("#scoutPaymentRecordsTable").empty();
		$("#scoutPaymentRecordsTable").append("<tr><th>Amount</th><th>Date</th></tr>");
	});
}

function flagScout(scoutID)
{
	var reason=prompt("Enter a reason");

	if(reason!=null)
	{
		$.post("http://framscouts.org.uk/subsTemp/backend.php",{"marked_scout":scoutID, "reason":reason});
		$("#sid"+scoutID).remove();
	}
}

function refreshFlags()
{
	$.get("http://framscouts.org.uk/subsTemp/backend.php?table=saved", function(data)
	{
		$("#savedScoutTable").empty();
		$("#savedScoutTable").append("<tr><th>Scout ID</th><th>Forename</th><th>Surname</th><th>Reason for Flag</th></tr>");
		for(var i=0; i<data.length; ++i)
		{
			$("#savedScoutTable").append("<tr><td>"+data[i].id+"</td><td>"+data[i].forename+"</td><td>"+data[i].surname+"</td><td>"+data[i].reason+"</td><td><button onclick='deleteFlag("+data[i].id+");'>Delete Flag</button></td></tr>");
		}
	});
}

function deleteFlag(scoutID)
{
	$.post("http://framscouts.org.uk/subsTemp/backend.php", {"delete_marked":scoutID}, function(){refreshFlags();});
}

function onClickRecord(scoutID){
	for(var i=0; i<scouts.length; ++i)
	{
		if(scouts[i].id == scoutID)
		{
			$("#manualAddScoutName").html(scouts[i].forename + " " + scouts[i].surname);
			break;
		}
	}
    $("#scout_id").val(scoutID);
    // console.log($("#scout_id").val());
    $('#records').toggle();
    $('#manualEntry').toggle();
}
