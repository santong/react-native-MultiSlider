# react-native-MultiSlider
A track with multiple thumbs based on react-native. 

## ScreenShot
<img src="https://github.com/santong/react-native-MultiSlider/blob/master/shot_android.gif"  width="320px" />
<img src="https://github.com/santong/react-native-MultiSlider/blob/master/shot_ios.gif"  width="320px" />

## Usage
```Shell
npm install react-native-MultiSlider --save
```
```JavaScript
import MultiSlider from 'react-native-MultiSlider';
...
class test extends Component {
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
            <MultiSlider
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
...
```
## Thanks
[react-native-slider](https://github.com/jeanregisser/react-native-slider) by jeanregisser
##License
[MIT](https://github.com/santong/react-native-MultiSlider/blob/master/LICENSE)
