var Car 	= require("../models/car");
var Comment 	= require("../models/comment");


// all the middleware goes here 
var middlewareObj = {};


middlewareObj.checkCarOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Car.findById(req.params.id, function(err, foundCar){
			if(err || !foundCar){
				req.flash("error", "Car not found");
				res.redirect("back")
			} else {
				// does user own the car? 
				if(foundCar.author.id.equals(req.user._id)){
				   	next();
				} else {
						req.flash("error", "You don't have permission to do that");
					   res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	} 
}


middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				res.flash("error", "Comment Not Found");
				res.redirect("back")
			} else {
				// does user own the comment? 
				if(foundComment.author.id.equals(req.user._id)){
				   	next();
				} else {
						req.flash("error", "You don't have permission to do that");
					   res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	} 
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login");
}


module.exports = middlewareObj