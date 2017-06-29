/**
 * Created by nthanhduc on 3/4/15.
 */
'use strict';

var Playlists = require('../models/Playlists.js');
var PlaylistSongs = require('../models/PlaylistSongs.js');

module.exports = {
  index: function (req, res) {
    var reqObj = req.body;
    var sort = reqObj.sort;
    var limit = parseInt(reqObj.limit);
    var offset = parseInt(reqObj.offset),
      skip = (offset && offset > 0) ? (offset - 1) * limit : 0;
    var qr = Playlists.find();
    var totalPlaylist = 0;


    Playlists.count(function (err, count) {
      totalPlaylist = count;
    });

    if (limit) {
      qr = qr.limit(limit).skip(skip);
    }

    if (sort) {
      var key = sort.split(',')[0];
      var criteria = sort.split(',')[1];
      sort = {};
      sort[key] = criteria;
      qr = qr.sort(sort);
    }

    qr.exec(function (err, playlists) {
      if (err) {
        return res.negotiate(err);
      }
      var rs = {
        data: (playlists.length > 0) ? playlists : [],
        total: totalPlaylist
      };
      return res.json(200, rs);
    });
  },
  create: function (req, res) {
    var reqObj = req.body;

    if (req.wantsJSON) {
      if (reqObj.title) {
        Playlists.find({title: reqObj.title}).exec(function (err, playlists) {
          if (playlists.length > 0) {
            return res.json(400, {message: 'This title is existed in DB'});
          } else {
            Playlists.create(reqObj, function (err, playlist) {
              return res.json(201, playlist);
            });
          }
        });
      } else {
        return res.json(400, {message: 'This title is empty'});
      }
    }
  },
  update: function (req, res) {
    var reqObj = req.body;
    var id = req.body._id;
    if (req.wantsJSON) {
      if (!id) {
        return res.json(400, {message: 'This object must have id'});
      }
      if (reqObj.title) {
        Playlists.find({title: reqObj.title}).exec(function (err, playlists) {
          if (playlists.length > 0) {
            Playlists.update({_id: id}, reqObj, {upsert: true}).exec(function (/*err*/) {
              return res.json(200, {message: 'Update successfully'});
            });
          }else {
            return res.json(400, {message: 'This profile is not existed in DB'});
          }
        });
      }
    }
  },
  delete: function (req, res) {
    var reqArr = req.body;
    for (var i = 0, len = reqArr.length; i < len; i++) {
      var id = reqArr[i];
      var obj = {
        _id: id
      };
      Playlists.findByIdAndRemove(id).exec();
      PlaylistSongs.findOneAndRemove(obj).exec();
    }
    return res.json(200, {message: 'Delete successfully'});
  }
};
