
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        var confirmPassword = $('[name=password-confirm]').val();
        if(password === confirmPassword) {
          Accounts.createUser({
              email: email,
              password: password,
              profile: {
                username: username
              }
          });
        } else {
          console.log("Password do not match.");
        }

    }
});
