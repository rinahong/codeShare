import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});


function InsetList(props) {
  
  const { classes } = props;
  return (
    <div className={classes.root} >
      <List component="nav">
        <ListItem button>
          <ListItemText inset primary="Blah.p" secondary="Last Edit: Jan 21, 2018 12:58"/>
        </ListItem>
        <ListItem button>
          <ListItemText inset primary="untitleda.p" secondary="Last Edit: Jan 21, 2018 12:58" />
        </ListItem>
      </List>
    </div>
  );
}

InsetList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InsetList);