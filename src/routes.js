import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Car from './pages/Car';

const Routes = createAppContainer(
  createStackNavigator(
    { Main, Car },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: { backgroundColor: '#7159c1' },
        headerTintColor: '#fff',
      },
    }
  )
);

export default Routes;
