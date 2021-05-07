import Dispatcher from '../dispatcher/Dispatcher';

export default {
  officeRetrieve (officeWeVoteId) {
    Dispatcher.loadEndpoint('officeRetrieve',
      {
        office_we_vote_id: officeWeVoteId,
      });
  },

  positionListForBallotItemPublic (ballotItemWeVoteId) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'OFFICE',
      });
  },

  positionListForBallotItemPrivateIndividualsOnly (ballotItemWeVoteId) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'OFFICE',
        private_citizens_only: true,
      });
  },

  positionListForBallotItemFromFriends (ballotItemWeVoteId) {
    Dispatcher.loadEndpoint('positionListForBallotItemFromFriends',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'OFFICE',
      });
  },
};
