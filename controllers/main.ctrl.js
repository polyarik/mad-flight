App.controller("main-ctrl", function MainCtrl($scope) {
	$scope.game = new Game();

	$scope.refreshSpedometer = (delay=0) => {
		setTimeout(() => {
			if ($scope.game?.follower?.movement?.speed === 0)
				$scope.$apply();
		}, delay);
	};
});