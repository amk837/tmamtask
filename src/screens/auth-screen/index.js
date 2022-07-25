import React, { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  Alert, TouchableOpacity, TextInput, Text, ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import { shape } from 'prop-types';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ALLOW_BIOMETRIC_LOGIN, NAVIGATION_ROUTES } from '../../utils/constants';
import { firebaseAuth } from '../../utils/firebase';
import { loadFromStorage, saveIntoStorage } from '../../utils/storage';

const StyledInput = styled(TextInput)`
  width: 80%;
  height: 50px;
  background-color: rgba(51, 51, 51, 0.06);
  border-radius: 8px;
  padding-horizontal: 8px;
`;

const StyledButton = styled(TouchableOpacity)`
  width: 80%;
  height: 50px;
  background-color: #F4845F;
  border-radius: 8px;
  padding-horizontal: 8px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  color: white;
`;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: space-evenly;
  padding-vertical: 50px;
`;

const LoaderContainer = styled.View`
  padding-bottom: 16px;
  align-self: center;
`;

const MessageContainer = styled.View`
  width: 80%;
  height: 50px;
  background-color: #2ecc71;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const MainContainer = styled.View`
  width: 100%;
  height: 100%;
  background-color: white;
`;

export const AuthScreen = ({ navigation }) => {
  const [hasFingerPrint, setHasFingerPrint] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  const fallBackToDefaultAuth = async () => {
    // console.warn('please enroll a fingerprint');
  };

  const onLoginPress = async (onSuccessReturn = false) => {
    try {
      setIsLoading(true);
      const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);
      setIsLoading(false);
      if (user) {
        if (onSuccessReturn === true) return true;
        navigation.replace(NAVIGATION_ROUTES.CHAT_SCREEN);
      }
    } catch (err) {
      Alert.alert('Login failed', 'Wrong email or password');
    }
    setIsLoading(false);
    return false;
  };

  const handleBiometricAuth = async () => {
    if (!hasFingerPrint) return;

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      Alert.alert(
        'Biometric record not found',
        'Please verify your identity with your password',
        'OK',
        fallBackToDefaultAuth,
      );
      return;
    }

    const isBiometricLoginAllowed = await loadFromStorage(ALLOW_BIOMETRIC_LOGIN);

    if (!isBiometricLoginAllowed) {
      const status = await onLoginPress(true);
      if (!status) return;
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      disableDeviceFallback: true,
      cancelLabel: 'cancel',
    });

    if (biometricAuth.success) {
      saveIntoStorage(ALLOW_BIOMETRIC_LOGIN, true);
      navigation.replace(NAVIGATION_ROUTES.CHAT_SCREEN);
    }
  };

  const checkHardwareCompatibility = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();

    if (compatible) {
      setHasFingerPrint(true);
    }
  };

  const parseErrorCode = (code) => code.replace('auth/', '').split('-').join(' ');

  const onRegisterPress = async () => {
    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      setShowMessage('Registration successfull. Please login');
      setTimeout(() => setShowMessage(''), 2000);
      handleBiometricAuth();
    } catch (err) {
      Alert.alert('Registration failed', parseErrorCode(err.code));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkHardwareCompatibility();
  }, []);

  return (
    <MainContainer>
      {isLoading && (
        <LoaderContainer>
          <ActivityIndicator size="large" color="#F4845F" />
        </LoaderContainer>
      )}

      {!!showMessage && (
        <MessageContainer>
          <ButtonText>{showMessage}</ButtonText>
        </MessageContainer>
      ) }

      <Container>
        <StyledInput placeholder="enter email" value={email} onChangeText={setEmail} />

        <StyledInput placeholder="enter password" secureTextEntry value={password} onChangeText={setPassword} />

        <StyledButton onPress={onLoginPress} disabled={isLoading}>
          <ButtonText>LOGIN</ButtonText>
        </StyledButton>

        {hasFingerPrint && (
          <StyledButton onPress={handleBiometricAuth} disabled={isLoading}>
            <ButtonText>LOGIN WITH BIOMETRICS</ButtonText>
          </StyledButton>
        )}

        <StyledButton onPress={onRegisterPress} disabled={isLoading}>
          <ButtonText>REGISTER</ButtonText>
        </StyledButton>
      </Container>
    </MainContainer>
  );
};

AuthScreen.propTypes = {
  navigation: shape({}),
};

AuthScreen.defaultProps = {
  navigation: {},
};
