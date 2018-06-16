Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
              console.log(error.reason);
          } else {
            window.location.href = Meteor.absoluteUrl('/me/documents');
            // Below only render template not redirecting to the '/me/documents'
            // Router.go('/me/documents');
          }
      });
    }
});
