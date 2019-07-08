/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

/**
 * 1) rodei yarn add react-navigation e yarn add react-native-gesture-handler
 * 2) rodei react-native link react-native-gesture-handler
 * 3) rodei yarn add jetifier (?)
 * 4) rodei npx jetify (?)
 */
