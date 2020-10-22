import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput,KeyboardAvoidingView,TouchableWithoutFeedback, Keyboard } from 'react-native';
import SVG,{Image,Circle,ClipPath} from 'react-native-svg'
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler'
const { width, height } = Dimensions.get('window');

console.disableYellowBox = true;
const { Value, event, block, eq, cond, set, Clock, stopClock, startClock, debug, clockRunning, timing, interpolate, Extrapolate, concat } = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}


export default class Registration extends React.Component  {
  constructor() {
    super()
    this.buttonOpacity = new Value(1)
    this.onStateChange = event([
      {
        nativeEvent: ({ state }) => block([
          cond(
            eq(state, State.END), 
            set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))
        ])
      }
    ]);

    this.onCloseState = event([
      {
        nativeEvent: ({ state }) => block([
          cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock, 0, 1)))
        ])
      }
    ])

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3 - 50, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.textinputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1,-1],
      extrapolate: Extrapolate.CLAMP
    })

    this.textinputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0,100],
      extrapolate: Extrapolate.CLAMP
    })

    this.textinputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1,0],
      extrapolate: Extrapolate.CLAMP
    })

    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180,360],
      extrapolate: Extrapolate.CLAMP
    })
  }

  render() {

    return (
      <View style={styles.indexView}>
   
        <Animated.View style={{  position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0, transform: [{ translateY: this.bgY }] }}>
          <SVG 
          height={height}
          width={width}
          >
            <ClipPath id="clip"> 
            <Circle r={height} cx={width} />
            </ClipPath>    
          <Image
            href={require('../assets/tree-bg.jpg')}
            height={height}
            width={width}
            
            preserveAspectRatio="xMinYMin slice"
            clipPath="url(#clip)"
          />
          </SVG>
        </Animated.View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ height: height / 3, justifyContent: 'center' }}>
           
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>

            <Animated.View style={{  backgroundColor: 'white',
    height: 55,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset:{width:2,height:2},
    shadowColor:'white',
    shadowOpacity:0.2,
      transform: [{ translateY: this.buttonY }] }}>
              <Text style={{ fontSize: 18, fontWeight:'bold'}}> Sign in</Text>
            </Animated.View>

          </TapGestureHandler>

          <Animated.View style={{  backgroundColor: 'white',
    height: 55,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset:{width:2,height:2},
    shadowColor:'white',
    shadowOpacity:0.2,
     backgroundColor: '#2e71dc', opacity: this.buttonOpacity, transform: [{ translateY: this.buttonY }] }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}> Sign in with Facebook</Text>
          </Animated.View>

          <Animated.View style={{ height: height / 3,  position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0, top: null, justifyContent: 'center',
          zIndex:this.textinputZindex, opacity:this.textinputOpacity, transform:[{translateY:this.textinputY}]
        }}>

          <TapGestureHandler onHandlerStateChange={this.onCloseState}>
         
            <Animated.View style={styles.closeButton}>
              <Animated.Text style={{fontSize:15, transform:[{rotate:concat(this.rotateCross,('deg')) }]}}> X </Animated.Text>
            </Animated.View>
          </TapGestureHandler>

            <TextInput
              placeholder='Email'
              style={styles.textinput}
              placeholderTextColor='#616161'
            />

            <TextInput
              placeholder='Password'
              style={styles.textinput}
              placeholderTextColor='#616161'
            />
           

            <Animated.View style={styles.buttons}>
          <Text style={{fontSize:18, fontWeight:'bold'}}>Sign in</Text>
            </Animated.View>
          </Animated.View>
          

        </View>
        </TouchableWithoutFeedback>
       
      </View>
    );
  }
}
// export default Registration;
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexView: {
    // position: 'absolute',
    // top: 0,
    // right: 0,
    // bottom: 0,
    // left: 0,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-end'
  },
  buttons: {
    backgroundColor: 'white',
    height: 55,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset:{width:2,height:2},
    shadowColor:'white',
    shadowOpacity:0.2,
    
  },

  textinput: {
    height: 50,
    marginVertical: 5,
    paddingLeft: 10,
    borderBottomColor: '#616161',
    borderBottomWidth:0.5,
    marginHorizontal: 20,
    width:"80%",
    alignSelf:'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius:8
  },

  closeButton:{
    height:40,
    width:40,
    backgroundColor:'white',
    borderRadius:20,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    left:width/2 -20,
    top:-10,
    shadowOffset:{width:2,height:2},
    shadowColor:'black',
    shadowOpacity:0.2
  }
});