import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Info } from '@material-ui/icons';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import MeasureStore from '../../stores/MeasureStore';
import AppStore from '../../stores/AppStore';
import ReadMore from '../Widgets/ReadMore';
import { capitalizeString } from '../../utils/textFormat';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';

class MeasureItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemDisplayName: '',
      // measureSubtitle: '',
      measureText: '',
      measureWeVoteId: '',
      electionDisplayName: '',
      regionalDisplayName: '',
      stateCode: '',
      stateDisplayName: '',
      showPositionStatementActionBar: true,
      // scrolledDown: AppStore.getScrolledDown(),
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
  }

  componentDidMount () {
    this.onMeasureStoreChange();
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.appStoreListener.remove();
  }

  onMeasureStoreChange () {
    const measure = MeasureStore.getMeasure(this.props.measureWeVoteId);
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      // measureSubtitle: measure.measure_subtitle,
      measureText: measure.measure_text,
      measureWeVoteId: measure.we_vote_id,
      electionDisplayName: measure.election_display_name,
      regionalDisplayName: measure.regional_display_name,
      stateCode: measure.state_code,
      stateDisplayName: measure.state_display_name,
    });
  }

  onAppStoreChange () {
    this.setState({
      // scrolledDown: AppStore.getScrolledDown(),
    });
  }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organization.organization_we_vote_id}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  render () {
    renderLog('MeasureItem');  // Set LOG_RENDER_EVENTS to log all renders
    // const { supportProps, transitioning } = this.state;
    const { classes, forMoreInformationSeeBallotpediaOff } = this.props;
    let {
      ballotItemDisplayName, stateDisplayName,
    } = this.state;
    const {
      measureText, measureWeVoteId, electionDisplayName, regionalDisplayName, stateCode,
    } = this.state;
    if (stateDisplayName === undefined && stateCode) {
      stateDisplayName = stateCode.toUpperCase();
    }

    const numberOfLines = 2;
    // measureSubtitle = capitalizeString(measureSubtitle);
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    return (
      <MeasureItemWrapper className="card-main">
        <InfoRow>
          <MeasureInfoWrapper onClick={() => { this.goToMeasureLink(measureWeVoteId); }}>
            <Title>
              {ballotItemDisplayName}
            </Title>
          </MeasureInfoWrapper>
          <BallotItemSupportOpposeCountDisplayWrapper>
            <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={measureWeVoteId} />
          </BallotItemSupportOpposeCountDisplayWrapper>
        </InfoRow>
        <InfoDetailsRow>
          { electionDisplayName || regionalDisplayName || stateDisplayName ?
            (
              <SubTitle>
                { electionDisplayName || 'Appearing on the ballot in ' }
                { electionDisplayName ? <span> &middot; </span> : null }
                { regionalDisplayName || null }
                { regionalDisplayName && stateDisplayName ? ', ' : null }
                { stateDisplayName }
              </SubTitle>
            ) :
            null}
          {/* <SubTitle>{measureSubtitle}</SubTitle> */}
        </InfoDetailsRow>
        { measureText && (
          <MeasureTextWrapper>
            <ReadMore
              numberOfLines={numberOfLines}
              textToDisplay={measureText}
            />
          </MeasureTextWrapper>
        )}
        {!forMoreInformationSeeBallotpediaOff && (
          <ForMoreInformationSeeBallotpedia className="u-show-desktop-tablet">
            <Info classes={{ root: classes.informationIcon }} />
            If you want to learn more, click the Ballotpedia and Google Search buttons to the right.
          </ForMoreInformationSeeBallotpedia>
        )}
        <BallotItemSupportOpposeComment
          ballotItemWeVoteId={measureWeVoteId}
          externalUniqueId="measureItem"
          showPositionStatementActionBar={this.state.showPositionStatementActionBar}
        />
      </MeasureItemWrapper>
    );
  }
}
MeasureItem.propTypes = {
  classes: PropTypes.object,
  forMoreInformationSeeBallotpediaOff: PropTypes.bool,
  measureWeVoteId: PropTypes.string.isRequired,
  // theme: PropTypes.object,
};

const styles = (theme) => ({
  cardRoot: {
    padding: '16px 16px 8px 16px',
    [theme.breakpoints.down('lg')]: {
      padding: '16px 16px 0 16px',
    },
  },
  endorsementIconRoot: {
    fontSize: 14,
    margin: '.3rem .3rem 0 .5rem',
  },
  cardHeaderIconRoot: {
    marginTop: '-.3rem',
    fontSize: 20,
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .4rem',
  },
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
});

const BallotItemSupportOpposeCountDisplayWrapper = styled.div`
  cursor: pointer;
  float: right;
`;

const ForMoreInformationSeeBallotpedia = styled.div`
  color: #999;
`;

const InfoRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const InfoDetailsRow = styled.div`
`;

const MeasureInfoWrapper = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 75%;
  cursor: pointer;
  user-select: none;
  padding-right: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 70%;
  }
`;

const MeasureItemWrapper = styled.div`
`;

const MeasureTextWrapper = styled.div`
  color: #999;
  padding-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: .1rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 16px;
  }
`;

const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 300;
  color: #555;
  margin-bottom: 4px;
  margin-top: .6rem;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 13px;
  }
`;

export default withTheme(withStyles(styles)(MeasureItem));
