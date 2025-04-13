import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button, Linking } from 'react-native';

const AboutScreen = () => {
    const handleEmailPress = (email) => {
        const emailUrl = `mailto:${email}`;
        Linking.openURL(emailUrl).catch(err => {
          console.error("Failed to open email app:", err);
        });
      };
    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: "About",
                    headerTitleStyle: {
                        color: '#333',
                    },
                    headerStyle: {
                        backgroundColor: '#FFFFFF',
                    },
                }}
            />
            {/* Header Section */}
            <View style={styles.header}>
                <Image
                    source={require("../assets/images/favicon.png")} // ./assets/assets/images/icon.png
                    style={styles.logo}
                />
                <Text style={styles.title}>Welcome to Eazzy App</Text>
                <Text style={styles.subtitle}>Connecting local businesses to their communities</Text>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                {/* About Section */}
                <Text style={styles.sectionTitle}>What is Eazzy App?</Text>
                <Text style={styles.description}>
                    Eazzy App is a platform tailored to bring your favorite local shops online.
                    From groceries and dairies to clothing and electronic stores, this app connects customers
                    with local businesses. Our platform is designed to simplify ordering, enhance customer convenience,
                    and empower small businesses by increasing their reach.
                </Text>

                {/* For Shop Owners Section */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>For Shop Owners</Text>
                    <Text style={styles.cardDescription}>
                        Open your virtual shop, list your products, and manage orders effortlessly.
                        Connect with nearby customers and expand your customer base, all while keeping things
                        simple and streamlined.
                    </Text>
                </View>

                {/* For Customers Section */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>For Customers</Text>
                    <Text style={styles.cardDescription}>
                        Find and connect with your favorite local stores using unique store codes.
                        Browse products, place orders online, and have items delivered to your doorstep or
                        schedule a pickup at your convenience.
                    </Text>
                </View>

                {/* Features Section */}
                <Text style={styles.sectionTitle}>Key Features</Text>
                <View style={styles.featureContainer}>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📦</Text>
                        <Text style={styles.featureText}>Digital Storefront for easy product listing</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🔑</Text>
                        <Text style={styles.featureText}>Unique Store Codes for customer connection</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🛒</Text>
                        <Text style={styles.featureText}>Seamless Ordering with delivery or pickup</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📍</Text>
                        <Text style={styles.featureText}>Localized Connection for nearby customers</Text>
                    </View>
                </View>

                {/* Mission Statement */}
                <Text style={styles.sectionTitle}>Our Mission</Text>
                <Text style={styles.description}>
                    We aim to create a reliable and accessible platform that supports small businesses and
                    strengthens communities. By enabling online ordering and connecting customers with
                    local stores, we’re helping businesses thrive in the digital world while preserving the charm of shopping locally.
                </Text>

                {/* Contact Section */}
                <Text style={styles.sectionTitle}>Get in Touch</Text>
                <Text style={styles.description}>
                    Need help or have feedback? Reach out to our team, and we’ll be happy to assist you!
                </Text>
                <Text style={styles.contact} onPress={() =>  handleEmailPress("mail.eazzystore@gmail.com")}>📧 Email: mail.eazzystore@gmail.com</Text>
                <Text style={styles.contact}>📞 Phone: (+91) 99204 75160</Text>

                {/* CTA */}
                {/* <Button
                    title="Learn More About How It Works"
                    onPress={() => { }}
                    color="#1254e8"
                /> */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1254e8',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 10,
        marginTop: 20,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4B5563',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 15,
        elevation: 2, // For Android
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1254e8',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 22,
    },
    featureContainer: {
        marginTop: 10,
        marginBottom: 15,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    featureText: {
        fontSize: 16,
        color: '#4B5563',
    },
    contact: {
        fontSize: 16,
        color: '#1254e8',
        marginBottom: 5,
    },
});

export default AboutScreen;
