import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { standardBoxShadow } from '../../../components/Style/pageLayoutStyles';
import { isAndroidSizeFold } from '../../utils/cordovaUtils';
import { isWebApp } from '../../utils/isCordovaOrWebApp';

class ErrorBoundary extends Component {
  constructor (props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch (error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
    // logErrorToMyService(error, errorInfo);
  }

  render () {
    if (this.state.hasError) {
      // You could render any custom fallback UI here
      return (
        <div style={{
          margin: isAndroidSizeFold() ? '50px' : '10px',
          padding: '10px',
          top: '60px',
          position: 'fixed',
          backgroundColor: 'white',
          boxShadow: standardBoxShadow(),
        }}
        >
          <h1 style={{ margin: '20px', color: 'black', fontSize: '20px' }}>Whoops! Something went wrong.</h1>
          {isWebApp() ? (
            <h1 style={{ margin: '20px', color: 'black' }}>
              Try&nbsp;
              <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => document.location.reload()}>refreshing</span>
              &nbsp;your browser.
            </h1>
          ) : (
            <h1 style={{ margin: '20px', color: 'black' }}>
              Try&nbsp;
              <a style={{ color: 'blue' }} href="/ready">restarting</a>
              &nbsp;the app.
            </h1>
          )}
          <h1 style={{ margin: '20px', color: 'black' }}>
            Please send us an email at &nbsp;
            <a
              href="mailto:info@WeVote.US"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'blue',
                textDecoration: 'underline',
                hover: {
                  textDecoration: 'none !important',
                  color: 'black !important',
                  transform: 'scale(1.05)',
                  transitionDuration: '.25s',
                },
              }}
            >
              info@WeVote.US
            </a>
            &nbsp;describing the problem.
          </h1>
        </div>
      );
    }

    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.array,
};

export default ErrorBoundary;
