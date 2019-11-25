import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ActivityIndicator,
  Picker,
  Text,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import {
  Form,
  SubmitButton,
} from './styles';

export default class Car extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  }; 

  state = {
    loading: false,
    brands: [],
    brandSelected: '',
    cars: [],
    carsList: [],
    carSelected: '',
    savedCars: [],
    action: '',
    indexOfCar: ''
  };

  showAlert = () => {
    Alert.alert('Selecione outro carro');
    this.setState({ loading: false });
  };
  
  async componentDidMount() {
    const { navigation } = this.props;
    
    const action = navigation.getParam('action')
    this.setState({ action });


    const cars = await AsyncStorage.getItem('cars');
 
    if (cars) {
      this.setState({ cars: JSON.parse(cars) });
    }
    await this.getBrands();

    const data = navigation.getParam('data')
    if(data){
      await this.getCars(data.item.brand.id)
      await this.setState({ brandSelected: data.item.brand.id, carSelected: data.item.car.id, indexOfCar: data.index });
    }
  }

  componentDidUpdate(_, prevState) {
    const { cars } = this.state;
    if (prevState.cars !== cars) {
      AsyncStorage.setItem('cars', JSON.stringify(cars));
    }
  }

  deleteCar  = async () => { 
    const { indexOfCar } = this.state;
    const { cars } = this.state;
    cars.splice(indexOfCar)
    this.setState({ cars });
  }

  getBrands = async () => {
    this.setState({ loading: true });
    const response = await api.get(`marcas.json`);
    this.setState({
      brands: response.data,
      loading: false,
    });
  };

  getCars = async idBrand => {
    this.setState({ loading: true });
    const response = await api.get(`veiculos/${idBrand}.json`);
    this.setState({
      carsList: response.data,
      loading: false,
    });
  }
;
  handleAction = async () => {
    const { action } = this.state;
    switch (action) {
      case 'CREATE':
        this.handleCreate();
        break;
      case 'UPDATE':
        this.handleUpdate();
        break;
    }
  }
;

  handleUpdate = async () => {
    this.deleteCar()
    this.handleCreate()
  }

  handleDelete = async () => {
    this.deleteCar()
    const { navigation } = this.props;
    navigation.navigate('Main');
  }

  handleCreate = async () => {
    const { brands, carsList, cars, brandSelected, carSelected } = this.state;

    this.setState({ loading: true });

    // checa se o carro não está na lista de adicionados
    const searchedCar = this.state.cars.find(
      savedCars => savedCars.car.id === carSelected
    );
    if (searchedCar) return this.showAlert();

    const car = await carsList.find(car => car.id === carSelected);
    const brand = await brands.find(brand => brand.id === brandSelected);

    const data = {
      brand,
      car,
    };
    console.log(data)
    this.setState({
      cars: [...cars, data],
      loading: false,
    });

    const { navigation } = this.props;
    navigation.navigate('Main');
  };

  static navigationOptions = {
    title: 'Gerenciar veículo',
  };

   updateBrand =  (idBrand) => {
    
     this.getCars(idBrand);
    this.setState({ brandSelected: idBrand });
  };
  updateCar = car => {
    this.setState({ carSelected: car });
  };
  render() {
    const {
      brands,
      brandSelected,
      carsList,
      carSelected,
      loading,
    } = this.state;

    return (
      <View>
        <Form>
          <View>
            <Text>Marca:</Text>
            <Picker
              selectedValue={brandSelected}
              onValueChange={this.updateBrand}
            >
              {brands.map((v, i) => (
                <Picker.Item key={i} label={v.name} value={v.id} />
              ))}
            </Picker>
          </View>
          <View>
            <Text>Carros:</Text>
            <Picker selectedValue={carSelected} onValueChange={this.updateCar}>
              {carsList.map((v, i) => (
                <Picker.Item key={i} label={v.name} value={v.id} />
              ))}
            </Picker>
          </View>
          <SubmitButton loading={loading} onPress={this.handleAction}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>
      </View>
    );
  }
}
