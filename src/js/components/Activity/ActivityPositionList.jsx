import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import VoterGuidePositionItem from '../VoterGuide/VoterGuidePositionItem';
import ShowMoreItems from '../Widgets/ShowMoreItems';


const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 6;

class ActivityPositionList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loadingMoreItems: false,
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('ActivityPositionList componentDidMount');
    if (this.props.startingNumberOfPositionsToDisplay && this.props.startingNumberOfPositionsToDisplay > 0) {
      this.setState({
        numberOfPositionItemsToDisplay: this.props.startingNumberOfPositionsToDisplay,
      });
    }
  }

  componentWillUnmount () {
    if (this.positionItemTimer) {
      clearTimeout(this.positionItemTimer);
      this.positionItemTimer = null;
    }
  }

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfPositionItemsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfPositionItemsToDisplay);

    numberOfPositionItemsToDisplay += 2;
    // console.log('Number of position items after increment: ', numberOfPositionItemsToDisplay);

    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfPositionItemsToDisplay,
      });
    }, 500);
  }

  render () {
    const { incomingPositionList, organizationWeVoteId } = this.props;
    renderLog('ActivityPositionList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ActivityPositionList render');
    if (!incomingPositionList) {
      // console.log('ActivityPositionList Loading...');
      return null;
    }
    const { loadingMoreItems, numberOfPositionItemsToDisplay } = this.state;
    let positionsExist = false;
    let count;
    for (count = 0; count < incomingPositionList.length; count++) {
      positionsExist = true;
    }
    if (!positionsExist) {
      return null;
    }

    let numberOfPositionItemsDisplayed = 0;
    return (
      <div>
        <ul className="card-child__list-group">
          {incomingPositionList.map((onePosition) => {
            // console.log('onePosition:', onePosition);
            // console.log('numberOfPositionItemsDisplayed:', numberOfPositionItemsDisplayed);
            if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
              return null;
            }
            numberOfPositionItemsDisplayed += 1;
            // console.log('numberOfBallotItemsDisplayed: ', numberOfBallotItemsDisplayed);
            return (
              <div key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}>
                <VoterGuidePositionItem
                  // ballotItemDisplayName={onePosition.ballot_item_display_name}
                  ballotItemWeVoteId={onePosition.ballot_item_we_vote_id}
                  organizationWeVoteId={organizationWeVoteId}
                  positionWeVoteId={onePosition.position_we_vote_id}
                />
              </div>
            );
          })}
        </ul>
        <ShowMoreItemsWrapper onClick={this.increaseNumberOfPositionItemsToDisplay}>
          {!!(incomingPositionList && incomingPositionList.length > 1) && (
            <ShowMoreItems
              loadingMoreItemsNow={loadingMoreItems}
              numberOfItemsDisplayed={numberOfPositionItemsDisplayed}
              numberOfItemsTotal={incomingPositionList.length}
            />
          )}
        </ShowMoreItemsWrapper>
        <LoadingItemsWheel>
          {(loadingMoreItems) && (
            <CircularProgress />
          )}
        </LoadingItemsWheel>
      </div>
    );
  }
}
ActivityPositionList.propTypes = {
  incomingPositionList: PropTypes.array.isRequired,
  organizationWeVoteId: PropTypes.string.isRequired,
  startingNumberOfPositionsToDisplay: PropTypes.number,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const LoadingItemsWheel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShowMoreItemsWrapper = styled.div`
  margin-bottom: 0px;
  padding-left: 16px;
  padding-right: 26px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-right: 16px;
  }
  @media print{
    display: none;
  }
`;

export default withStyles(styles)(ActivityPositionList);
