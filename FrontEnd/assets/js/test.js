/**
 * Created by sara on 08/02/17.
 */
$(document).ready(function() {

    $('#buttonRecord').click(function(element) {
        $('#main').toggle();
        $('#records').toggle();
    });

    $('#buttonUnmatched').click(function(element) {
        $('#main').toggle();
        $('#unmatched').toggle();
    });

    $('#buttonMatching').click(function(element) {
        $('#main').toggle();
        $('#matching').toggle();
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
        data['scout_id']=scout.charAt(4);
        data['payment_description']=unmatchedPayments[payment.charAt(4)]['payment_description'];
        mm.push(data)
        mm = JSON.stringify(mm);
        $.post('',mm,function(data){}); //TODO need to add location of website. Assume backend.php but not sure
        unmatched=unmatched-1;
        $('#totalUnmatched').empty();
        $('#totalUnmatched').append('<a class="count">'+unmatched+'</a>');
    });

    $('#moveToMM').click(function(element) {
        $('#matching').toggle();
        $('#unmatched').toggle();
    });

    $('#buttonRecord').click(function(element) {
        $('#main').toggle();
        $('#records').toggle();
    });

    $('#buttonUnmatched').click(function(element) {
        $('#main').toggle();
        $('#unmatched').toggle();
    });

    $('#buttonMatching').click(function(element) {
        $('#main').toggle();
        $('#matching').toggle();
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
        data['scout_id']=scout.charAt(4);
        data['payment_description']=unmatchedPayments[payment.charAt(4)]['payment_description'];
        mm.push(data)
        mm = JSON.stringify(mm);
        $.post('',mm,function(data){}); //TODO need to add location of website. Assume backend.php but not sure
        unmatched=unmatched-1;
        $('#totalUnmatched').empty();
        $('#totalUnmatched').append('<a class="count">'+unmatched+'</a>');
    });

    $('#moveToMM').click(function(element) {
        $('#matching').toggle();
        $('#unmatched').toggle();
    });


});
