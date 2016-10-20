import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
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
              ref = {(ms) => {this._ms = ms }}
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
        <TouchableOpacity onPress = {() => this.onPress(true)}>
          <View style = {styles.button}>
            <Text>Click to disable</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => this.onPress(false)}>
          <View style = {styles.button}>
            <Text>Click to able</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  onPress(flag) {
    this._ms.setDisable(flag)
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },

  button: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 5,
  }
});

AppRegistry.registerComponent('MultiSlider', () => MultiSlider);
