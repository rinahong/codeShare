import React from 'react';
import { Meteor } from 'meteor/meteor'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

import List from '@material-ui/core/List';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import HistoryIcon from '@material-ui/icons/History';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';

import { Documents } from '../api/documents.js';
import { DocumentContents } from '../api/documentContents';
import { UserDocuments } from '../api/userDoc';


const drawerWidth = 240;
const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'right',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  toolbarBroadridgeLogo: {
    backgroundImage: 'url("/broadridgelogo.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

const LoginLink = props => <Link to="/signin" {...props} />;
const MyDocumentsLink = props => <Link to="/me/documents" {...props} />

// const NewDocumentsLink = props => <Link to="/documents/${docId}" {...props} />


class NavBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      username: ""
    };
    this.createDocument = this.createDocument.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    if(Meteor.userId()) {
      setTimeout(() => {
        let user = Meteor.user();
        if(user) {
          this.setState({username: user.username})
        }
      },300);
    }
  }


  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  createDocument() {
    var currentUser = Meteor.userId();

    Documents.insert({
      title: "Untitled Document",
      createdAt: new Date(), // current time
      createdBy: currentUser,
      mode: ""
    }, function (error, results) {
      if (error) {
        console.log("Documents Insert Failed: ", error.reason);
      } else {
        UserDocuments.insert({
          userId: currentUser,
          docId: results
        }, function (error, results) {
          if (error) {
            console.log("UserDocuments Insert Failed: ", error.reason);
          } else {
            console.log("No error!")
             window.location.reload()
          }
        })

      }
    });
  }

  signOut() {
      // event.preventDefault();
      console.log("--sign out--")
      Meteor.logout(function(error){
        if (error) {
            console.log("why error?", error.reason)
        } else {
          // window.location.reload();
          console.log("Signout successfully, but why not redirect???")
        }
      })
  }



  render() {
    // const {  } = this.props;
    const { classes, children, theme } = this.props;
    const { username } = this.state;
    
    return (
      <div className={classes.root}>
        <AppBar
          color="primary"
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>

          <Toolbar disableGutters={!this.state.open}>

            { (Meteor.userId())? ([  // Should be wrapped in the array
              <IconButton
                key="0"
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, this.state.open && classes.hide)}>
                <MenuIcon />
              </IconButton>,
              <Typography key="1" variant="title" color="inherit" className={classes.flex} style={{ marginRight: '20px' }}>Welcome, { username }</Typography>,
              <Button color="inherit" key='3' href="/signin" onClick={() => this.signOut()}>Sign Out </Button>
            ]) : (
                <Button key='4' color="inherit" component={LoginLink}>Login</Button>)}

          </Toolbar>
        </AppBar>

        { Meteor.userId() ? ([  // Should be wrapped in the array
          <Drawer
            key="5"
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}>
            <div className={classes.toolbarBroadridgeLogo}>
              {/* <img src="" /> */}

              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <List>
              <div>
                <ListItem button key='2' component={MyDocumentsLink}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>



                <ListItem button onClick={this.createDocument} component={MyDocumentsLink}>
                  <ListItemIcon>
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="New Document" />
                </ListItem>


                {/* <ListItem button>
                  <ListItemIcon>
                    <GetAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Download" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="History" />
                </ListItem> */}
              </div>
            </List>
            <Divider />
            {/* <List>

              <div>
                <ListItem button>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </ListItem>
              </div>
            </List> */}
          </Drawer>,
          <main key="6" className={classes.content}>
            <div className={classes.toolbar} />
            {children}
          </main>
        ]) : (
            <main key="7" className={classes.content}>
              <div className={classes.toolbar} />
              {children}
            </main>
          )}
      </div>
    );
  }


}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NavBar);
