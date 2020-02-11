$(function(){

    var hoursLabel = $("#hours");
    var minutesLabel = $("#minutes");
    var secondsLabel = $("#seconds");
    var totalSeconds = 0;
    var timer = null;

    function setTime() {
        ++totalSeconds;
        secondsLabel.val( pad(totalSeconds % 60) );
        minutesLabel.val( pad(parseInt(totalSeconds / 60 % 60)) );
        hoursLabel.val( pad(parseInt(totalSeconds / 3600)) );
    }

    function pad(val) {
        var valString = val + "";
        return valString.length < 2 ? "0" + valString : valString;
    }

    $('#toggle-btn').click(function() {
        if( !timer ) {
            $('input').attr('disabled', true);
            timer = setInterval(setTime, 1000);
            $(this).text('Pause');
        } else {
            clearInterval(timer);
            timer = null;
            $('input').attr('disabled', false);
            $(this).text('Continue');
        }
    });
    $('#toggle-btn').one('click', function(){
        $('#finish-btn').show();
    })

    var id = $('#finish-btn').data('id');
    $('#finish-btn').click(function() {
        clearInterval(timer);
        $.post( window.location.href, { time : totalSeconds }, (data) => {
            console.log( data );
            //window.location = Routing.generate('project_show', { id: id });
        }).fail( (error) => {
            console.error(error.responseText);
        });
    });

    $('#timer input').on('keyup', (e) => editTime() );

    function editTime() {
        var hours = parseInt( hoursLabel.val() );
        var minutes = parseInt( minutesLabel.val() );
        var seconds = parseInt( secondsLabel.val() );

        console.log( hours );
        console.log( minutes );
        console.log( seconds );

        totalSeconds = hours * 3600 + minutes * 60 + seconds;
        console.log( totalSeconds );
    }

});