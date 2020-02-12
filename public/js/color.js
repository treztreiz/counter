$(function(){

    var main = $('main.wrapper');
    var projectColor = $('.project-color');

    var input = projectColor.find('input[type="text"]');
    var color = projectColor.find('.circle-color').first();

    var modal =  projectColor.find('.modal-color');
    modal.find('.circle-input').click(function(){
        var gradient = $(this).css('background');
        input.val( gradient );
        updateColor();
    });

    function updateColor() {   
        color.css('background', input.val());
        main.css('background', input.val());
    }
    updateColor();

});