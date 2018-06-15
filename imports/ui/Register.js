
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
          },function(error) {
            if(error) {
              console.log("Accounts.createUser Faild: ",error.reason);
            } else {
              Router.go('/documents');
            }
          });
        } else {
          console.log("Password do not match.");
        }

    }
});
