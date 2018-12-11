
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View, ToastAndroid, AsyncStorage} from 'react-native';
import {Icon} from 'native-base'
import firebase from 'react-native-firebase'
import Camera from 'react-native-camera'

export default class CameraView extends Component {

  static navigationOptions = {
    title: "Câmera"
  }

  state = {
    image: {},
    ready_to_upload: false,
    project: this.props.navigation.getParam('project'),
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {this.camera = cam}}
          style={styles.view}
          aspect={Camera.constants.Aspect.fill}>

          <TouchableOpacity  style={styles.capture} onPress={ this.state.ready_to_upload ? this.uploadPicture : this.takePicture}>
            {this.state.ready_to_upload ? <Icon name="ios-cloud-upload" style={{color: 'white'}} /> : <Icon name="ios-camera" style={{color: 'white'}} /> } 
          </TouchableOpacity>

         </Camera>
      </View>
    );
  }


  takePicture = async () => {

      try {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.capture({metadata: options})
        this.setState({image : data})
        this.setState({ready_to_upload : true})
        this.localStorage();
        ToastAndroid.show('Foto pronta para upload!', 5000)
     
      } catch (error) {
        ToastAndroid.show('Opa! Não foi possível salvar sua foto!', 5000)
      }

  }

  localStorage = async () => {

    try {

      var array = [];
      const picture = {
        name: "teste",
        description: "teste",
        file: this.state.image,
        status: false
      }
  
      const existingPictures = await AsyncStorage.getItem('@Coruja:fotos');
      existingPictures == null ? existingPictures = array : array = [...JSON.parse(existingPictures)];
      array.push(picture);
      await AsyncStorage.setItem('@Coruja:fotos', JSON.stringify(array));
      console.log(array);
  
    } catch (error) {
      console.warn("Não foi possível realizar o armazenamento!");
    }
  
  }


  uploadPicture = async () => {
      const storageRef = firebase.storage().ref('coruja/fotos/' + (new Date().toString()));
      const callback = await storageRef.put(this.state.image.path);

      await firebase.database().ref('projetos/'+ this.state.project.nome +'/fotos').push({
        url: callback.downloadURL,
        date: new Date().toString(),
        status: true,
      });
      
      this.props.navigation.navigate('Projects');

      callback.state == "success" ?  ToastAndroid.show('Foto sincronizada com sucesso!', 5000) :  ToastAndroid.show('Opa! Erro ao sincronizar!', 5000);

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  view: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: 'steelblue',
    borderRadius: 10,
    color: 'white',
    padding: 15,
    paddingRight: 40,
    paddingLeft: 40,
    margin: 45,
  }
});