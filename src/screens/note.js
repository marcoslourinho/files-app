import React, { Component } from "react";
import { Container, Content, Textarea, Form, Button, Text, DatePicker, Item, Input } from "native-base";
import {AsyncStorage, Alert} from 'react-native'
import firebase from "react-native-firebase";

export default class Note extends Component {

  static navigationOptions = {
    title: "Nova Nota"
  }

  state = {
    note: ""
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Form>
            <Textarea rowSpan={5} name='note' onChangeText={(text)=>{ this.setState({note: text})}}  bordered placeholder="Registre aqui anotações sobre o Projeto..." />
          </Form>
          <Button block info style={{marginTop: 10}} onPress={this.sendNote}>
            <Text>Salvar</Text>
          </Button>
        </Content>
      </Container>
    );
  }

sendNote = async () => {

  try {

    await firebase.database().ref('projetos/ourcontrol/anotacao').push({
      note: this.state.note,
      date: new Date().toString(),
      status: true
    });

  } catch (error) {
    this.localStorage();
    Alert.alert("Não foi possível realizar o upload!");
  }

  this.props.navigation.navigate("Projects");

}

localStorage = async () => {

  try {

    var array = [];
    const nota = {
      note: this.state.note,
      date: new Date().toString(),
      status: false
    }

    const existingNotes = await AsyncStorage.getItem('@Coruja:anotacoes');

    array = [...JSON.parse(existingNotes)];
    array.push(nota);

    await AsyncStorage.setItem('@Coruja:anotacoes', JSON.stringify(array));

    console.log(array);

  } catch (error) {
    console.warn("Não foi possível realizar o armazenamento!");
  }

}

}