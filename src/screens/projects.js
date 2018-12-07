import React, {Component} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Button, Icon, Card, CardItem, Left, Right, Body, ListItem, Text} from 'native-base';
import api from '../services/api'

export default class Projects extends Component {

    static navigationOptions = {
        title: "Projetos"
    }

    state = {
        projects: [],
    }

    componentDidMount(){
        this.listProjects();
    }

    listProjects = async () => {

        try {

            var array = [];
            const response = await api.get('/projetos.json');

            for (var prop in response.data) {
               array.push(response.data[prop]);
            }

            this.setState({projects : array});

        } catch (response) {
            this.setState({ errorMessage: response.data.error });
        }
    }
  
    renderItem = ({item}) => (
        <Card style={styles.card}>
        <CardItem header style={styles.container} button >
          <Left>
            <Body>
              <Text style={styles.projectTitle}>
                  {item.nome}
              </Text>
              <Text style={styles.projectDescription}>
                  {item.descricao}
              </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem footer bordered >
        <Left>
            <Button iconLeft transparent small info >
                <Icon name="sync" />
                <Text style={styles.syncText}>1/5</Text>
            </Button>
        </Left>
        <Right>
            <Button info bordered style={styles.projectButton} onPress={()=>{this.props.navigation.navigate("Files");}} >
              <Icon name="ios-folder" /> 
            </Button>
        </Right>
        </CardItem>
      </Card>
    )

    render(){
        return(
            <View style={styles.container}>
                <ListItem itemDivider>
                <Left>
                    <Text>Evidências</Text>
                </Left>
                <Right>
                    <Button iconLeft transparent small success>
                        <Icon name="sync" />
                        <Text style={styles.syncText}>1/10</Text>
                    </Button>
                </Right>
                </ListItem>
                <FlatList
                    contentContainerStyle={styles.list}
                    data={this.state.projects}
                    keyExtractor={ item => item._id }
                    renderItem={this.renderItem}
                        />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    list: {
        padding: 20
    },
    projectContainer: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        marginBottom: 20
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    projectDescription: {
        fontSize: 16,
        color: "#999",
        marginTop: 5,
        lineHeight: 24
    },
    projectButton: {
        height: 42,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#94e8dd",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginRight: 10
    },
    projectButtonText:{
        fontSize: 14,
        color: '#94e8dd',
        fontWeight: "bold",
    },
    syncText:{
        fontSize: 18
    }

});

