// Database that houses all of the pre-generated coupon codes 
CouponCodeDB = new Meteor.Collection('couponCodeDB');

// Database that houses all of the participants in the contest
ParticipantDB = new Meteor.Collection('participantDB');

if (Meteor.isClient) {

  Template.contestForm.helpers({
  
  /*  
      yourCode returns the coupon code assigned to that person's email address
      after the participant has submitted their info and they're in ParticipantDB. 
  */
    yourCode : function(){
    //  var emailAddyValue = Session.get(emailAddy);
    //  console.log(emailAddyValue);
    //  var couponCodeValue = ParticipantDB.findOne({emailAddy: emailAddyValue}).couponCode; 
      return Session.get("currentCoupon");
    } 
  });

  Template.printOut.helpers({
    
    // participant helper loops through all the participants and shows them in a table. 
    participant : function(){
      return ParticipantDB.find({});
    },
    
    // Helps to display all the coupon codes existing in the DB. 
    // Will kill once this is final.
    couponCodes : function(){
      return CouponCodeDB.find({});
    }
  
  });

  Template.contestForm.events({
    
    /* 
      Inserts the participant after they've entered their info and clicked
      on the button with id of getIt. 
    */
    'click #getIt' : function(event, template){
      
      // fullName & emailAddy Grab the data out of the template
      var fullName = template.find('#fullName').value;
      var emailAddy = template.find('#emailAddy').value.toLowerCase();
      
      // currentParticipantCount figures out how many people have signed up + 1
      var currentParticipantCount = (ParticipantDB.find().count() + 1 ).toString();
      
      /* 
          couponCode Looks up the predetermined coupon code based on how many people
          have signed up. If 5 people have signed up we will give this new person
          the 6th coupon code in the database.
      */
      var couponCode = CouponCodeDB.findOne({_id: currentParticipantCount}).code; 
      
        Session.set("currentCoupon", couponCode);
        // Take all the variables and insert them into the ParticipantDB
        Meteor.call('insertParticipant', fullName, emailAddy, couponCode);
    }

  });

  Template.printOut.events({
    'click #removeParticipant' : function(){
      ParticipantDB.remove(this._id);
    }
  });


}

if (Meteor.isServer) {

    // Method that actually insert the various variables into ParticipantDB
    Meteor.methods({
      'insertParticipant' : function(fullName, emailAddy, couponCode){
        ParticipantDB.insert({
          fullName: fullName,
          emailAddy: emailAddy,
          couponCode: couponCode
        });
      }
    });

}
