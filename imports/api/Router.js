Router.route('/', {
    template: 'login'
});

Router.route('/signin', {
    template: 'login'
});

Router.route('/register', {
    template: 'register'
});

Router.route('/users/:_id', {
    template: 'docLists',
    onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next();
        } else {
            this.render("login");
        }
    }
});


// Router.route('/list/:_id', {
//     name: 'listPage',
//     template: 'listPage',
//     data: function(){
//         var currentList = this.params._id;
//         var currentUser = Meteor.userId();
//         return Lists.findOne({ _id: currentList, createdBy: currentUser });
//     },
//     onBeforeAction: function(){
//         var currentUser = Meteor.userId();
//         if(currentUser){
//             this.next();
//         } else {
//             this.render("login");
//         }
//     }
// });
