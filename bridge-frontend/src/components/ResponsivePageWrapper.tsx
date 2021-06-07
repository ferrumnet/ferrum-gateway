import React from 'react';
 import {
    GeneralPageLayout,Row
    // @ts-ignore
} from 'component-library';

import { Provider as FluentProvider, teamsTheme,mergeThemes } from '@fluentui/react-northstar';
import { ThemeContext } from 'unifyre-react-helper';
import { ConnectBar } from './../connect/ConnectBar';
import { ReponsivePageWrapperDispatch, ReponsivePageWrapperProps } from './PageWrapperTypes';

const customTheme = {
    siteVariables: {
      colorScheme: {
        brand: {
          'background': 'white',
        }
      }
    }
  }
  

