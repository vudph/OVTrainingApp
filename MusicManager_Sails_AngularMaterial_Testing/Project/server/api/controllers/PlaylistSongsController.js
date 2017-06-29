/**
 * Created by nthanhduc on 3/6/15.
 */
'use strict';

var Songs = require('../models/Songs.js');
var PlaylistSongs = require('../models/PlaylistSongs.js');

module.exports = {
  addSongsToPlaylist: function (req, res) {
    var reqArr = req.body;
    var id = req.params.idPlayList;

    reqArr.forEach(function (val) {
      var obj = {
        idPlayList: id,
        idSong: val
      };
      PlaylistSongs.find(obj).exec(function (err, resource) {
        if (!resource.length) {
          PlaylistSongs.create(obj);
        }
      });
    });

    return res.json(200, {message: 'Insert songs to playlist successfully'});
  },
  getSongsInPlaylist: function (req, res) {
    var reqObj = req.body;
    var sort = reqObj.sort;
    var limit = parseInt(reqObj.limit);
    var offset = parseInt(reqObj.offset),
      skip = (offset && offset > 0) ? (offset - 1) * limit : 0;
    var totalSongs = 0;
    var id = req.params.idPlayList;
    var obj = {
      idPlayList: id
    };
    var qr = PlaylistSongs.find(obj);

    PlaylistSongs.find(obj).count(function (err, count) {
      totalSongs = count;
    });

    if (limit) {
      qr = qr.limit(limit).skip(skip);
    }

    qr.exec(function (err, resource) {
      if (resource.length > 0) {
        var conditions = [];
        var songQuery = Songs.find();
        resource.forEach(function (val) {
          var objSongCondition = {
            _id: val.idSong
          };
          conditions.push(objSongCondition);
        });

        if (conditions.length > 0) {
          songQuery = songQuery.or(conditions);
        }

        if (sort) {
          var key = sort.split(',')[0];
          var criteria = sort.split(',')[1];
          sort = {};
          sort[key] = criteria;
          songQuery = songQuery.sort(sort);
        }

        songQuery.exec(function (err, songs) {
          return res.json(200, {data: songs, total: totalSongs});
        });

      } else {
        return res.json(200, {data: [], total: totalSongs});
      }
    });

  },
  removeSongsFromPlaylist: function (req, res) {
    var reqArr = req.body;
    var id = req.params.idPlayList;
    for (var i = 0, len = reqArr.length; i < len; i++) {
      var idSong = reqArr[i];
      var obj = {
        idSong: idSong,
        idPlayList: id
      };
      PlaylistSongs.findOneAndRemove(obj).exec();
    }
    return res.json(200, {message: 'Remove successfully'});
  }
};
