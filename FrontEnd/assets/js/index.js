$(document).ready(function() {

    $('#buttonRecord').click(function(element) {
        $('#main').toggle();
        $('#records').toggle();
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

    $('#unmatchedIcon').click(function(element) {
        $('#main').toggle();
        $('#unmatched').toggle();
    });

    $('#upload').mouseenter(function(element) {
        document.getElementById('uploadIcon').src="assets/imgs/UploadHovered.png";
        $('#fileForm').toggle();
    });

    $('#upload').mouseleave(function(element){
        document.getElementById('uploadIcon').src="assets/imgs/Upload.png";
        $('#fileForm').toggle();
    });

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

    $('#buttonMatch').click(function(element) {
        var scout = '#'+$('input[name=scout]:checked').val();
        var payment = '#'+$('input[name=payment]:checked').val();
        $(scout).remove();
        $(payment).remove();
        var mm = new Array();
        var data = {};
        data['scout_id']=scout.substring(4, scout.length);
        data['payment_description']=unmatchedPayments[parseInt(payment.substring(4, payment.length))]['payment_description'];
        mm.push(data)
		
        $.ajax({
        type: "POST",
        url: 'http://community.dur.ac.uk/sara.h.chen/team2-cep/backend.php',
        dataType: 'json',
        data: JSON.stringify(mm)
		});
		
        unmatched=unmatched-1;
        $('#totalUnmatched').empty();
        $('#totalUnmatched').append('<a class="count">'+unmatched+'</a>');
    });
});
