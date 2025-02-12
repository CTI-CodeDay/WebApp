import { Badge, Tab, Tabs } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';


class EndorsementModeTabs extends Component {
  constructor (props) {
    super(props);
    this.state = {
      getVoterGuideSettingsDashboardEditMode: '',
    };
  }

  componentDidMount () {
    // console.log('EndorsementModeTabs componentDidMount, this.props: ', this.props);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
  }

  // This needs to be tested before being turned back on
  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
  //   // console.log("EndorsementModeTabs shouldComponentUpdate");
  //   if (this.state.getVoterGuideSettingsDashboardEditMode !== nextState.getVoterGuideSettingsDashboardEditMode) {
  //     // console.log("shouldComponentUpdate: this.state.getVoterGuideSettingsDashboardEditMode", this.state.getVoterGuideSettingsDashboardEditMode, ", nextProps.getVoterGuideSettingsDashboardEditMode", nextProps.getVoterGuideSettingsDashboardEditMode);
  //     return true;
  //   }
  //   return false;
  // }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    this.setState({
      getVoterGuideSettingsDashboardEditMode: AppObservableStore.getVoterGuideSettingsDashboardEditMode(),
    });
  }

  getSelectedTab = () => {
    const { getVoterGuideSettingsDashboardEditMode } = this.state;
    switch (getVoterGuideSettingsDashboardEditMode) {
      case 'positions':
        return 0;
      default:
      case 'addpositions':
        return 1;
    }
  }

  goToDifferentVoterGuideSettingsDashboardTab (dashboardEditMode = '') {
    AppObservableStore.setVoterGuideSettingsDashboardEditMode(dashboardEditMode);
  }

  render () {
    renderLog('EndorsementModeTabs');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props; // constants ballotLength and ballotLengthRemaining are supposed to be included

    return (
      <Tabs
        value={this.getSelectedTab()}
        indicatorColor="primary"
        classes={{ root: classes.tabsRoot, flexContainer: classes.tabsFlexContainer, scroller: classes.scroller }}
      >
        {/* labelContainer: classes.tabLabelContainer, */}
        <Tab
          classes={{ root: classes.tabRoot }}
          id="allItemsCompletionLevelTab"
          onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('positions')}
          label={(
            <Badge>
              <span className="u-show-mobile">
                Endorsed
              </span>
              <span className="u-show-desktop-tablet">
                Endorsed or Opposed
              </span>
            </Badge>
          )}
        />
        {/* labelContainer: classes.tabLabelContainer, */}
        <Tab
          classes={{ root: classes.tabRoot }}
          id="remainingChoicesCompletionLevelTab"
          onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('addpositions')}
          label={(
            <Badge>
              <span className="u-show-mobile">
                Add Endorsements
              </span>
              <span className="u-show-desktop-tablet">
                Add Endorsements
              </span>
            </Badge>
          )}
        />
      </Tabs>
    );
  }
}
EndorsementModeTabs.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  badge: {
    top: 9,
    right: -14,
    minWidth: 16,
    width: 20,
    height: 19.5,
    [theme.breakpoints.down('md')]: {
      fontSize: 8,
      right: -11,
      width: 16,
      height: 16,
      top: 11,
    },
  },
  badgeColorPrimary: {
    background: 'rgba(0, 0, 0, .15)',
    color: '#333',
  },
  tabLabelContainer: {
    padding: '6px 6px',
    [theme.breakpoints.down('md')]: {
      padding: '6px 20px',
    },
  },
  tabsRoot: {
    minHeight: 38,
    height: 38,
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
    },
  },
  tabsFlexContainer: {
    height: 38,
  },
  tabRoot: {
    [theme.breakpoints.up('md')]: {
      minWidth: 200,
    },
  },
  indicator: {
    [theme.breakpoints.up('md')]: {
      minWidth: 200,
    },
  },
  scroller: {
    overflowY: 'hidden',
  },
});

export default withStyles(styles)(EndorsementModeTabs);

