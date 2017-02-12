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
      s1leftValue: 2000,
      s1rightValue: 2017,
      s2leftValue: 2000,
      s2rightValue: 2017,
    };
  }

  render() {
    return (
      <View style = {{flex: 1, backgroundColor: 'white', flexDirection: 'column'}}>
          <Text style={{ padding: 10, marginTop: 40, fontWeight: 'bold'}}>Same thumb values not allowed</Text>
          <View style = {styles.container}>
            <MultiSliders
              ref = {(ms) => {this._ms = ms }}
              trackWidth = {300}
              defaultTrackColor = {'#e3e3e3'}
              leftThumbColor = {'red'}
              rightThumbColor = {'blue'}
              rangeColor = {'pink'}
              minValue = {2000}
              maxValue = {2017}
              step = {1}
              min
              leftValue = {this.state.s1leftValue}
              rightValue = {this.state.s1rightValue}
              onLeftValueChange = {(s1leftValue) => this.setState({s1leftValue})}
              onRightValueChange = {(s1rightValue) => this.setState({s1rightValue})}
            />
          </View>
          <View style = {{flex: 1, backgroundColor: 'white', flexDirection: 'row', margin: 20}}>
            <Text style={{ flex: 1, textAlign: 'left'}}>Left: {this.state.s1leftValue}</Text>
            <Text style={{ flex: 1, textAlign: 'right'}}>Right: {this.state.s1rightValue}</Text>
          </View>

        <Text style={{ padding: 10, marginTop: 40, fontWeight: 'bold'}}>Same thumb values allowed</Text>
        <View style = {styles.container}>
          <MultiSliders
              ref = {(ms) => {this._ms2 = ms }}
              trackWidth = {300}
              defaultTrackColor = {'#e3e3e3'}
              leftThumbColor = {'red'}
              rightThumbColor = {'blue'}
              rangeColor = {'pink'}
              minValue = {2000}
              maxValue = {2017}
              step = {1}
              allowSameValues = {true}
              leftValue = {this.state.s2leftValue}
              rightValue = {this.state.s2rightValue}
              onLeftValueChange = {(s2leftValue) => this.setState({s2leftValue})}
              onRightValueChange = {(s2rightValue) => this.setState({s2rightValue})}
          />
        </View>
        <View style = {{flex: 1, backgroundColor: 'white', flexDirection: 'row', margin: 20}}>
          <Text style={{ flex: 1, textAlign: 'left'}}>Left: {this.state.s2leftValue}</Text>
          <Text style={{ flex: 1, textAlign: 'right'}}>Right: {this.state.s2rightValue}</Text>
        </View>

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
