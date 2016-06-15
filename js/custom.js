/**
 * Created by bulent on 19.05.2016.
 */

$(function () {
    $("#dialog").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        }
    });
});


function supportSend() {
    $('#supportModal').find('.alert').show();
    setTimeout(function(){
        $('#supportModal').modal('hide');
        // console.log('timeout fired')
    }, 2000);
    // $('#supportModal').modal('hide');
}