if (Meteor.isClient) {
  Meteor.startup(function(){
    Stripe.setPublishableKey(Meteor.settings.public.StripePub);
  });

  Session.setDefault("hasAttachedCard", true);

  Template.body.helpers({
    "hasAttachedCard": function(){
      return Session.get("hasAttachedCard");
    },
    "loadingCardInfo": function(){
      loadCardInfo();
      return Session.get("loadingCardInfo");
    },
    "cardInfo": function(){
      return Session.get("cardInfo");
    }
  });

  function loadCardInfo(){
    Meteor.call("loadCardInfo", function(err, data){
      if(err == null){
        Session.set("hasAttachedCard", data.hasCard);
        if(data.hasCard){
          Session.set("cardInfo", data.cardInfo);
          Session.set("loadingCardInfo", false);
        }
      }
    });
  }

  Template.body.events({
    "submit .payment-form": function(event){
      event.preventDefault();

      var cardDetails = {
        "number": event.target.cardNumber.value,
        "cvc": event.target.cardCVC.value,
        "exp_month": event.target.cardExpiryMM.value,
        "exp_year": event.target.cardExpiryYY.value
      }

      Stripe.createToken(cardDetails, function(status, result){
        if(result.error){
          alert(result.error.message);
        }else{
          Meteor.call("chargeCard", result.id, function(err, response){
            if(err){
              alert(err.message);
            }else{
              console.log(response);
              alert("You were successfully charged:" + response);
            }
          })
        }
      })
    },
    "click #chargeUser": function(event){

    }
  })
}

if (Meteor.isServer) {
  var stripe = StripeAPI(Meteor.settings.StripePri);

  Meteor.methods({
    "addCard": function(cardToken){

    },
    "loadCardInfo": function(){

    },
    "chargeUser": function(){

    }
  })
}
