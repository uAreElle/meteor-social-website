
// routing
Router.configure({
	layoutTemplate: 'ApplicationLayout'	
	// global layout name in .html must match 
});

// Main page //

Router.route('/', function () {
	this.render('navbar', {
		to:"navbar"
	});
	this.render('welcome', {
		to:"hello",
	});
	this.render('website_form', {
		to:"form"
	});
	this.render('website_list', {
		to:"main"
	});
});

// Detail / Comments page //

Router.route('/:_id', function () {
	this.render('navbar', {
		to:"navbar"
	});
	this.render('website_detail', {	// render template website_detail into main
		to:"main",
		data:function(){
			return Websites.findOne({_id:this.params._id}); // use unique site id as address
		}
	}); 
	this.render('comment_form', {
		to:"cform"
	});
	this.render('comment_list', {
		to:"comments"
	}); 
});

/////
// template helpers 
/////

// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		return Websites.find({});
	}
});

// helper function to provide username
Template.welcome.helpers({
	username:function(){
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

// helper function that returns list of corresponding site comments
// and sorts by most recently posted
Template.comment_list.helpers({
	comments:function(){
		return Comments.find({siteId:Router.current().params._id},{sort:{createdOn:-1}});
	}
});
// helper function to sort by highest rated sites first
Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort:{upvote:-1}}); // -1 does ascending order
	}
});

// accounts config
Accounts.ui.config({	// adds username field to signup form
	passwordSignupFields: "USERNAME_AND_EMAIL"
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
		Websites.update({_id:website_id},
						{$set: {upvote:this.upvote+1}});

		console.log("Website: "+website_id+" upvote now: "+(this.upvote+1));

		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		console.log("Down voting website with id "+website_id);

		// put the code in here to remove a vote from a website!
		Websites.update({_id:website_id},
						{$set: {downvote:this.downvote+1}});
		console.log("Website: "+website_id+" downvote now: "+(this.downvote+1));

		return false;// prevent the button from reloading the page
	}
})

Template.website_form.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	},
	"submit .js-save-website-form":function(event){

		// here is an example of how to get the url out of the form:
		var url = event.target.url.value;
		console.log("The url they entered is: "+url);
		
		// get title and description out of form and declare votes:
		var title, description; // upvote, downvote;
		//title, description, upvote, downvote;
		title = event.target.title.value;
		description = event.target.description.value;

		
		Meteor.call("get_data", url, function(error, results){
			console.log("results: "+results);
			if(error){
				console.log(error);
			}
			else {				
				var el = "<div>" + 	results.content + "<div>";
				title = $('title', el).text();
				console.log("title: "+title);
				// fill text/descrition fields with meta data
				document.getElementById('title').value = title;
				description = $('meta[name="description"]', el).attr('content');
				document.getElementById('description').value = description;
				console.log("Title: "+title);
				console.log("Description: "+description);	
			}

		if(Meteor.user()){ // user logged in
			Websites.insert({
				url:url,
				title:title,
				description:description,
				createdOn:new Date(),
				upvote:0,
				downvote:0,
				submittedBy:Meteor.user().username
			})
		}
		else {
			alert('Please log in to submit websites.');
		}

		});

		return false;// stop the form submit from reloading the page

	}
});

Template.comment_form.events({
    "submit .js-save-comment-form":function(event){

    	// get comment out of form:
    	var comment = event.target.comment.value;
    	console.log("The comment they entered is: "+comment);

        if(Meteor.user()){	// user logged in
        	if(comment){
	        	Comments.insert({
	        		siteId:Router.current().params._id,
	        		comment:comment,
	        		createdOn:new Date(),
	        		writtenBy:Meteor.user().username
	        	})
        	}
        	else { // empty comment
        		alert('Please enter a comment.');
        	}
        }
        else {	// user not logged in
        	alert('Please log in to submit comments.');
        }

        return false;// stop the form comment submit from reloading page
    }
});
