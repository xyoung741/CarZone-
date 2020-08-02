var mongoose = require("mongoose");

// SCHEMA SETUP
var carSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
}
	]
});

    const Comment = require('./comment');
    carSchema.pre('remove', async function() {
    	await Comment.remove({
    		_id: {
    			$in: this.comments
    		}
    	});
    });

module.exports = mongoose.model("Car", carSchema);