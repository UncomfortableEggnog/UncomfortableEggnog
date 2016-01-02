(function () {
  'use strict';
  angular.module('app')
    .directive('rating', RatingDirective);

  function RatingDirective (ApiFactory, $state) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'js/html/rating/rating.main.html',
      link: link,
      scope: {
        score: '=',
        review: '=review',
        packageEntry: '=package',
        user: '='
      }
    };

    var post = ApiFactory.post;

    return directive;

    function link (scope, elem, attrs) {
      scope.$watch('packageEntry', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          console.log(scope.user);
          if (scope.user.prevReview) {
            scope.review = scope.user.prevReview.contents;
            scope.score = scope.user.prevReview.stars / scope.user.prevReview.totalStars * 5;
            scope.submitOrUpdateReview = 'Update';
          } else {
            scope.submitOrUpdateReview = 'Submit';
          }
        }
      });
      scope.submitReview = function () {
        console.log(localStorage);
        var id = scope.packageEntry._id;
        if (scope.user.canEditPackage) {
          //TODO: add visual display for this message
          console.log('cannot rate own package!');
          return;
        } else {
          var review = {
            stars: scope.score,
            totalStars: 5,
            contents: scope.review,
            prevReview: scope.user.prevReview
          };
          post('/api/package/' + id, review)
          .then(function (res) {
            scope.review = "";
            if (res === "Not Logged In") {
              $state.go('login');
            } else {
              console.log('updated or submitted:', res);
              console.log(scope);
            }
          });
        }
      };
    }
  }
})();
