import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  AsyncStorage
} from 'react-native';

import {Icon, Button} from 'native-base'
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import firebase from 'react-native-firebase'

export default class AudioExample extends Component {

    static navigationOptions = {
        title: "Registro de Áudio"
    }

    state = {
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: AudioUtils.DocumentDirectoryPath + '/audio_coruja.mp3',
      hasPermission: undefined,
    };

    prepareRecordingPath(audioPath){
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000
      });
    }

    componentDidMount() {
      AudioRecorder.requestAuthorization().then((isAuthorised) => {
        this.setState({ hasPermission: isAuthorised });

        if (!isAuthorised) return;

        this.prepareRecordingPath(this.state.audioPath);

        AudioRecorder.onProgress = (data) => {
          this.setState({currentTime: Math.floor(data.currentTime)});
        };

        AudioRecorder.onFinished = (data) => {
          // Android callback comes in the form of a promise instead.
          if (Platform.OS === 'ios') {
            this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
          }
        };
      });
    }

    _renderButton(title, onPress, active) {
      var style = (active) ? styles.activeButtonText : styles.buttonText;

      return (
        <Button info bordered style={styles.RecordButton} onPress={onPress} >
             {title}
        </Button>
      );
    }

    _renderPauseButton(onPress, active) {
      var style = (active) ? styles.activeButtonText : styles.buttonText;
      var title = this.state.paused ? "RESUME" : "PAUSE";
      return (
        <TouchableHighlight style={styles.button} onPress={onPress}>
          <Text style={style}>
            {title}
          </Text>
        </TouchableHighlight>
      );
    }

    async _pause() {
      if (!this.state.recording) {
        console.warn('Não é possível Pausar!');
        return;
      }

      try {
        const filePath = await AudioRecorder.pauseRecording();
        this.setState({paused: true});
      } catch (error) {
        console.error(error);
      }
    }

    async _resume() {
      if (!this.state.paused) {
        console.warn('Não é possível Reproduzir, por favor Finalize!');
        return;
      }

      try {
        await AudioRecorder.resumeRecording();
        this.setState({paused: false});
      } catch (error) {
        console.error(error);
      }
    }

    async _stop() {
      if (!this.state.recording) {
        console.warn('Não é possível Finalizar, reproduza primeiro!');
        return;
      }

      this.setState({stoppedRecording: true, recording: false, paused: false});

      try {
        const filePath = await AudioRecorder.stopRecording();

        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }

        return filePath;
      } catch (error) {
        console.error(error);
      }
    }

    async _play() {
      if (this.state.recording) {
        await this._stop();
      }

      setTimeout(() => {
        var sound = new Sound(this.state.audioPath, '', (error) => {
          if (error) {
            console.log('failed to load the sound', error);
          }
        });

        setTimeout(() => {
          sound.play((success) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }, 100);
      }, 100);
    }

    async _record() {
      if (this.state.recording) {
        console.warn('Reprodução está em andamento...');
        return;
      }

      if (!this.state.hasPermission) {
        console.warn('Não é possível Gravar, sem permissão autorizada!');
        return;
      }

      if(this.state.stoppedRecording){
        this.prepareRecordingPath(this.state.audioPath);
      }

      this.setState({recording: true, paused: false});

      try {
        const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        console.error(error);
      }
    }

    async _upload() {
      const storageRef = firebase.storage().ref('projetos/' + (new Date().toString()))
      const callback = await storageRef.put(this.state.audioPath);

      await firebase.database().ref('projetos/ourcontrol/audios').push({
        url: callback.downloadURL,
        date: new Date().toString(),
        status: true,
      });

      callback.state == "success" ? ToastAndroid.show('Áudio sincronizado com sucesso!', 5000) : ToastAndroid.show('Opa! Erro ao sincronizar!', 5000);
    }

    localStorage = async (file) => {

      var array = [];
      const audio = {
        name: "teste",
        description: "teste",
        file: file
      }
  
      try {
        const existingRecords = await AsyncStorage.getItem('@Coruja:records');
        console.log("existingRecords:", JSON.parse(existingRecords));
  
        if (existingRecords !== null) {
          for (var prop in JSON.parse(existingRecords)) {
            array.push(existingRecords[prop]);
          }
        }

        await AsyncStorage.setItem('@Coruja:records', JSON.stringify(array.push(audio)));
      } catch (error) {
        console.error(error)
      }
    }

    _finishRecording(didSucceed, filePath, fileSize) {
      this.setState({ finished: didSucceed });
      this.localStorage(filePath);
      console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    render() {

      return (
     
        <View style={styles.container}>
          <View style={styles.controls}>
            {this._renderButton(  <Icon name="ios-microphone"> Gravar </Icon>, () => {this._record()}, this.state.recording )}
            {this._renderButton(  <Icon name="ios-play"> Reproduzir </Icon>, () => {this._play()} )}
            {this._renderButton(  <Icon name="ios-square"> Finalizar </Icon>, () => {this._stop()} )}
            {this._renderButton(  <Icon name="ios-cloud-upload"> Enviar </Icon>, () => {this._upload()} )}
            <Text style={styles.progressText}>{this.state.currentTime} seg.</Text>
          </View>
        </View>
      );
    }
  }

  var styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white"
    },
    controls: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    progressText: {
      paddingTop: 50,
      fontSize: 50,
      color: "steelblue"
    },
    button: {
      padding: 0,
    },
    disabledButtonText: {
      color: '#eee'
    },
    buttonText: {
      fontSize: 20,
      color: "#fff"
    },
    activeButtonText: {
      fontSize: 20,
      color: "#B81F00"
    },
    RecordButton: {
        height: 42,
        borderRadius: 5,
        borderWidth: 2,
        color: "steelblue",
        borderColor: "#94e8dd",
        backgroundColor: "transparent",
        marginTop: 10,
        marginRight: 10,
        fontSize: 12,
        width: 200,
        alignItems: 'center'
    },

  });
