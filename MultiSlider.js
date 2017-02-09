'use strict';

import React, {
  Component,
  PropTypes
} from "react";

import {
  Animated,
  StyleSheet,
  PanResponder,
  View,
  Easing
} from "react-native";

import _ from 'underscore';

// defalut constant
const THUMB_SIZE = 30;
const TRACK_SIZE = 30;

var currentThumb;


class MultiSlider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      containerSize: {
        width: 0,
        height: 0,
      },

      thumbSize: {
        width: 0,
        height: 0
      },

      trackSize: {
        width: 0,
        height: 0
      },

      disabled: this.props.disabled,
      leftValue: new Animated.Value(this.props.leftValue),
      rightValue: new Animated.Value(this.props.rightValue),
    };
  }

  static propTypes = {
    leftValue: React.PropTypes.number,            // left thumb's value
    rightValue: React.PropTypes.number,           // right thumb's value

    maxValue: React.PropTypes.number,             // max value of track
    minValue: React.PropTypes.number,             // min value of track

    step: React.PropTypes.number,                 // value of each step
    minSpace: React.PropTypes.number,             // min space of thumbs

    trackWidth: React.PropTypes.number,           // track width

    rangeColor: React.PropTypes.string,           // color in range
    defaultTrackColor: React.PropTypes.string,    // defalut track color

    leftThumbColor: React.PropTypes.string,       // color of left thumb
    rightThumbColor: React.PropTypes.string,      // color of right thumb

    style: View.propTypes.style,                  // container style
    trackStyle: View.propTypes.style,             // track style
    rangeStyle: View.propTypes.style,             // style of range between thumbs on track
    thumbStyle: View.propTypes.style,             // thumb style

    onLeftValueChange: PropTypes.func,            // callback when value changed
    onLeftSlidingStart: PropTypes.func,           // callback when start slide
    onLeftSlidingComplete: PropTypes.func,        // callback when slide completed

    onRightValueChange: PropTypes.func,           // callback when value changed
    onRightSlidingStart: PropTypes.func,          // callback when start slide
    onRightSlidingComplete: PropTypes.func,       // callback when slide completed
    disabled: PropTypes.bool
  }

  static defaultProps = {
    leftValue: 0,
    rightValue: 1,
    step: 0,
    maxValue: 1,
    minValue: 0,
    minSpace: 0.1,
    trackWidth: 300,
  }

  componentWillMount() {
    // gesture func of left thumb
    this._leftPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => this._handleStartShouldSetPanResponder (evt, gestureState),
      onMoveShouldSetPanResponder: (evt, gestureState) => this._handleMoveShouldSetPanResponder (evt, gestureState),
      onPanResponderGrant: (evt, gestureState) => this._onTouchLeftThumb(evt, gestureState),
      onPanResponderMove: (evt, gestureState) => this._handlePanResponderMove (evt, gestureState),
      onPanResponderRelease: (evt, gestureState) => this._handlePanResponderEnd (evt, gestureState),
      onPanResponderTerminationRequest: (evt, gestureState) => this._handlePanResponderRequestEnd (evt, gestureState),
      onPanResponderTerminate: (evt, gestureState) => this._handlePanResponderEnd (evt, gestureState),
    });

    // gesture func of right thumb
    this._rightPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => this._handleStartShouldSetPanResponder (evt, gestureState),
      onMoveShouldSetPanResponder: (evt, gestureState) => this._handleMoveShouldSetPanResponder (evt, gestureState),
      onPanResponderGrant: (evt, gestureState) => this._onTouchRightThumb(evt, gestureState),
      onPanResponderMove: (evt, gestureState) => this._handlePanResponderMove (evt, gestureState),
      onPanResponderRelease: (evt, gestureState) => this._handlePanResponderEnd (evt, gestureState),
      onPanResponderTerminationRequest: (evt, gestureState) => this._handlePanResponderRequestEnd (evt, gestureState),
      onPanResponderTerminate: (evt, gestureState) => this._handlePanResponderEnd (evt, gestureState),
    });
  }

  // Updates the left and right value on prop change
  componentWillReceiveProps(nextProps)
  {
    if(nextProps != this.props) {
      this.setState({
          leftValue: new Animated.Value(nextProps.leftValue),
          rightValue: new Animated.Value(nextProps.rightValue),
          disabled: nextProps.disabled
      })
    }
  }

  // Sets whether the slider can slide, and true is disabled
  setDisable(flag) {
    this.setState({
      disabled: flag,
    });
  }

  render() {
    console.log('=========================');
    console.log(this.state.disabled);
    const {
      minValue,
      maxValue,
      style,
      trackStyle,
      thumbStyle,
      defaultTrackColor,
      leftThumbColor,
      rightThumbColor,
      trackWidth,
      rangeColor,
      ...other,
    } = this.props;

    let {
      leftValue,
      rightValue,
      containerSize,
      trackSize,
      thumbSize,
    } = this.state;

    let leftThumbLeft = leftValue.interpolate({
        inputRange: [minValue, maxValue],
        outputRange: [0, containerSize.width - thumbSize.width],
      });

    let rightThumbLeft = rightValue.interpolate({
        inputRange: [minValue, maxValue],
        outputRange: [containerSize.width - thumbSize.width, 0],
    });

    let minTrackStyle = {
      position: 'absolute',
      width: Animated.add(THUMB_SIZE, leftThumbLeft),
      left: 0,
      backgroundColor: 'white',
    };

    let maxTrackStyle = {
      position: 'absolute',
      width: Animated.add(THUMB_SIZE, rightThumbLeft),
      right: 0,
      backgroundColor: 'white',
    };

    return (
      <View style = {[styles.container, this.props.style]}
        onLayout = {(x) => this._measureContainer(x)} >

        <View style = {[styles.track, this.props.trackStyle, {backgroundColor: rangeColor, width: trackWidth}]}
              onLayout = {(x) => this._measureTrack(x)} />

        <Animated.View style = {[styles.range, this.props.rangeStyle, minTrackStyle, {backgroundColor: defaultTrackColor}]}/>
        <Animated.View style = {[styles.range, this.props.rangeStyle, maxTrackStyle, {backgroundColor: defaultTrackColor}]}/>

        <Animated.View style = {[styles.thumb,
          {right: rightThumbLeft, backgroundColor: rightThumbColor}, this.props.thumbStyle]}
              onLayout = {(x) => this._measureThumb(x)}
              {...this._rightPanResponder.panHandlers} />

        <Animated.View style = {[styles.thumb,
          {left: leftThumbLeft, backgroundColor: leftThumbColor}, this.props.thumbStyle]}
              onLayout = {(x) => this._measureThumb(x)}
              {...this._leftPanResponder.panHandlers} />

      </View>
    );
  }

  /*----------gesture funcs start------------*/
  _handleStartShouldSetPanResponder(evt, gestureState) {
    return true;
  }

  _handleMoveShouldSetPanResponder(evt, gestureState) {
    return true;
  }

  _onTouchLeftThumb(evt, gestureState) {
    currentThumb = 'left';
    this._previousLeft = this._getThumbLeft(this.state.leftValue.__getValue());
    this._fireChangeEvent('onLeftSlidingStart');
  }

  _onTouchRightThumb(evt, gestureState) {
    currentThumb = 'right';
    this._previousLeft = this._getThumbLeft(this.state.rightValue.__getValue());
    this._fireChangeEvent('onRightSlidingStart');
  }

  _handlePanResponderMove(evt, gestureState) {
    if (_.isEmpty(currentThumb)) {
      return;
    }

    let {
      leftValue,
      rightValue,
    } = this.state;

    if (this.state.disabled) {
      console.log('------------------00001');
      return;
    }
    console.log('------------------111111111');


    let nextX = this._getValue(gestureState.dx);

    if (currentThumb === 'left' && (rightValue._value - nextX) > this.props.minSpace) {
      leftValue.setValue(nextX);
      this._fireChangeEvent('onLeftValueChange');
    } else if (currentThumb === 'right' && (nextX - leftValue._value) > this.props.minSpace) {
      rightValue.setValue(nextX);
      this._fireChangeEvent('onRightValueChange');
    }

  }

  _handlePanResponderEnd(evt, gestureState) {
    if (_.isEmpty(currentThumb)) {
      return;
    }

    if (currentThumb === 'left') {
      this._fireChangeEvent('onLeftSlidingComplete');
    } else if (currentThumb === 'right') {
      this._fireChangeEvent('onRightSlidingComplete');
    }
  }

  _handlePanResponderRequestEnd(evt, gestureState) {

  }

  _handlePanResponderEnd(evt, gestureState) {

  }
  /*----------gesture funcs end------------*/


  /*--------Measure funcs start-----------*/
  _measureContainer(x) {
    this._handleMeasure('containerSize', x);
  }

  _measureTrack(x) {
    this._handleMeasure('trackSize', x);
  }

  _measureThumb(x) {
    this._handleMeasure('thumbSize', x);
  }

  _handleMeasure(name, x) {
    let {width, height} = x.nativeEvent.layout;
    let size = {width: width, height: height};

    let storeName = `_${name}`;
    let currentSize = this[storeName];
    if (currentSize && width === currentSize.width && height === currentSize.height) {
      return;
    }
    this[storeName] = size;

    if (this._containerSize && this._trackSize && this._thumbSize) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
      })
    }
  }
  /*--------Measure funcs end-----------*/

  /*-------Calculate value funcs start-------*/
  _getRatio(value: number) {
    return (value - this.props.minValue) / (this.props.maxValue - this.props.minValue);
  }

  _getThumbLeft(value: number) {
    let ratio = this._getRatio(value);
    return ratio * (this.state.containerSize.width - this.state.thumbSize.width);
  }

  _getValue(value) {
    let length = this.state.containerSize.width - this.state.thumbSize.width;
    let thumbLeft = this._previousLeft + value;

    let ratio = thumbLeft / length;

    if (this.props.step) {
      return Math.max(this.props.minValue,
        Math.min(this.props.maxValue,
          this.props.minValue + Math.round(ratio * (this.props.maxValue - this.props.minValue) / this.props.step) * this.props.step
        )
      );
    } else {
      return Math.max(this.props.minValue,
        Math.min(this.props.maxValue,
          ratio * (this.props.maxValue - this.props.minValue) + this.props.minValue
        )
      );
    }
  }
  /*-------Calculate value funcs end-------*/

  _fireChangeEvent(event) {
    if (_.isEmpty(currentThumb)) {
      return;
    }

    if (!this.props[event]) {
      return;
    }

    let {
      leftValue,
      rightValue,
    } = this.state;

    if (currentThumb === 'left') {
      this.props[event](leftValue._value);
    } else if (currentThumb === 'right') {
      this.props[event](rightValue._value);
    }
  }

}

var styles = StyleSheet.create({
  container: {
    height: THUMB_SIZE,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  track: {
    height: TRACK_SIZE,
    backgroundColor: 'grey',
    borderRadius: TRACK_SIZE / 2,
  },

  range: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },

  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    zIndex: 1,
    borderRadius: THUMB_SIZE / 2,
  },

});

module.exports = MultiSlider;
