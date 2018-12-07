import React, {Component} from 'react';
import {Container, Content, Input, Item, Button, Text, Form} from 'native-base';
import {Alert} from 'react-native';

import {Image, StyleSheet} from 'react-native';
import firebase from 'react-native-firebase';

export default class Login extends Component {

    static navigationOptions = {
        title: "Coruja"
    }

    state = {
        email : "",
        password: "",
        errorMessage: null,
    }

    componentWillMount(){
        firebase.initializeApp({
            apiKey: "AIzaSyCBNXZi5ZrV3qrZr6tFmwW88BpoNSwy7lE",
            authDomain: "coruja-58384.firebaseapp.com",
            databaseURL: "https://coruja-58384.firebaseio.com",
            projectId: "coruja-58384",
            storageBucket: "coruja-58384.appspot.com",
            messagingSenderId: "584088663872"   
          });
    }

    signIn = async () => {

        try {

            const {email, password} = this.state;
            const user = await firebase.auth().signInWithEmailAndPassword(email, password);   
            this.props.navigation.navigate("Projects");

        } catch (error) {
            Alert.alert('Opa! Não foi possível acessar, verifique seu login e senha!');
            this.setState({
                errorMessage: error
            });
        }
        
    }

    state = {
        email : "",
        password: "",
        authenticated: false,
    }

    render() { 

        return (
            <Container style={styles.container}>
                <Content>
                  <Form>
                        <Image source={require('./img/logo.png')} />
                        <Item regular style={{marginTop: 5}}>
                            <Input placeholder={"Email"} name='login' autoCapitalize = 'none' onChangeText={(text)=>{this.setState({email: text})}} />
                        </Item>
                        <Item regular style={{marginTop: 5}} >
                            <Input placeholder={"Senha"} name='password' onChangeText={(text)=>{ this.setState({password: text})}} autoCapitalize = 'none' secureTextEntry/>
                        </Item>
                        <Button block info style={{marginTop: 10}} onPress={this.signIn}>
                          <Text>Entrar</Text>
                        </Button>
                 </Form>
                </Content>
            </Container> );
    }

}

const styles = StyleSheet.create({
   
    container: {
        justifyContent: "center",
        alignItems: "center"
    }

});