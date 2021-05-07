import React from 'react';
import { render } from 'react-dom';
import { Router /* , applyRouterMiddleware */ } from 'react-router-dom';
// import { useScroll } from 'react-router-scroll';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import muiTheme from './mui-theme';
import routes from './RootForReady';
import styledTheme from './styled-theme';
import { polyfillFixes } from './utils/cordovaUtils';
import { renderLog } from './utils/logging';
import { numberOfNeedlesFoundInString } from './utils/searchFunctions';

polyfillFixes('startReactReadyApp');

// Adding functions to the String prototype will make stuff like `for (char in str)` break, because it will loop over the substringOccurrences property.
// As long as we use `forEach()` or `for (char of str)` then that side effect will be mitigated.
String.prototype.numberOfNeedlesFoundInString = numberOfNeedlesFoundInString; // eslint-disable-line

function startReactReadyApp () {
  renderLog('startReactReadyApp');  // Set LOG_RENDER_EVENTS to log all renders
  console.log('startReactReadyApp first line in startReactReadyApp');
  // TODO: This should not be necessary with V5 react-router <Router history={history} >
  const element = (
    // eslint-disable-next-line react/jsx-filename-extension
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider theme={styledTheme}>
        <Router>
          {routes()}
        </Router>
      </ThemeProvider>
    </MuiThemeProvider>
  );

  // console.log('startReactReadyApp before render');
  render(element, document.getElementById('app'));
}

// Browser only -- this file not used for Cordova
console.log('startReactReadyApp for the WebApp (not for Cordova)');
startReactReadyApp();
