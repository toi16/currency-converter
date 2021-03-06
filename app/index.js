import React from 'react';
import { Provider } from 'react-redux';
// import SplashScreen from 'react-native-splash-screen';
import { PersistGate } from 'redux-persist/es/integration/react';

import Navigator from './config/routes';
import { AlertProvider } from './components/Alert';
import configureStore from './config/store';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { store, persistor } = configureStore();
    this.state = {
      store,
      persistor,
    };
  }

  componentDidMount() {
    // SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <PersistGate persistor={this.state.persistor}>
          <AlertProvider>
            <Navigator onNavigationStateChange={null} />
          </AlertProvider>
        </PersistGate>
      </Provider>
    );
  }
}
export default App;
