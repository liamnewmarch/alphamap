// Alphamap v2 Liam Newmarch 2014

window.Alphamap = function(options) {

    var matrix = [];

    function rgb(r, g, b) {
        return { r: r, g: g, b: b };
    }

    function newValue(x, y) {
        var top, left, min, average, i;

        top = y > 0 ? matrix[y - 1][x] : options.baseColor;
        left = x > 0 ? matrix[y][x - 1] : options.baseColor;
        min = Math.min(left.length, top.length);

        average = [];

        for (i = 0; i < min; i++) {
            average.push((top[i] + left[i]) / 2 + variation(i));
        }

        return average;
    }

    function variation(i) {
        var colorVariation = options.variation[i];
        return (colorVariation / 2) - (colorVariation * Math.random());
    }

    this.draw = function(context) {
        var x, y, image, imageData, i, width, height;

        width = context.canvas.width;
        height = context.canvas.height;
        image = context.createImageData(width, height);
        imageData = image.data;

        for (y = 0; y < height; y++) {
            matrix[y] = [];
            for (x = 0; x < width; x++) {
                matrix[y][x] = newValue(x, y);
                i = 4 * (y * width + x);
                imageData[i + 0] = matrix[y][x][0];
                imageData[i + 1] = matrix[y][x][1];
                imageData[i + 2] = matrix[y][x][2];
                imageData[i + 3] = 255;
            }
        }

        context.putImageData(image, 0, 0);
    };
};

(function() {

    'use strict';

    var $canvas, context, alphamap,
        $baseRed, $baseGreen, $baseBlue,
        $variationRed, $variationGreen, $variationBlue;

    $canvas = document.querySelector('canvas');
    context = $canvas.getContext('2d');

    $canvas.width = innerWidth;
    $canvas.height = innerHeight;

    $baseRed = document.querySelector('#base-red');
    $baseGreen = document.querySelector('#base-green');
    $baseBlue = document.querySelector('#base-blue');

    $variationRed = document.querySelector('#variation-red');
    $variationGreen = document.querySelector('#variation-green');
    $variationBlue = document.querySelector('#variation-blue');

    function refresh() {

        alphamap = new Alphamap({
            baseColor: [
                $baseRed.value,
                $baseGreen.value,
                $baseBlue.value
            ],
            variation: [
                $variationRed.value,
                $variationGreen.value,
                $variationBlue.value
            ]
        });

        alphamap.draw(context);
    }

    [].forEach.call(document.querySelectorAll('input'), function($input) {
        $input.addEventListener('change', refresh, false);
    });

    refresh();

}());
