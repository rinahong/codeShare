// Router.route('/', {
//     template: 'login'
// });
//
// Router.route('/signin', {
//     template: 'login'
// });
//
// Router.route('/register', {
//     template: 'register'
// });
//
// Router.route('/me/documents', {
//     template: 'docLists',
//     onBeforeAction: function(){
//         var currentUser = Meteor.userId();
//         if(currentUser){
//             this.next();
//         } else {
//             this.render("login");
//         }
//     }
// });
