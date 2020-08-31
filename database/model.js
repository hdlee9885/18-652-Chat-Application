var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'User name cannot be blank']
	},
	password: {
		type: String,
		required: [true, 'Please enter password for your account']
	},
	status: {
		type:String,
		default: "offline"
	}
});

var chatSchema = new Schema({
    message: {
    	type: String
    },
    sender: {
    	type: String
    },
	timestamps: {
		type: String
	}
});

module.exports = mongoose.model('Users', userSchema);
module.exports = mongoose.model('Chat', chatSchema);