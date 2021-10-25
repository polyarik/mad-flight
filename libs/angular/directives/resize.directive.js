App.directive("onresize", ['$window', function (elem) {
	return {
		link: link,
		restrict: 'A'
	};

	function link($scope) {
		angular.element(elem).bind('resize', function() {
			$scope.game.setCanvasesSize();
		});
	}
}]);