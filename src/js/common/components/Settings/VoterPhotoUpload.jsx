import { AccountCircle } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import { DropzoneArea } from 'mui-file-dropzone';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import VoterActions from '../../../actions/VoterActions';
import VoterStore from '../../../stores/VoterStore';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';


class VoterPhotoUpload extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterProfileUploadedImageUrlLarge: '',
    };

    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount () {
    // console.log('VoterPhotoUpload, componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    // TODO Figure out how to add fileReader.removeEventListener
  }

  handleDrop (files) {
    if (files && files[0]) {
      const fileFromDropzone = files[0];
      if (!fileFromDropzone) return;
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        const photoFromFileReader = fileReader.result;
        // console.log('photoFromFileReader:', photoFromFileReader);
        VoterActions.voterPhotoQueuedToSave(photoFromFileReader);
      });
      fileReader.readAsDataURL(fileFromDropzone);
    }
  }

  onVoterStoreChange () {
    const voterProfileUploadedImageUrlLarge = VoterStore.getVoterProfileUploadedImageUrlLarge();
    this.setState({
      voterProfileUploadedImageUrlLarge,
    });
  }

  submitDeleteYourPhoto = () => {
    VoterActions.voterPhotoDelete();
    VoterActions.voterPhotoQueuedToSave(undefined);
  }

  render () {
    renderLog('VoterPhotoUpload');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, limitPhotoHeight, maxWidth } = this.props;
    const { voterProfileUploadedImageUrlLarge } = this.state;
    let dropzoneText = isMobileScreenSize() ? 'Upload profile photo' : 'Drag your profile photo here (or click to find file)';
    if (voterProfileUploadedImageUrlLarge) {
      dropzoneText = isMobileScreenSize() ? 'Upload new photo' : 'Drag new profile photo here (or click to find file)';
    }
    return (
      <OuterWrapper>
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              {voterProfileUploadedImageUrlLarge ? (
                <VoterPhotoWrapper limitPhotoHeight={limitPhotoHeight}>
                  <VoterPhotoImage maxWidth={maxWidth} src={voterProfileUploadedImageUrlLarge} alt="Profile Photo" />
                  <DeleteLink
                    className="u-link-color u-link-underline u-cursor--pointer"
                    onClick={this.submitDeleteYourPhoto}
                  >
                    remove photo
                  </DeleteLink>
                </VoterPhotoWrapper>
              ) : (
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  classes={{
                    icon: classes.dropzoneIcon,
                    root: classes.dropzoneRoot,
                    text: classes.dropzoneText,
                  }}
                  dropzoneText={dropzoneText}
                  filesLimit={1}
                  Icon={AccountCircle}
                  initialFiles={voterProfileUploadedImageUrlLarge ? [voterProfileUploadedImageUrlLarge] : undefined}
                  maxFileSize={6000000}
                  onChange={this.handleDrop}
                />
              )}
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </OuterWrapper>
    );
  }
}
VoterPhotoUpload.propTypes = {
  classes: PropTypes.object,
  limitPhotoHeight: PropTypes.bool,
  maxWidth: PropTypes.number,
};

const styles = (theme) => ({
  dropzoneIcon: {
    color: '#999',
  },
  dropzoneRoot: {
    color: '#999',
    minHeight: '162px',
    [theme.breakpoints.down('sm')]: {
      minHeight: '160px',
    },
  },
  dropzoneText: {
    color: '#818181',
    fontSize: '18px',
    fontFamily: "'Nunito Sans', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    fontWeight: '300',
    paddingLeft: 5,
    paddingRight: 5,
  },
});

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const DeleteLink = styled('div')`
`;

const OuterWrapper = styled('div')`
  width: 100%;
`;

const VoterPhotoImage = styled('img', {
  shouldForwardProp: (prop) => !['maxWidth'].includes(prop),
})(({ maxWidth }) => (`
  border-radius: 100px;
  max-width: 100px;
  ${maxWidth ? `max-width: ${maxWidth}px;` : 'max-width: 200px;'}
`));

const VoterPhotoWrapper = styled('div', {
  shouldForwardProp: (prop) => !['limitPhotoHeight'].includes(prop),
})(({ limitPhotoHeight }) => (`
  align-items: center;
  display: flex;
  flex-direction: column;
  ${limitPhotoHeight ? 'height: 130px;' : ''}
  justify-content: flex-end;
  margin-bottom: 0;
  width: 100%;
`));

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  padding: 0 !important;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(VoterPhotoUpload);
