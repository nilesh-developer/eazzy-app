import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AppButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1254e8', // Modern purple color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, // Rounded corners for a sleek look
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Adds a shadow for Android
  },
  buttonText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppButton;
