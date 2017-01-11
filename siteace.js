


Websites = new Mongo.Collection("websites");

if (Meteor.isClient) {

	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({});
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;

			console.log("Up voting website with id "+website_id);
			
			// put the code in here to add a vote to a website!
			var upvote; 
			Websites.update({_id:website_id},
							{$set: {upvote: this.upvote+1}});

			console.log("Website: "+website_id+" upvote now: "+(this.upvote+1));

			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			var downvote;
			Websites.update({_id:website_id},
							{$set: {downvote: this.downvote+1}});
			console.log("Website: "+website_id+" downvote now: "+(this.downvote+1));

			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		// when someone submits form with js-save-website-form class..
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			console.log("The url they entered is: "+url);
			
			// get title and description out of form:
			var title, description, upvote, downvote;
			title = event.target.title.value;
			description = event.target.description.value;

			//  put your website saving code in here!	
			if(Meteor.user()){ // user logged in
				Websites.insert({
					url:url,
					title:title,
					description:description,
					upvote:0,
					downvote:0
				})
			}

			return false;// stop the form submit from reloading the page

		}
	});

	// helper function to provide username
	Template.body.helpers({username:function(){
		if(Meteor.user()){ //user logged in
			return Meteor.user().username;
			// provides e-mail
			//return Meteor.user().emails[0].address;
		}
		else {
			return "anonymous";
		}
	}
	});

	// user username instead of e-mail when greeting
	Accounts.ui.config({	// adds username field to signup form
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});
}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date(),
    		upvote:0,
    		downvote:0
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date(),
    		upvote:0,
    		downvote:0
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date(),
    		upvote:0,
    		downvote:0
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date(),
    		upvote:0,
    		downvote:0
    	});
    }
  });
}
