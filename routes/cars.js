var express 		= require("express");
var router 			= express.Router();
var Car 			= require("../models/car");
var middleware 		= require("../middleware");


// INDEX - show all cars
router.get("/", function(req, res){
// 	Get all cars from DB
	Car.find({}, function(err, allCars){
		if(err){
			console.log(err);
		} else {
			res.render("cars/index", {cars:allCars});
		}
	});
	
});


// CREATE - create new cars DB
router.post("/", middleware.isLoggedIn, function(req, res){
// 	get data from form and add to cars array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCar = {name: name, image: image, description: desc, author: author}
	// Create a new car and save to DB
	Car.create(newCar, function(err, newlyCreated){
		if(err){
			console.log(err);	
		} else {
			// 	redirect back to campgrounds page 
			console.log(newlyCreated);
			res.redirect("/cars");
		}
	});

});

// NEW - show form to create new car 
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("cars/new");
});

// SHOW - shows more info about one car
router.get("/:id", function(req, res){
// 	find the car with provided ID
	Car.findById(req.params.id).populate("comments").exec(function(err, foundCar){
		if(err || !foundCar){
			req.flash("error", "Car not found");
			res.redirect("back");
		} else {
			console.log(foundCar);
			// 	render show template with that car 
			res.render("cars/show", {car: foundCar});
		}
	});
})

// EDIT CAR ROUTE
router.get("/:id/edit", middleware.checkCarOwnership, function(req, res){
// 		is user logged in
		Car.findById(req.params.id, function(err, foundCar){
				   	res.render("cars/edit", {car: foundCar});
		});
});

	// UPDATE CAR ROUTE

router.put("/:id", middleware.checkCarOwnership, function(req, res){
	//find and update the correct cars	
	Car.findByIdAndUpdate(req.params.id, req.body.car, function(err, UpdatedCar){
		if(err){
			res.redirect("/cars");
		} else {
			res.redirect("/cars/" + req.params.id);
		}
	});
	//redirect somewhere(show page)
});

// DESTROY CAR ROUTE
router.delete("/:id", middleware.checkCarOwnership, function(req, res){
	Car.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/cars");
		} else {
			res.redirect("/cars");
		}
	})
});

// router.delete("/:id", async(req, res) => {
//   try {
//     let foundCar = await Car.findById(req.params.id);
//     await foundCar.remove();
//     res.redirect("/cars");
//   } catch (error) {
//     console.log(error.message);
//     res.redirect("/cars");
//   }
// });






module.exports = router; 