import {createStackNavigator, createAppContainer} from 'react-navigation';
import Login from './screens/login';
import Projects from './screens/projects';
import Files from './screens/files';
import Note from './screens/note';
import Camera from './screens/camera';
import Audio from './screens/audio';

const CorujaStack = createStackNavigator(
    {
      Login: {
        screen: Login
      },
      Projects: {
        screen: Projects
      },
      Files: {
        screen: Files
      },
      Note: {
        screen: Note
      },
      Camera: {
        screen: Camera
      },
      Audio: {
        screen: Audio
      }
    },
    {
      initialRouteName: 'Login'
    }
 );

  export default App = createAppContainer(CorujaStack);
    