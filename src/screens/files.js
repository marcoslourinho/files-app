import React, { Component } from 'react';
import {FlatList} from 'react-native';
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Footer, FooterTab } from 'native-base';
import api from '../services/api'

export default class ListIconExample extends Component {

    static navigationOptions = {
        title: "Arquivos"
    }

    state = {
        project: this.props.navigation.getParam('project'),
        files_notes: [],
        files_images: [],
        files_audios: [],
        all_files:[]
    }

    componentDidMount(){
        this.listFiles();
    }

    listFiles = async () => {
        try {
            var files = [];
            var array_notes = [];
            var array_audios = [];
            var array_images = [];

            const response_notes = await api.get('/projetos/'+ this.state.project.nome +'/anotacao.json');
            const response_audios = await api.get('/projetos/'+ this.state.project.nome +'/audios.json');
            const response_images = await api.get('/projetos/'+ this.state.project.nome +'/fotos.json');

            if (response_notes != null){
                for (var prop in response_notes.data) {
                    array_notes.push(response_notes.data[prop]);
                }  
                this.setState({files_notes : array_notes}); 
            }

            if(response_audios != null){
                for (var prop in response_audios.data) {
                    array_audios.push(response_audios.data[prop]);
                }  
                this.setState({files_audios : array_audios});   
            }

            if(response_images != null){
                for (var prop in response_images.data) {
                    array_images.push(response_images.data[prop]);
                }
                this.setState({files_images : array_images}); 
            }
         
            files = array_notes.concat(array_images, array_audios);
            this.setState({all_files: files});

            console.log(this.state.all_files);

        } catch (response) {
            console.log(response.data.error);
        }    
    }

    renderAudio = ({audio}) => (
        <ListItem icon>
        <Left>
        <Button style={{ backgroundColor: "#007AFF" }}>
            <Icon active name="ios-play" />
        </Button>
        </Left>
        <Body>
        <Text>{audio.date}</Text>
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
    )

    renderImage = ({image}) => (
        <ListItem icon>
        <Left>
        <Button style={{ backgroundColor: "#FF9501" }}>
            <Icon active name="ios-image" />
        </Button>
        </Left>
        <Body>
        <Text>{image.date}</Text>
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
    )

    renderList = (audio, image, note) =>{
        this.renderAudio(audio);
        this.renderImage(image);
        this.renderNote(note);
    }

    renderItem = ({item}) => (
        <ListItem icon>
        <Left>
        <Button style={{ backgroundColor: "#03BB85" }}>
            <Icon active name="ios-text" />
        </Button>
        </Left>
        <Body>
        <Text>File - 0000</Text>
        </Body>
        <Right>
            {item.status ? <Button transparent success><Icon active name="cloud-circle" /></Button> : <Button transparent danger><Icon active name="cloud-circle" /></Button> }
        </Right>
      </ListItem>
    )

    render() {
        return (
        <Container>
            <Content>
                <ListItem itemDivider>
                <Left>
                    <Text>{this.state.project.nome}</Text>
                </Left>
                <Right>
                    <Button transparent success>
                    <Icon name="sync"></Icon>
                    </Button>
                </Right>
                </ListItem>
                <FlatList
                    data={this.state.all_files}
                    keyExtractor={ item => item.key }
                    renderItem={this.renderItem}
                 />

            </Content>
            <Footer info>
            <FooterTab info>
                <Button info active vertical onPress={()=>{this.props.navigation.navigate("Audio", {project: this.state.project});}}>
                <Icon name="ios-microphone" active />
                <Text>Áudio</Text>
                </Button>
                <Button info active vertical onPress={()=>{this.props.navigation.navigate("Camera", {project: this.state.project});}}>
                <Icon name="ios-camera" active />
                <Text>Foto</Text>
                </Button>
                <Button info active vertical onPress={()=>{this.props.navigation.navigate("Note", {project:  this.state.project});}}>
                <Icon name="ios-text" active />
                <Text>Anotação</Text>
                </Button>
            </FooterTab>
            </Footer>
        </Container>
        );
    }
}