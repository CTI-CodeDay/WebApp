import { MoreHoriz } from '@mui/icons-material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import IssueStore from '../../stores/IssueStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import ValueIconAndText from './ValueIconAndText';

// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item
class IssuesByBallotItemDisplayList extends Component {
  static closePopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);
    this.state = {
      maximumNumberOfIssuesToDisplay: 26,
      expandIssues: false,
      totalWidth: null,
      totalRemainingWidth: null,
      issuesToRender: [],
      issuesToRenderLength: 0,
      issueRenderCount: 0,
    };
    this.issuesList = React.createRef();
    // This is meant to live outside of state.
    this.issueWidths = {};
  }

  componentDidMount () {
    // console.log('IssuesByBallotItemDisplayList componentDidMount, this.props.ballotItemWeVoteId:', this.props.ballotItemWeVoteId);
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    // const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId) || [];
    // const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId) || [];
    // const issuesToRender = issuesUnderThisBallotItemVoterIsFollowing.concat(issuesUnderThisBallotItemVoterIsNotFollowing);
    // const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
    // const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
    const issuesSupportingThisBallotItemVoterIsFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId) || [];
    const issuesSupportingThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId) || [];
    const issuesToRender = issuesSupportingThisBallotItemVoterIsFollowing.concat(issuesSupportingThisBallotItemVoterIsNotFollowing);
    const issuesSupportingThisBallotItemVoterIsFollowingLength = issuesSupportingThisBallotItemVoterIsFollowing.length;
    const issuesSupportingThisBallotItemVoterIsNotFollowingLength = issuesSupportingThisBallotItemVoterIsNotFollowing.length;
    const issuesToRenderLength = issuesToRender.length;
    const { ballotItemDisplayName, ballotItemWeVoteId, expandIssuesByDefault } = this.props;
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      expandIssues: expandIssuesByDefault || false,
      issuesToRender,
      issuesToRenderLength,
      issuesSupportingThisBallotItemVoterIsFollowingLength,
      issuesSupportingThisBallotItemVoterIsNotFollowingLength,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('IssuesByBallotItemDisplayList componentWillReceiveProps, nextProps.ballotItemWeVoteId:', nextProps.ballotItemWeVoteId);
    const issuesSupportingThisBallotItemVoterIsFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterIsFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesSupportingThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterNotFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesToRender = issuesSupportingThisBallotItemVoterIsFollowing.concat(issuesSupportingThisBallotItemVoterIsNotFollowing);
    const issuesSupportingThisBallotItemVoterIsFollowingLength = issuesSupportingThisBallotItemVoterIsFollowing.length;
    const issuesSupportingThisBallotItemVoterIsNotFollowingLength = issuesSupportingThisBallotItemVoterIsNotFollowing.length;
    const issuesToRenderLength = issuesToRender.length;
    const { ballotItemDisplayName, ballotItemWeVoteId } = nextProps;
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      issuesToRender,
      issuesToRenderLength,
      issuesSupportingThisBallotItemVoterIsFollowingLength,
      issuesSupportingThisBallotItemVoterIsNotFollowingLength,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      // console.log('this.state.ballotItemWeVoteId: ', this.state.ballotItemWeVoteId, ', nextState.ballotItemWeVoteId', nextState.ballotItemWeVoteId);
      return true;
    }
    if (this.state.expandIssues !== nextState.expandIssues) {
      // console.log('this.state.expandIssues: ', this.state.expandIssues, ', nextState.expandIssues', nextState.expandIssues);
      return true;
    }
    if (this.state.issuesSupportingThisBallotItemVoterIsFollowingLength !== nextState.issuesSupportingThisBallotItemVoterIsFollowingLength) {
      // console.log('this.state.issuesSupportingThisBallotItemVoterIsFollowingLength: ', this.state.issuesSupportingThisBallotItemVoterIsFollowingLength, ', nextState.issuesSupportingThisBallotItemVoterIsFollowingLength', nextState.issuesSupportingThisBallotItemVoterIsFollowingLength);
      return true;
    }
    if (this.state.issuesSupportingThisBallotItemVoterIsNotFollowingLength !== nextState.issuesSupportingThisBallotItemVoterIsNotFollowingLength) {
      // console.log('this.state.issuesSupportingThisBallotItemVoterIsNotFollowingLength: ', this.state.issuesSupportingThisBallotItemVoterIsNotFollowingLength, ', nextState.issuesSupportingThisBallotItemVoterIsNotFollowingLength', nextState.issuesSupportingThisBallotItemVoterIsNotFollowingLength);
      return true;
    }
    if (this.state.totalWidth !== nextState.totalWidth) {
      return true;
    }
    if (this.state.totalRemainingWidth !== nextState.totalRemainingWidth) {
      return true;
    }
    if (this.state.issuesToRender !== nextState.issuesToRender) {
      return true;
    }
    if (this.state.issueRenderCount !== nextState.issueRenderCount) {
      return true;
    }
    return false;
  }

  componentDidUpdate () {
    // console.log('IssuesByBallotItemDisplayList componentDidUpdate');
    if (this.issuesList.current && this.state.totalWidth === null && this.state.totalRemainingWidth === null) {
      this.setState({
        totalWidth: this.issuesList.current.offsetWidth,
        totalRemainingWidth: this.issuesList.current.offsetWidth,
      });
    }
  }

  componentWillUnmount () {
    if (this.timer) clearTimeout(this.timer);
    if (this.timer2) clearTimeout(this.timer2);
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    // console.log('IssuesByBallotItemDisplayList onIssueStoreChange, signInModalGlobalState:', signInModalGlobalState);
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('IssuesByBallotItemDisplayList, onIssueStoreChange');
      const { ballotItemWeVoteId, issueRenderCount } = this.state;
      const issuesSupportingThisBallotItemVoterIsFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterIsFollowing(ballotItemWeVoteId) || [];
      const issuesSupportingThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterNotFollowing(ballotItemWeVoteId) || [];
      const issuesToRender = issuesSupportingThisBallotItemVoterIsFollowing.concat(issuesSupportingThisBallotItemVoterIsNotFollowing);
      const issuesSupportingThisBallotItemVoterIsFollowingLength = issuesSupportingThisBallotItemVoterIsFollowing.length;
      const issuesSupportingThisBallotItemVoterIsNotFollowingLength = issuesSupportingThisBallotItemVoterIsNotFollowing.length;
      const issuesToRenderLength = issuesToRender.length;
      this.setState({
        issuesSupportingThisBallotItemVoterIsFollowingLength,
        issuesSupportingThisBallotItemVoterIsNotFollowingLength,
        issuesToRender,
        issuesToRenderLength,
      });
      if (issuesToRender.length > 0 && issueRenderCount === 0) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.handleDelayedIssueRender, 50);
      }
    }
  }

  onVoterGuideStoreChange () {
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('IssuesByBallotItemDisplayList, onVoterGuideStoreChange');

      // We just want to trigger a re-render, if SignInModal is not in use
      this.setState();
    }
  }

  handleEnterHoverLocalArea = () => {
    if (this.props.handleLeaveCandidateCard) {
      this.props.handleLeaveCandidateCard();
    }
  };

  handleExpandIssues = () => {
    const { expandIssues, issuesToRenderLength } = this.state;
    this.setState({
      expandIssues: !expandIssues,
      issueRenderCount: issuesToRenderLength,
    });
  };

  handleLeaveHoverLocalArea = () => {
    if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  };

  handleSubtractTotalRemainingWidth = (issueWeVoteId, width) => {
    const { totalWidth } = this.state;
    this.issueWidths[issueWeVoteId] = width;
    // const totalWidthOccupied = Object.values(this.issueWidths).reduce((a, b) => a + b);  This is very elegant, but did not work in cordova
    let totalWidthOccupied = 0;
    Object.keys(this.issueWidths).map((key) => {  // eslint-disable-line array-callback-return
      totalWidthOccupied += this.issueWidths[key];
    });

    this.setState({ totalRemainingWidth: totalWidth - totalWidthOccupied });
  };

  handleDelayedIssueRender = () => {
    // console.log('handleDelayedIssueRender ----------------');
    const { issueRenderCount, issuesToRenderLength, totalRemainingWidth } = this.state;
    // Get the remaining width with some allowed buffer room
    const bufferedRemainingWidth = totalRemainingWidth + 40;
    // Estimate the minimum possible remaining width after the next chip is rendered
    const minimumNextRemainingWidth = totalRemainingWidth - 60;
    // Increase/decrease the issues rendered count based on the buffered remaining width
    const change = bufferedRemainingWidth > 0 ? 1 : -1;
    const newIssueRenderCount = issueRenderCount + change;
    // If the rendered count < total issues to render, and
    // If the next issue render count is higher:
    //     Render if the minimum next remaining width is positive
    // If the next issue render count is lower:
    //     Render if the buffered remaining width is negative
    const shouldDoAnotherRender = (change > 0 ? minimumNextRemainingWidth > 0 : bufferedRemainingWidth < 0) && issueRenderCount < issuesToRenderLength;

    if (shouldDoAnotherRender) {
      this.setState({ issueRenderCount: newIssueRenderCount });
      if (change > 0) {
        if (this.timer2) clearTimeout(this.timer2);
        this.timer2 = setTimeout(this.handleDelayedIssueRender, 5);
      }
    }
  }

  render () {
    renderLog('IssuesByBallotItemDisplayList.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('IssuesByBallotItemDisplayList render');
    const { externalUniqueId } = this.props;
    const {
      ballotItemDisplayName, ballotItemWeVoteId, expandIssues,
      maximumNumberOfIssuesToDisplay,
      totalRemainingWidth, issuesToRender, // issuesToRenderLength, issueRenderCount,
    } = this.state;

    // console.log('this.state.ballotItemWeVoteId: ', ballotItemWeVoteId);
    // console.log('issuesToRender: ', issuesToRender);
    if (!issuesToRender || !issuesToRender.length) {
      // If we don't have any endorsement text, show the alternate component passed in
      // console.log('no issues to render');
      return this.props.children || null;
    }

    const issueRenderCountTemp = issuesToRender.length;
    let issueFollowedByVoter = false;
    let localCounter = 0;
    const issuesChips = issuesToRender.slice(0, issueRenderCountTemp).map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        // console.log('oneIssue.issue_name: ', oneIssue.issue_name);
        localCounter++;
        if (localCounter <= maximumNumberOfIssuesToDisplay) {
          issueFollowedByVoter = IssueStore.isVoterFollowingThisIssue(oneIssue.issue_we_vote_id);
          return (
            <ValueIconAndText
              key={oneIssue.issue_we_vote_id}
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={ballotItemWeVoteId}
              externalUniqueId={externalUniqueId}
              issueFollowedByVoter={issueFollowedByVoter}
              issueWidths={this.issueWidths}
              oneIssue={oneIssue}
              subtractTotalWidth={this.handleSubtractTotalRemainingWidth}
            />
          );
        } else {
          return null;
        }
      },
    );

    return (
      <Wrapper
        onBlur={this.handleLeaveHoverLocalArea}
        onFocus={this.handleEnterHoverLocalArea}
        onMouseOut={this.handleLeaveHoverLocalArea}
        onMouseOver={this.handleEnterHoverLocalArea}
      >
        <Issues>
          {/* Show a break-down of the current positions in your network */}
          <div ref={this.issuesList}>
            <IssueList
              key={`issuesByBallotItemDisplayList-${ballotItemWeVoteId}`}
              expandIssues={expandIssues}
            >
              {issuesChips}
            </IssueList>
          </div>
        </Issues>
        {(expandIssues || this.props.disableMoreWrapper || totalRemainingWidth > 0) ? null : (
          <MoreWrapper id="issuesByBallotItemDisplayListMoreIssuesIcon" onClick={this.handleExpandIssues}>
            <MoreHoriz />
          </MoreWrapper>
        )}
      </Wrapper>
    );
  }
}
IssuesByBallotItemDisplayList.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string,
  children: PropTypes.object,
  disableMoreWrapper: PropTypes.bool,
  expandIssuesByDefault: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  handleLeaveCandidateCard: PropTypes.func,
  handleEnterCandidateCard: PropTypes.func,
};

const Wrapper = styled('div')`
  overflow: unset;
  overflow-x: unset;
  overflow-y: unset;
`;

const Issues = styled('div')`
  // width: 100%;
  margin-left: 0;
`;

const IssueList = styled('ul', {
  shouldForwardProp: (prop) => !['expandIssues'].includes(prop),
})(({ expandIssues }) => (`
  display: flex;
  flex-flow: row${expandIssues ? ' wrap' : ''};
  margin-bottom: 8px;
  overflow: hidden;
  padding-inline-start: 0;
`));

const MoreWrapper = styled('p')`
  align-items: center;
  background-image: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
  cursor: pointer;
  display: inline;
  flex-flow: row;
  height: 30px;
  margin-top: -3px;
  margin-bottom: 8px;
  padding-left: 4px;
  position: absolute;
  right: 8px;
`;

export default IssuesByBallotItemDisplayList;
