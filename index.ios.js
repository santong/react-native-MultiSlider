/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import MultiThumbsSlider from './source/MultiThumbsSlider'

class MultiSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftValue: 0,
      rightValue: 0.5,
    };
  }

  render() {
    return (
      <View style = {styles.container}>
        <MultiThumbsSlider
          trackWidth = {300}
          defaultTrackColor = {'#e3e3e3'}
          leftThumbColor = {'red'}
          rightThumbColor = {'blue'}
          rangeColor = {'pink'}
          leftValue = {this.state.leftValue}
          rightValue = {this.state.rightValue}
          onLeftValueChange = {(leftValue) => this.setState({leftValue})}
          onRightValueChange = {(rightValue) => this.setState({rightValue})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('MultiSlider', () => MultiSlider);
