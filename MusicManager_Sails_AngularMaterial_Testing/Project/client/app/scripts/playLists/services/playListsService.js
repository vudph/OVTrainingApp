/**
 * Created by dminhquan on 3/11/2015.
 */

(function () {
  'use strict';
  angular.module('uiService')
    .factory('$playListsService', ['$http', function ($http) {
      var api = {
        commonUrl: 'api/playlists',
        querySongs: 'api/playlists/query'
      };

      return {
        api: api,
        createPlayList: function(data){
          return $http.post(api.commonUrl, angular.toJson(data));
        },
        editPlayList: function(data){
          return $http.put(api.commonUrl, angular.toJson(data));
        },
        deletePlayLists: function(data){
          var requestData = {data: angular.toJson(data), headers: {'Content-Type': 'application/json'}};
          return $http.delete(api.commonUrl, requestData);
        }
      };
    }]);
})();
