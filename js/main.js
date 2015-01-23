// Alphamap v2 Liam Newmarch 2014

var app = angular.module('app', []);


app.controller('ViewController', [ '$scope', '$timeout', '$window', function($scope, $timeout, $window) {

    var vm = this;

    vm.width = 320;
    vm.height = 320;
    vm.baseColor = [ 128, 128, 128 ];
    vm.variation = [  16,  16,  16 ];
    vm.debounce = { debounce: 100 };

    vm.download = function() {
        $scope.$broadcast('download');
    };

    vm.fitScreen = function() {
        vm.width = $window.innerWidth;
        vm.height = $window.innerHeight;
        vm.refresh();
    };

    vm.randomise = function() {
        vm.baseColor = vm.baseColor.map(function(value) {
            return Math.floor(Math.random() * 255);
        });
        vm.variation = vm.variation.map(function(value) {
            return Math.floor(Math.random() * 255);
        });
    };

    vm.refresh = function() {
        $scope.$broadcast('refresh', vm);
    };

    $scope.$watch('vm', function() {
        vm.width = parseInt(vm.width, 10);
        vm.height = parseInt(vm.height, 10);
        vm.baseColor = vm.baseColor.map(function(value) {
            return parseInt(value);
        });
        vm.variation = vm.variation.map(function(value) {
            return parseInt(value);
        });
        vm.refresh();
    }, true);
}]);


app.directive('canvas', [ 'alphamap', function(alphamap) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.$on('refresh', function(e, data) {
                alphamap.create(data);
                alphamap.draw(element);
            });
            scope.$on('download', function() {
                alphamap.download(element);
            });
        }
    };
}]);


app.service('alphamap', [function() {

    var matrix = [],
        options;

    function draw(context) {
        var x, y, image, imageData, i, width, height;

        width = context.canvas.width = options.width;
        height = context.canvas.height = options.height;
        context.imageSmoothingEnabled = false;
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
    }

    function newValue(x, y) {
        var top, left, channel, average, i;

        top = y > 0 ? matrix[y - 1][x] : options.baseColor;
        left = x > 0 ? matrix[y][x - 1] : options.baseColor;

        average = [];

        for (i = 0; i < 3; i++) {
            channel = (top[i] + left[i]) / 2 + variation(i);
            channel = Math.min(255, Math.max(0, channel));
            average.push(channel);
        }

        return average;
    }

    function variation(i) {
        var colorVariation = options.variation[i];
        return (colorVariation / 2) - (colorVariation * Math.random());
    }

    return {
        create: function(data) {
            options = data;
        },
        download: function(element) {
            var a = document.createElement('a');
            a.download = 'alphamap.png';
            a.href = element[0].toDataURL('image/png');
            a.click();
        },
        draw: function(element) {
            draw(element[0].getContext('2d'));
        }
    };

}]);

