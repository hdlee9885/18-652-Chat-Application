var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var models = require('./model');

for (var model in models) {
    // create user model
    mongoose.model(model, new Schema(models[model]));
}

var _getModel = function(type) {
    return mongoose.model(type);
}

module.exports = {
    getModel: function(type) {
        return _getModel(type);
    }
}

