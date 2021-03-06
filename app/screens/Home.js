import React, { Component } from 'react';
import { StatusBar, KeyboardAvoidingView, NetInfo } from 'react-native';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { InputWithButton } from '../components/TextInput';
import { ClearButton } from '../components/Button';
import { LastConverted } from '../components/Text';
import { Header } from '../components/Header';
import { AlertConsumer } from '../components/Alert';
import { AnimateIn } from '../components/Animations';

import {
  changeCurrencyAmount,
  swapCurrency,
  getInitialConversion,
  getCoinList,
} from '../actions/currencies';
import { changeNetworkStatus } from '../actions/network';

class Home extends Component {
  constructor(props) {
    super(props);

    this.props.dispatch(getInitialConversion());
    this.props.dispatch(getCoinList());
  }

  componentDidMount() {
    NetInfo.addEventListener('connectionChange', this.handleNetworkChange);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currencyError && !prevProps.currencyError) {
      this.props.alertWithType('error', 'Error', this.props.currencyError);
    }
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('change', this.handleNetworkChange);
  }

  handleNetworkChange = (info) => {
    this.props.dispatch(changeNetworkStatus(info.type));
  };

  handleChangeText = (text) => {
    this.props.dispatch(changeCurrencyAmount(text));
  };

  handlePressBaseCurrency = () => {
    this.props.navigation.navigate('CurrencyList', {
      title: 'Base Currency',
      type: 'base',
    });
  };

  handlePressQuoteCurrency = () => {
    this.props.navigation.navigate('CurrencyList', {
      title: 'Quote Currency',
      type: 'quote',
    });
  };

  handleSwapCurrency = () => {
    this.props.dispatch(swapCurrency());
  };

  handleOptionsPress = () => {
    this.props.navigation.navigate('Options');
  };

  handleDisconnectedPress = () => {
    this.props.alertWithType(
      'error',
      'Not connected to the internet!',
      "Just a heads up that you're not connected to the internet - some features may not work.",
    );
  };

  render() {
    let quotePrice = '...';
    if (!this.props.isFetching) {
      quotePrice = (this.props.amount * this.props.conversionRate).toFixed(2);
    }

    return (
      <Container backgroundColor={this.props.primaryColor}>
        <StatusBar barStyle="light-content" />
        <Header
          onPress={this.handleOptionsPress}
          isConnected={this.props.isConnected}
          onWarningPress={this.handleDisconnectedPress}
        />
        <KeyboardAvoidingView behavior="padding">
          <AnimateIn type="fromTop">
            <Logo tintColor={this.props.primaryColor} />
          </AnimateIn>
          <AnimateIn type="fadeIn" delay={500}>
            <InputWithButton
              buttonText={this.props.baseCurrency}
              onPress={this.handlePressBaseCurrency}
              defaultValue={this.props.amount.toString()}
              keyboardType="numeric"
              onChangeText={this.handleChangeText}
              keyboardAppearance="dark"
              textColor={this.props.primaryColor}
            />
            <InputWithButton
              editable={false}
              buttonText={this.props.quoteCurrency}
              onPress={this.handlePressQuoteCurrency}
              value={quotePrice}
              textColor={this.props.primaryColor}
            />
          </AnimateIn>
          <AnimateIn type="fromBottom" delay={500} duration={750}>
            <LastConverted
              date={this.props.lastConvertedDate}
              base={this.props.baseCurrency}
              quote={this.props.quoteCurrency}
              conversionRate={this.props.conversionRate}
            />
            <ClearButton onPress={this.handleSwapCurrency} text="Reverse Currencies" />
          </AnimateIn>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { baseCurrency, quoteCurrency } = state.currencies;
  const conversionSelector = state.currencies.conversions[baseCurrency] || {};
  const rates = conversionSelector.rates || {};

  return {
    baseCurrency,
    quoteCurrency,
    amount: state.currencies.amount,
    conversionRate: rates[quoteCurrency] || 0,
    lastConvertedDate: conversionSelector.date ? new Date(conversionSelector.date) : new Date(),
    isFetching: conversionSelector.isFetching,
    primaryColor: state.theme.primaryColor,
    currencyError: state.currencies.error,
    isConnected: state.network.connected,
  };
};

const ConnectedHome = connect(mapStateToProps)(Home);

export default props => (
  <AlertConsumer>
    {context => <ConnectedHome alertWithType={context.alertWithType} {...props} />}
  </AlertConsumer>
);
