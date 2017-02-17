$(document).ready(function() {

    $('#buttonRecord').click(function(element) {
        location.reload();
    });

    $('#buttonUnmatched').click(function(element) {
        location.reload();
    });

    $('#buttonMatching').click(function(element) {
        location.reload();
    });

    $('#recordsIcon').click(function(element) {
        $('#main').toggle();
        $('#records').toggle();
    });

    $('#historyIcon').click(function(element) {
        $('#main').toggle();
        $('#history').toggle();
    });

    $('#historyBack').click(function(element) {
        location.reload();
    });

    $('#savedScoutsHome').click(function(element) {
        $('#records').toggle();
        $('#savedScouts').toggle();
    });

    $('#manualEntryBack').click(function(element) {
	    location.reload();
    });

    $('#saved').click(function(element) {
        $('#records').toggle();
        $('#savedScouts').toggle();
    });

    $('#upload').mouseenter(function(element) {
    	document.getElementById('uploadIcon').src="assets/imgs/UploadHovered.png";
	$('#fileForm').show();
    });

    $('#upload').mouseleave(function(element){
	document.getElementById('uploadIcon').src="assets/imgs/Upload.png";
	$('#fileForm').hide();
    });

    $('#buttonMatch').click(function(element) {
        var scout = '#'+$('input[name=scout]:checked').val();
        var payment = '#'+$('input[name=payment]:checked').val();
        $(scout).remove();
        $(payment).remove();
        var mm = new Array();
        var data = {};
        data['scout_id']=scout.substring(4, scout.length);
        data['payment_description']=unmatchedPayments[parseInt(payment.substring(4, payment.length))]['payment_description'];
        mm.push(data);

        $.ajax({
            type: "POST",
            url: 'http://community.dur.ac.uk/sara.h.chen/team2-cep/backend.php',
            data: JSON.stringify(mm)
	    });

    });

    $('#manualEntrySubmit').click(function(element){
        var paymentDate = $("#date").val();
		var paymentAmount = parseFloat($("#amount").val());
		
		var day = parseInt(paymentDate.substring(0,2));
		var month = parseInt(paymentDate.substring(3,5));
		var year = parseInt(paymentDate.substring(6,10));
		
		if(paymentDate == null || isNaN(paymentAmount) || isNaN(day) || isNaN(month) || isNaN(year) || day>31 || month>12 || day<1 || month<1)
		{
			alert("Invalid parameters:\nEnter a number for amount and\na date of the form dd-mm-yyyy");
		}
		else
		{
			var payment_date = "";
			payment_date += paymentDate.substring(0,2)+"-"+paymentDate.substring(3,5)+"-"+paymentDate.substring(6,10);
			var payment = [{"scout_id":$("#scout_id").val(), "payment_date":payment_date, "payment_amount":paymentAmount}];
			$.ajax({
			type: "POST",
			url: 'http://community.dur.ac.uk/sara.h.chen/team2-cep/backend.php',
			data: JSON.stringify(payment),
			complete:function(){location.reload();}
			});
			$("#date").val("");
			$("#amount").val("");
		}
    });
});
