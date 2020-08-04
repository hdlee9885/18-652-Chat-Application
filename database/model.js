var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// module.exports = { 
// 	user:{ 
// 		name:{type:String, required:true},
// 		password:{type:String, required:true}
// 	}
// };

var userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'User name cannot be blank']
	},
	password: {
		type: String,
		required: [true, 'Please enter password for your account']
	}
});

module.exports = mongoose.model('Users', userSchema);