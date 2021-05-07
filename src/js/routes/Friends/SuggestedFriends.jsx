import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import SuggestedFriendList from '../../components/Friends/SuggestedFriendList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import MessageCard from '../../components/Widgets/MessageCard';
import { renderLog } from '../../utils/logging';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';

export default class SuggestedFriends extends Component {
  constructor (props) {
    super(props);
    this.state = {
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    FriendActions.suggestedFriendList();
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    this.setState({
      suggestedFriendList,
    });

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    this.setState({
      suggestedFriendList,
    });
  }

  render () {
    renderLog('SuggestedFriend');  // Set LOG_RENDER_EVENTS to log all renders
    const { suggestedFriendList } = this.state;

    return (
      <div className="opinion-view">
        <Helmet title="People You May Know - We Vote" />
        <SectionTitle>
          People You May Know
          { suggestedFriendList && suggestedFriendList.length > 0 && (
            <>
              {' '}
              (
              {suggestedFriendList.length}
              )
            </>
          )}
        </SectionTitle>
        <div>
          { suggestedFriendList && suggestedFriendList.length > 0 ? (
            <span>
              <SuggestedFriendList
                friendList={suggestedFriendList}
                editMode
              />
            </span>
          ) : (
            <MessageCard
              mainText="You currently have no suggested friends. Send some invites to connect with your friends!"
              buttonText="Invite Friends"
              buttonURL="/friends/invite"
            />
          )}
        </div>
      </div>
    );
  }
}

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
