function initColorPicker() {

    var main = $('main.wrapper');
    var projectColor = $('.project-color');

    var input = projectColor.find('input[type="text"]');
    var color = projectColor.find('.circle-color').first();

    var modal =  projectColor.find('.modal-color');
    modal.modal().find('.circle-input').click(function(){
        var gradient = $(this).css('background');
        input.val( gradient );
        updateColor();
    });

    var val = input.val();
    color.css('background', val);

    function updateColor() {   

        var val = input.val();
        color.css('background', val);

        var regex = val.match(/linear-gradient\(.*\)/g);
        var gradients = regex[0].match(/rgb\(.{2,4},.{2,4},.{2,4}\)/g);
        
        gradientsCanvas.destroy();
        backgroundGradients = gradients;
        createCanvasGradient( gradients, backgroundGradients );

        main.css('background', input.val());
    }

}