import sampleConst from './sample';

angular.element(document).ready(() => {
  // Setup AngularJS Module
  angular.module('app', ['ngRoute'])
    .controller('TopPageController', ['$scope', function($scope) {
      $scope.yourName = sampleConst;
    }])
    .config(['$routeProvider', ($routeProvider) => {
      $routeProvider
        .when('/', {
          controller: 'TopPageController',
          template: `
            <div class="container">
              <label>Name:</label>
              <input type="text" id="your-name" ng-model="yourName" placeholder="Enter a name here">
              <hr>
              <h1 id="message">Hello {{yourName}}!</h1>
            </div>
          `
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);
  
  // Bootstrap AngularJS
  angular.bootstrap(document, ['app'], { strictDi: true });
});
