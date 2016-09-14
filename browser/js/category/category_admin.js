app.config(function ($stateProvider){
  $stateProvider.state('categoryadmin', {
    url: '/admin/category',
    templateUrl: 'js/category/category_admin.html',
    controller: 'AdminCategoryCtrl',
  })
  .state('editcategory', {
    url: '/admin/category/edit/:categoryId',
    templateUrl: 'js/category/category_admin_edit.html',
    controller: 'AdminCategoryCtrl',
    // resolve: {
    //   currentCategory: function(CategoryFactory, $stateParams){
    //     CategoryFactory.fetchById($stateParams.categoryId)

    //   }
    // }
  })
  .state('addcategory', {
    url: '/admin/category/add',
    templateUrl: 'js/category/category_admin_add.html',
    controller: 'AdminCategoryCtrl'
  })
});


app.controller('AdminCategoryCtrl', function ($scope, CategoryFactory, $log, $stateParams, $state) {

  // $scope.category = category;
  CategoryFactory.fetchAll()
  .then(function (foundCategories){
    console.log(foundCategories);
    $scope.categories = foundCategories;
  })

  $scope.editCategory = function (categoryId, category){
    console.log('id', categoryId);
    CategoryFactory.editCategory(categoryId, category)
    .then(category => $state.go('categoryadmin'));
  };

  $scope.deleteCategory = function (id) {
    return CategoryFactory.deleteCategory(id)
    .then(function () {
      console.log('go');
      $state.go('categoryadmin');
    })
  };

  $scope.addCategory = function (category) {
    CategoryFactory.createCategory(category)
    .then(function (category){
      $state.go('categoryadmin');
    })
  }

});
