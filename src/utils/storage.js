import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveIntoStorage = (key, data) => {
  const parsedData = JSON.stringify({ data });
  AsyncStorage.setItem(key, parsedData);
};

export const loadFromStorage = async (key) => {
  try {
    const { data } = JSON.parse(await AsyncStorage.getItem(key));
    return data;
  } catch (err) {
    // do nothing
  }
  return null;
};
