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

    $('#historyIcon').click(function(element) {
        $('#main').toggle();
        $('#history').toggle();
    });

    $('#historyBack').click(function(element) {
        location.reload();
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
            data: JSON.stringify(mm)
	    });

    });
});
