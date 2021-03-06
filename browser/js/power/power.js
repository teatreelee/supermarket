'use strict';

app.config(function($stateProvider) {

    //state to for admin to manage all powers
    $stateProvider.state('powerList', {
        url: '/admin/powers/',
        templateUrl: 'js/power/power.list.html',
        controller: 'PowerListCtrl',
        resolve: {
            powerInfo: PowerFactory => PowerFactory.fetchAll(),
            categoryInfo: CategoryFactory => CategoryFactory.fetchAll()
        }
    });

    //state to create product
    $stateProvider.state('createPower', {
        url: '/powers/create',
        templateUrl: 'js/power/power.add.html',
        controller: 'CreatePowerCtrl',
        resolve: {
            categoryInfo: CategoryFactory => CategoryFactory.fetchAll()
        }
    });

    //state to populate a specific power given an powerId.
    $stateProvider.state('power', {
        url: '/powers/:powerId',
        templateUrl: 'js/power/power.html',
        controller: 'PowerCtrl',
        resolve: {
            powerInfo: (PowerFactory, $stateParams) => PowerFactory.fetchById($stateParams.powerId),
            categoryInfo: CategoryFactory => CategoryFactory.fetchAll()
        }
    });

    //state to update product
    $stateProvider.state('editPower', {
        url: '/powers/update/:powerId',
        templateUrl: 'js/power/power.edit.html',
        controller: 'PowerCtrl',
        resolve: {
            powerInfo: (PowerFactory, $stateParams) => PowerFactory.fetchById($stateParams.powerId),
            categoryInfo: CategoryFactory => CategoryFactory.fetchAll()
        }
    });
});

app.controller('PowerListCtrl', function($scope, $state, powerInfo, categoryInfo, PowerFactory) {
    $scope.powerInfo = powerInfo;

    $scope.updatePosting = function(updateInfo) {
        PowerFactory.update(updateInfo)
            .then(updatedPower => $state.go('powerList'))
    }

    $scope.createNewPower = function(newPower) {
        PowerFactory.create(newPower)
            .then(function(createdPower) {
                $scope.newPower = {};
                $scope.created = true;

            })
    }
});

app.controller('CreatePowerCtrl', function($scope, $state, categoryInfo, PowerFactory){

    $scope.created = false;

    $scope.categoryInfo = categoryInfo;

    $scope.createNewPower = function(newPower) {
        PowerFactory.create(newPower)
            .then(function(createdPower) {
                $scope.newPower = {};
                $scope.created = true;
                $scope.newlyCreatedPower = createdPower
            })
    }
})

app.controller('PowerCtrl', function($scope, $state, powerInfo, categoryInfo, PowerFactory, CartFactory, ReviewFactory) {

    $scope.powerInfo = powerInfo;
    $scope.categoryInfo = categoryInfo;
    $scope.updateInfo = powerInfo;
    $scope.created = false;
    $scope.itemInfo = { powerId: $scope.powerInfo.id, quantity: 1 };
    $scope.disableCartBtn = false;
    $scope.addToCartBtnText = "Add To Cart";

    $scope.updatePosting = function(updateInfo) {
        PowerFactory.update(updateInfo)
            .then(updatedPower => $state.go('powerList'))
    }

    $scope.addToCart = function(itemInfo) {
        CartFactory.addToCart(powerInfo.id, itemInfo.quantity)
            .then((addedCart) => addedCart.data)
            .then(() => {
                $scope.addToCartBtnText = "Added To Cart";
                $scope.disableCartBtn = true;
            });
    }


    // rating scope
    $scope.newReview = {}
    $scope.reviewSubmitted = false
    $scope.showReviewForm = false;

    $scope.showFormToggle = function() {
        $scope.showReviewForm = !$scope.showReviewForm;
    }

    $scope.createReview = function(newReview) {
        ReviewFactory.createReview(newReview)
            .then((createdReview) => {

                $scope.newReview = {};
                $scope.reviewSubmitted = true;
                $scope.powerInfo.reviews.push(createdReview.data)
                $scope.apply();
                return createdReview
            })
    }

    $scope.rating = 5;
});

app.factory('ReviewFactory', function($http, $stateParams) {
    var object = {};

    object.createReview = function(newReview) {
        return $http.post('/api/reviews/create/' + $stateParams.powerId, newReview)
    }

    return object;
})
