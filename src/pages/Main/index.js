import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator,Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';


import {
  Container,
  Form,
  SubmitButton,
  List,
  ProfileButton,
  ProfileButtonText,
} from './styles';

export default class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
    cars: []
  };

  async componentDidMount() { 
    const cars = await AsyncStorage.getItem('cars');
    if (cars) {
      this.setState({ cars: JSON.parse(cars) });
    }
  }

  async componentDidUpdate(_, prevState) {
    const cars = await AsyncStorage.getItem('cars');
    if (cars) {
      this.setState({ cars: JSON.parse(cars) });
    }
  }


  handleNavigate = (action, data = null) => {
    const { navigation } = this.props;
    navigation.navigate('Car', { action, data });
  };

  deleteCar  = async (index) => { 
    let { cars } = this.state;
  
    cars.splice(index)
    AsyncStorage.setItem('cars', JSON.stringify(cars));

    

  }


  static navigationOptions = {
    title: 'Veículos',
  };

  render() {
    const { cars, loading } = this.state;
    
    return (
      <Container>
       
        
        <ProfileButton onPress={() => this.handleNavigate('CREATE')}>
                <ProfileButtonText>Adicionar Veículo</ProfileButtonText>
              </ProfileButton>
        <List
          data={cars}
          keyExtractor={item => item.car.id}
          renderItem={({ item, index }) => (
            <Form>
            <Text>{item.car.name}</Text>
            <SubmitButton loading={loading}  onPress={() => this.handleNavigate('UPDATE', {item, index})}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Icon name="edit" size={10} color="#fff" />
              )}
            </SubmitButton>
            <SubmitButton loading={loading}  onPress={() => this.deleteCar( index )}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Icon name="delete" size={10} color="#fff" />
              )}
            </SubmitButton>
          </Form>
           
          )}
        />
      </Container>
    );
  }
}
