'use strict';

app.directive('navbar', function($rootScope, CategoryFactory, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        // controller: 'NavbarCtrl',
        link: function(scope) {
            CategoryFactory.fetchAll()
                .then((categories) => {
                    scope.categories = categories;
                });

            scope.searching = false;
            scope.accountOptions = false;

            scope.toggleSearching = function() {
                scope.accountOptions = false;
                scope.adminOptions = false;
                scope.searching = !scope.searching;
            };

            scope.toggleAccountOptions = function() {
                scope.searching = false;
                scope.adminOptions = false;
                scope.accountOptions = !scope.accountOptions;
            };

            scope.toggleAdminOptions = function() {
                scope.searching = false;
                scope.accountOptions = false;
                scope.adminOptions = !scope.adminOptions;
            };

            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                scope.accountOptions = false;
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };

            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
