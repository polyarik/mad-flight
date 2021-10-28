App.directive("ngTouchstart", function () {
    return {
        controller: function ($scope, $element, $attrs) {
            $element.bind('touchstart', onTouchStart);
            
            function onTouchStart(event) {
                const method = $element.attr('ng-touchstart');
                $scope.$event = event;
                $scope.$apply(method);
            };
        }
    };
});