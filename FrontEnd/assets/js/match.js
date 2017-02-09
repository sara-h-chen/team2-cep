var scouts = [];
var payments = [];
var manualMatches = [];
var unmatchedScouts = [];
var unmatchedPayments = [];

$.get("http://community.dur.ac.uk/sara.h.chen/team2-cep/backend.php",
    function(data) {
        scouts = data;
	    $.get("http://community.dur.ac.uk/sara.h.chen/team2-cep/backend.php?table=matches",
		function(data2) {
		    manualMatches=data2;
			
		    $("#upload").toggle();
			
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
	    for(var i=0; i<scouts.length; ++i)
	    {
		$('#scoutRecordTable').append("<tr onclick='showScoutPayments("+scouts[i]['id']+")'><td>"+scouts[i]['id']+"</td><td>"+scouts[i]['forename']+"</td><td>"+scouts[i]['surname']+"</td></tr>");
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
        alert("Please wait for scouts to be loaded");
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


            if (score >= 6) {
                for (var k = 0; k<scouts.length; ++k) {
                    if (scouts[k].id == manualMatches[i].scout_id) {
                        var match = {"id":scouts[k].id, "forename" : scouts[k].forename, "surname":scouts[k].surname, "payment_date" : payments[j].date, "payment_amount" : payments[j].amount};
                        matches.push(match);

                        $("#matchingTable").append("<tr><td>"+match.forename+"</td><td>"+match.surname+"</td><td>"+match.payment_amount+"</td><td>"+match.payment_date+"</td><td>"+payments[j].description+"</td></tr>");

			payments.splice(j,1);
                        scouts.splice(k,1);
                        break;
                    }
                }
                break;
            }
        }
    }

    //Match for each scout
    for (var i = 0; i < scouts.length; i++) {
        var forename = scouts[i]['forename'].toLowerCase();
        var surname = scouts[i]['surname'].toLowerCase();
        var pname = scouts[i]['pname'].toLowerCase();
        var parentsName = scouts[i]['parentsName'].toLowerCase();
        var parentsNameAlt = scouts[i]['parentsNameAlt'].toLowerCase();

        for (var j = payments.length - 1; j >= 0; j--) {

            //Words in description
            words = processDescript(payments[j]["description"]);


            matched = false;

            score = 0;

            matchedWords = [];

            //Compare scout attributes to each word in description
            for (var k = 0; k < words.length; k++) {
                switch (words[k]) {
                    case forename:
                        matched = true;
                        matchedWords.push(forename);
                        score += 1;
                        break;
                    case surname:
                        matched = true;
                        matchedWords.push(surname);
                        score += 2;
                        break;
                    case pname:
                        matched = true;
                        matchedWords.push(pname);
                        score += 1;
                        break;
                    case parentsName:
                        matched = true;
                        matchedWords.push(parentsName);
                        score += 2;
                        break;
                    case parentsNameAlt:
                        matched = true;
                        matchedWords.push(parentsNameAlt);
                        score += 2;
                        break;
                    default:
                        break;
                }
            }

            if (matched && score > 6) {
                //Create match objects
                match = {id : scouts[i]["id"], forename : scouts[i]["forename"], surname : scouts[i]["surname"], payment_date : payments[j]["date"], payment_amount : payments[j]["amount"]};

                matches.push(match);

                //Display match to user
                $("#matchingTable").append("<tr><td>"+match.forename+"</td><td>"+match.surname+"</td><td>"+match.payment_amount+"</td><td>"+match.payment_date+"</td><td>"+payments[j].description+"</td></tr>");

                //Remove payment
                payments.splice(j,1);
                scouts.splice(i,1);
            }
        }
    }

    $("#scoutUnmatchedTable").empty();
    $("#paymentUnmatchedTable").empty();
    $("#paymentUnmatchedTable").append("<tr><th>Payment Amount</th><th>Payment Description</th></tr>");
    $("#scoutUnmatchedTable").append("<tr><th>Forename</th><th>Surname</th></tr>");

    for (var i=0; i<scouts.length; ++i) {
        unmatchedScouts.push({"scout_id" : scouts[i].id,"forename" : scouts[i].forename, "surname" : scouts[i].surname});
        $("#scoutUnmatchedTable").append("<tr id='sid" + scouts[i].id + "'><td>"+scouts[i].forename+"</td><td>"+scouts[i].surname+"</td><td><input type='radio' name='scout' value='sid"+scouts[i].id+"' /></td></tr>");
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
        url: 'http://community.dur.ac.uk/sara.h.chen/team2-cep/backend.php',
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
    $.post("http://community.dur.ac.uk/sara.h.chen/team2-cep/backend.php", {"scout_id":id});
}
