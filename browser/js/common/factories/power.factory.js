app.factory('PowerFactory', function($http) {
    let PowerFactory = {};

    let formatData = (res) => res.data;

    PowerFactory.fetchAll = function(categoryId) {
        var route = '/api/powers/';
        if (categoryId) {
            route += ('?catId=' + categoryId);
        }
        return $http.get(route)
            .then(formatData);
    }

    PowerFactory.fetchById = function(id) {
        return $http.get('/api/powers/' + id)
            .then(formatData);
    }

    PowerFactory.update = function(powerInfo) {
        return $http.put('api/powers/' + powerInfo.id, powerInfo)
    }

    PowerFactory.create = function(newPower) {
        return $http.post('/api/powers/create', newPower)
    }

    return PowerFactory;
})
