
Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

// Set up security on Websites collection
/* Websites.allow({
	insert:function(userId, doc){
		if(Meteor.user()){	// user logged in
			if(userId != doc.submittedBy){
				return false;
			}
			else {	// user logged in and website has correct user id
				return true;
			}
		}
		else {	// user not logged in
			return false;
		}
	}
})
*/