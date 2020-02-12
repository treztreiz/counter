'use strict';

var backgroundGradients = null;
var gradientsCanvas = null;

$(function () {

    M.AutoInit();

    var $page = $('#main'),
        options = {
            debug: true,
            prefetch: true,
            cacheLength: 2,
            anchors: '.smooth',
            blacklist: 'form',
            onStart: {
                duration: 300, // Duration of our animation
                render: function (container) {
                    container.addClass('is-exiting');
                    smoothState.restartCSSAnimations();
                }
            },
            onReady: {
                duration: 0,
                render: function (container, $newContent) {
                    container.removeClass('is-exiting');
                    container.html($newContent);
                    init();
                }
            }
        },
        smoothState = $page.smoothState(options).data('smoothState');

        init();

});

function init(){

    var wrapper = $('.wrapper');

    var g =  wrapper.attr('style');
    if( null == g ) {
        var gradients = ['#f7fafc','#f7fafc'];
    } else {
        var regex = g.match(/linear-gradient\(.*\)/g);
        var gradients = regex[0].match(/rgb\(.{2,4},.{2,4},.{2,4}\)/g);
    }
    if( null == backgroundGradients ) backgroundGradients = gradients;

    createCanvasGradient(gradients, backgroundGradients);

    backgroundGradients = gradients;

    if($('#color-picker').length == 1) initColorPicker();
    else if($('#chart').length == 1) initChart();
    else if($('#timer').length == 1) initTimer();

}

function createCanvasGradient(gradients, backgroundGradients ) {

    if( !$('#canvas-gradient').length ) $('.wrapper').prepend('<canvas id="canvas-gradient">');
    gradientsCanvas = new Granim({
        element: '#canvas-gradient',
        direction: 'left-right',
        isPausedWhenNotInView: false,
        states : {
            "default-state": {
                gradients: [
                    [backgroundGradients[0], backgroundGradients[1]],
                    [gradients[0], gradients[1]],
                ],
                transitionSpeed: 500,
                loop: false
            }
        },
        onStart: function() {
            $("body").addClass('loaded');
        },
    });
}
