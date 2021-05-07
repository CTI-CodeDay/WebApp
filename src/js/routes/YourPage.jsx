import React, { Component } from 'react';
import { historyPush } from '../utils/cordovaUtils';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import TwitterHandleBox from '../components/Twitter/TwitterHandleBox';
import VoterActions from '../actions/VoterActions';
import VoterStore from '../stores/VoterStore';

// This file is only for use with people who aren't signed in
export default class YourPage extends Component {
  constructor (props) {
    super(props);
    this.state = { voter: VoterStore.getVoter() };
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillMount () {
    const { voter } = this.state;

    const voterHasTwitterHandle = !!voter.twitter_screen_name;
    if (voterHasTwitterHandle) {
      historyPush(`/${voter.twitter_screen_name}`);
    }

    const voterHasPublicPage = !!voter.linked_organization_we_vote_id;
    if (voterHasPublicPage) {
      historyPush(`/voterguide/${voter.linked_organization_we_vote_id}`);
    }
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    let showOnlyThisElection = true;
    let showAllOtherElections = false;
    VoterActions.positionListForVoter(showOnlyThisElection, showAllOtherElections);
    showOnlyThisElection = false;
    showAllOtherElections = true;
    VoterActions.positionListForVoter(showOnlyThisElection, showAllOtherElections);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillUpdate () {
    const { voter } = this.state;

    const voterHasTwitterHandle = !!voter.twitter_screen_name;
    if (voterHasTwitterHandle) {
      historyPush(`/${voter.twitter_screen_name}`);
    }

    const voterHasPublicPage = !!voter.linked_organization_we_vote_id;
    if (voterHasPublicPage) {
      historyPush(`/voterguide/${voter.linked_organization_we_vote_id}`);
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog('YourPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.voter === undefined) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    return (
      <div>
        <div className="container-fluid well u-stack--md u-inset--md">
          <h1 className="h4">
            Enter your Twitter handle to create a public voter guide.
          </h1>
          <div>
            <TwitterHandleBox />
          </div>
        </div>
      </div>
    );
  }
}
