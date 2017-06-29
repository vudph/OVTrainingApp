/**
 * Created by dminhquan on 3/3/2015.
 */

(function () {
  'use strict';
  angular.module('myAppApp')
    .config(function ($routeProvider) {
      $routeProvider
        .when('/playLists', {
          templateUrl: 'app/scripts/layout.html',
          controller: 'playListsCtrl'
        });
    })
    .controller('playListsCtrl', ['$scope', 'AllMusicManagerAppIds', '$layoutService', '$utility', '$playListsService',
      function ($scope, AllMusicManagerAppIds, $layoutService, $utility, $playListsService) {
      $scope.title = 'PlayLists Manager';
      $scope.currentContentTpl = 'app/scripts/playLists/templates/playListsShow.html';
      $scope.selectedSideBar = $layoutService.findSideBarItem(AllMusicManagerAppIds.PLAY_LISTS);

      $scope.alertObj = {};

      //Close alert when change state (view, edit, create...)
      $scope.$watch('currentContentTpl', function(){
        $scope.alertObj.show = false;
      });

      $scope.playListsObj = {
        selectedList: [],
        configObj: {}
      };

      $scope.config = {
        selectFieldList: [
          {title: 'Title', value: 'title'},
          {title: 'Description', value: 'description'}
        ],
        api: 'api/playlists/query'
      };
      $scope.config.sortBy = $scope.config.selectFieldList[0];

      $scope.headerObj = {
        title: 'PlayLists Manager',
        headerShow: function(){
          return $scope.currentContentTpl === $scope.viewState.templateUrl;
        },
        buttonDisabled: {
          create: function(){
            return false;
          },
          edit: function(){
            return $scope.playListsObj.selectedList.length !== 1;
          },
          delete: function(){
            return $scope.playListsObj.selectedList.length === 0;
          },
          refresh: function(){
            return false;
          }
        },
        buttonAction: {
          create: function(){
            angular.extend($scope.playListsObj.configObj, $scope.createState);
            $scope.playListsObj.configObj.active();
          },
          edit: function(){
            angular.extend($scope.playListsObj.configObj, $scope.editState);
            $scope.playListsObj.configObj.active();
          },
          delete: function($event){
            $scope.deleteObj.active($event);
          },
          refresh: function(){
            $scope.config.resetData();
          }
        }
      };

      $scope.viewState = {
        name: 'view',
        templateUrl: 'app/scripts/playLists/templates/playListsShow.html',
        active: function(){
          $scope.currentContentTpl = this.templateUrl;
        }
      };

      $scope.createState = {
        name: 'create',
        title: 'Create a playList',
        templateUrl: 'app/scripts/playLists/templates/playListsConfig.html',
        finishLabel: 'Create',
        cancelLabel: 'Cancel',
        active: function(){
          $scope.currentContentTpl = this.templateUrl;
        },
        clear: function(){
          this.data = null;
        },
        canFinish: function(){
          return true;
        },
        performFinish: function(){
          var createState = this;
          $playListsService.createPlayList(createState.data).success(function(res){
            if (res.message){
              $scope.alertObj.info(res.message);
              return;
            }
            createState.performCancel();
          }).error(function(msg){
            $scope.alertObj.error(msg.message);
          });
        },
        canCancel: function(){
          return true;
        },
        performCancel: function(){
          this.clear();
          $scope.viewState.active();
        }
      };

      $scope.editState = {
        name: 'edit',
        title: 'Edit a playList',
        templateUrl: 'app/scripts/playLists/templates/playListsConfig.html',
        finishLabel: 'Edit',
        cancelLabel: 'Cancel',
        active: function(){
          this.data = $scope.playListsObj.selectedList[0];
          this.disabledAttrs = {
            title: true
          };
          $scope.currentContentTpl = this.templateUrl;
        },
        clear: function(){
          this.data = null;
          this.disabledAttrs = null;
        },
        canFinish: function(){
          return true;
        },
        performFinish: function(){
          var editState = this;
          $playListsService.editPlayList(editState.data).success(function(res){
            if (res.message){
              $scope.alertObj.info(res.message);
            }
            editState.performCancel();
          }).error(function(res){
            $scope.alertObj.error(res.message);
          });
        },
        canCancel: function(){
          return true;
        },
        performCancel: function(){
          this.clear();
          $scope.viewState.active();
        }
      };

      $scope.deleteObj = {
        active: function($event){
          $utility.showDeleteDialog($event, function finishCallback(){
            var postData = $scope.playListsObj.selectedList.map(function(playList){
              return playList._id;
            });
            $playListsService.deletePlayLists(postData).success(function(res){
              $scope.alertObj.info(res.message);
              $scope.headerObj.buttonAction.refresh();
            }).error(function(res){
              $scope.alertObj.error(res.message);
            });
          });
        }
      };
    }]);
})();
