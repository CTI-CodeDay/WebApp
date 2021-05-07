import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextTruncate from 'react-text-truncate';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import CandidateStore from '../../stores/CandidateStore';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import ImageHandler from '../ImageHandler';
import LearnMore from '../Widgets/LearnMore';
import { renderLog } from '../../utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import VoterGuideStore from '../../stores/VoterGuideStore';

export default class CandidateItemCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      oneCandidate: {},
      organization: {},
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    if (this.props.candidateWeVoteId) {
      const candidate = CandidateStore.getCandidate(this.props.candidateWeVoteId);
      this.setState({
        oneCandidate: candidate,
      });
    }
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log("officeItem nextProps", nextProps);
    if (nextProps.candidateWeVoteId) {
      const candidate = CandidateStore.getCandidate(nextProps.candidateWeVoteId);
      this.setState({
        oneCandidate: candidate,
      });
    }
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
        organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
      });
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState();
  }

  onOrganizationStoreChange () {
    const { organization_we_vote_id: organizationWeVoteId } = this.state.organization;
    // console.log("VoterGuideOfficeItemCompressed onOrganizationStoreChange, organizationWeVoteId: ", organizationWeVoteId);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    const { organization_we_vote_id: organizationWeVoteId } = this.state.organization;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  getCandidateLink (oneCandidateWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/candidate/${oneCandidateWeVoteId}/btvg/${this.state.organization.organization_we_vote_id}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/candidate/${oneCandidateWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  goToCandidateLink (oneCandidateWeVoteId) {
    const candidateLink = this.getCandidateLink(oneCandidateWeVoteId);
    historyPush(candidateLink);
  }

  render () {
    renderLog('CandidateItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.oneCandidate || !this.state.oneCandidate.we_vote_id) {
      return null;
    }

    const oneCandidateWeVoteId = this.state.oneCandidate.we_vote_id;
    const candidatePartyText = this.state.oneCandidate.party && this.state.oneCandidate.party.length ? `${this.state.oneCandidate.party}. ` : '';
    const candidateDescriptionText = this.state.oneCandidate.twitter_description && this.state.oneCandidate.twitter_description.length ? this.state.oneCandidate.twitter_description : '';
    const candidateText = candidatePartyText + candidateDescriptionText;
    const avatarCompressed = `card-main__avatar-compressed${isCordova() ? '-cordova' : ''} o-media-object__anchor u-cursor--pointer u-self-start u-push--sm`;

    return (
      <div key={oneCandidateWeVoteId} className="u-stack--md">
        <div className="u-float-right">
          <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={oneCandidateWeVoteId} />
        </div>
        <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
          {/* Candidate Photo, only shown in Desktop */}
          <Link to={this.getCandidateLink(this.state.oneCandidate.we_vote_id)}>
            <ImageHandler
              className={avatarCompressed}
              sizeClassName="icon-candidate-small u-push--sm "
              imageUrl={this.state.oneCandidate.candidate_photo_url_medium}
              alt="candidate-photo"
              kind_of_ballot_item="CANDIDATE"
            />
          </Link>
          <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
            {/* Candidate Name */}
            <h4 className="card-main__candidate-name u-f5">
              <Link to={this.getCandidateLink(this.state.oneCandidate.we_vote_id)}>
                <TextTruncate
                  line={1}
                  truncateText="…"
                  text={this.state.oneCandidate.ballot_item_display_name}
                  textTruncateChild={null}
                />
              </Link>
            </h4>
            {/* Description under candidate name */}
            <LearnMore
              text_to_display={candidateText}
              on_click={this.goToCandidateLink(this.state.oneCandidate.we_vote_id)}
              num_of_lines={3}
            />
          </div>
        </div>
      </div>
    );
  }
}
CandidateItemCompressed.propTypes = {
  candidateWeVoteId: PropTypes.string.isRequired,
  organization: PropTypes.object,
};
