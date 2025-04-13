import { Alert, Linking } from "react-native";

const openURLInBrowser = async (url) => {
    try {
        // Check if the device can open the URL
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            // Open the URL in the device browser
            await Linking.openURL(url);
        } else {
            Alert.alert('Error', `Can't handle URL: ${url}`);
        }
    } catch (error) {
        console.error('Error opening the URL:', error);
        Alert.alert('Error', 'Something went wrong while trying to open the link.');
    }
};

export default openURLInBrowser