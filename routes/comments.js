var express 		= require("express");
var router 			= express.Router({mergeParams: true});
var Car				= require("../models/car");
var Comment 		= require("../models/comment");
var middleware 		= require("../middleware");


// Comments New
	router.get("/new", middleware.isLoggedIn, function(req, res){
		//find car by id
		Car.findById(req.params.id, function(err, car){
			if(err){
				console.log(err);
			} else {
				res.render("comments/new", {car: car});
			}
		})
	})

// Comments Create
	router.post("/", middleware.isLoggedIn, function(req, res){
		// lookup carusing ID
		Car.findById(req.params.id, function(err, car){
			if(err){
				console.log(err);
				res.redirect("/cars");
			} else {	
				Comment.create(req.body.comment, function(err, comment){
					if(err){
						req.flash("error", "Something went Wrong!");
						console.log(err);
					} else {
					// 	add username and id to comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username; 
					// 	save comment	
						comment.save();
						car.comments.push(comment);
						car.save();
						console.log(comment);
						req.flash("success", "Successfully created comment");
						res.redirect('/cars/' + car._id);
					}
				})
			}
		})
		// create new comment
		// connect new comment to a car
		// redirect car show page 
	});

// COMMENT EDIT ROUTE 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res){
	Car.findById(req.params.id, function(err, foundCar){
		if(err || !foundCar){
			req.flash("error", "No car found");
			return res.redirect("back");
		}
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("back");
				} else {
		  			res.render("comments/edit", {car_id: req.params.id, comment: foundComment});
			}
		});
	})
});

// COMMENT UPDATE 
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/cars/" + req.params.id );
		}
	});
});


// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
// 	findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/cars/" + req.params.id)
		}
	});
});



module.exports = router; 