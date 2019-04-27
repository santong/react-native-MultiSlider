'use strict';

import React, {
  Component
} from "react";
import PropTypes from 'prop-types';

import {
  Animated,
  StyleSheet,
  PanResponder,
  View,
  Easing
} from "react-native";

import _ from 'underscore';

// default constant
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
    leftValue: PropTypes.number,            // left thumb's value
    rightValue: PropTypes.number,           // right thumb's value

    maxValue: PropTypes.number,             // max value of track
    minValue: PropTypes.number,             // min value of track

    step: PropTypes.number,                 // value of each step
    minSpace: PropTypes.number,             // min space of thumbs

    trackWidth: PropTypes.number,           // track width

    rangeColor: PropTypes.string,           // color in range
    defaultTrackColor: PropTypes.string,    // defalut track color

    leftThumbColor: PropTypes.string,       // color of left thumb
    rightThumbColor: PropTypes.string,      // color of right thumb

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
    disabled: PropTypes.bool,                     // component state

    allowSameValues: PropTypes.bool               // allow the sliders to select the same values
  }

  static defaultProps = {
    leftValue: 0,
    rightValue: 1,
    step: 0,
    maxValue: 1,
    minValue: 0,
    minSpace: 0.1,
    trackWidth: 300,
    allowSameValues: false
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
      ...other
    } = this.props;

    let {
      leftValue,
      rightValue,
      containerSize,
      trackSize,
      thumbSize,
    } = this.state;

    let thumbSizes = thumbSize.width * (this.props.allowSameValues ? 2 : 1)

    let leftThumbLeft = leftValue.interpolate({
        inputRange: [minValue, maxValue],
        outputRange: [0, containerSize.width - thumbSizes],
      });

    let rightThumbLeft = rightValue.interpolate({
        inputRange: [minValue, maxValue],
        outputRange: [containerSize.width - thumbSizes, 0],
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
      return;
    }

    let nextX = this._getValue(gestureState.dx);

    let compareFunc = (lhs,rhs,isGE) => { return isGE ? (lhs >= rhs) : (lhs > rhs)}
    let compareTo = this.props.allowSameValues ? 0 : this.props.minSpace;
    let changeEvent = null;

    if (currentThumb === 'left') {
      if(compareFunc((rightValue._value - nextX),compareTo,this.props.allowSameValues)) {
        leftValue.setValue(nextX);
        changeEvent = 'onLeftValueChange';
      } else if(this.props.allowSameValues) {
        leftValue.setValue(rightValue._value);
        changeEvent = 'onLeftValueChange';
      }
    } else if (currentThumb === 'right') {
      if(compareFunc((nextX - leftValue._value),compareTo,this.props.allowSameValues)) {
        rightValue.setValue(nextX);
        changeEvent = 'onRightValueChange';
      } else if (this.props.allowSameValues) {
        rightValue.setValue(leftValue._value);
        changeEvent = 'onRightValueChange';
      }
    }

    if(changeEvent != null) {
      this._fireChangeEvent(changeEvent);
    }

  }

  _handlePanResponderEnd(evt, gestureState) {
    if (_.isEmpty(currentThumb)) {
      return;
    }

    if (this.state.disabled) {
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
    return ratio * (this.state.containerSize.width - (this.state.thumbSize.width * (this.props.allowSameValues ? 2 : 1)));
  }

  _getValue(value) {
    let length = this.state.containerSize.width - (this.state.thumbSize.width * (this.props.allowSameValues ? 2 : 1));
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
