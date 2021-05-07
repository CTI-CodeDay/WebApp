import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import { cordovaDot } from '../../utils/cordovaUtils';
import upArrowColorIcon from '../../../img/global/icons/up-arrow-color-icon.svg';
import downArrowColorIcon from '../../../img/global/icons/down-arrow-color-icon.svg';
import mixedRatingIcon from '../../../img/global/icons/mixed-rating-icon.svg';

export default class PositionRatingSnippet extends Component {
  render () {
    renderLog('PositionRatingSnippet');  // Set LOG_RENDER_EVENTS to log all renders
    const displayName = this.props.ballot_item_display_name;
    const rating = this.props.vote_smart_rating;
    const ratingTimeSpan = this.props.vote_smart_time_span;
    const showRatingDescriptionFunction = this.props.show_rating_description;
    let src;
    let className;
    let alt;

    if (rating >= 65) {
      src = cordovaDot(upArrowColorIcon);
      className = 'position-rating__icon position-rating__icon--positive u-cursor--pointer';
      alt = 'Positive Rating';
    } else if (rating < 35) {
      src = cordovaDot(downArrowColorIcon);
      className = 'position-rating__icon position-rating__icon--negative u-cursor--pointer';
      alt = 'Negative Rating';
    } else {
      src = cordovaDot(mixedRatingIcon);
      className = 'position-rating__icon position-rating__icon--mixed u-cursor--pointer';
      alt = 'Mixed Rating';
    }

    return (
      <div className="position-rating">
        <span onClick={showRatingDescriptionFunction}>
          <img src={src} width="20" height="20" className={className} alt={alt} />
        </span>
        <div className="position-rating__text">
          <span className="position-rating__name">
            Gave
            {displayName}
          </span>
          <br />
          <span className="position-rating__rating u-cursor--pointer" onClick={showRatingDescriptionFunction}>
            <span className="position-rating__percentage" data-percentage={rating}>
              {rating}
              %
              {' '}
            </span>
            {' '}
            rating
            { ratingTimeSpan ? (
              <span className="position-rating__timestamp">
                {' '}
                in
                {ratingTimeSpan}
              </span>
            ) : null}
          </span>
        </div>
      </div>
    );
  }
}
PositionRatingSnippet.propTypes = {
  ballot_item_display_name: PropTypes.string,
  vote_smart_rating: PropTypes.string.isRequired,
  vote_smart_time_span: PropTypes.string.isRequired,
  show_rating_description: PropTypes.func,
};
