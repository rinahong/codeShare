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
    template: 'createDocument'
});
