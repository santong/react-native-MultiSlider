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

import MultiSliders from './MultiSlider'

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
      <View style = {{flex: 1, backgroundColor: 'white'}}>
          <View style = {styles.container}>
            <MultiSliders
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
});

AppRegistry.registerComponent('MultiSlider', () => MultiSlider);
