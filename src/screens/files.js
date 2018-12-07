import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Footer, FooterTab } from 'native-base';

export default class ListIconExample extends Component {

    static navigationOptions = {
        title: "Arquivos"
    }

  render() {
    return (
      <Container>
        <Content>
            <ListItem itemDivider>
            <Left>
                <Text>Projeto</Text>
            </Left>
            <Right>
                <Button transparent success>
                   <Icon name="sync"></Icon>
                </Button>
            </Right>
            </ListItem>
            <ListItem icon>
                <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                    <Icon active name="ios-play" />
                </Button>
                </Left>
                <Body>
                <Text>Audio-0001</Text>
                </Body>
                <Right>
                    <Button transparent light>
                         <Icon active name="create" />
                    </Button>
                    <Button transparent success>
                         <Icon active name="cloud-circle"/>
                    </Button>
                </Right>
            </ListItem>
            <ListItem icon>
                <Left>
                <Button style={{ backgroundColor: "#FF9501" }}>
                    <Icon active name="ios-image" />
                </Button>
                </Left>
                <Body>
                <Text>Foto-0001</Text>
                </Body>
                <Right>
                    <Button transparent light>
                         <Icon active name="create" />
                    </Button>
                    <Button transparent warning>
                         <Icon active name="cloud-circle" />
                    </Button>
                </Right>
            </ListItem>
            <ListItem icon>
                <Left>
                <Button style={{ backgroundColor: "#03BB85" }}>
                    <Icon active name="ios-text" />
                </Button>
                </Left>
                <Body>
                <Text>Nota-0001</Text>
                </Body>
                <Right>
                    <Button transparent light>
                         <Icon active name="create" />
                    </Button>
                    <Button transparent danger>
                         <Icon active name="cloud-circle" />
                    </Button>
                </Right>
            </ListItem>
        </Content>
        <Footer info>
          <FooterTab info>
            <Button info active vertical onPress={()=>{this.props.navigation.navigate("Audio");}}>
              <Icon name="ios-microphone" active />
              <Text>Áudio</Text>
            </Button>
            <Button info active vertical onPress={()=>{this.props.navigation.navigate("Camera");}}>
              <Icon name="ios-camera" active />
              <Text>Foto</Text>
            </Button>
            <Button info active vertical onPress={()=>{this.props.navigation.navigate("Note");}}>
              <Icon name="ios-text" active />
              <Text>Anotação</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}