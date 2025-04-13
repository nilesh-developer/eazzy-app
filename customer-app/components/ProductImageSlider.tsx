import { Image } from 'expo-image';
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const ProductImageSlider = ({ product }) => {
    const [loadedImages, setLoadedImages] = useState({});

    const handleLoad = (index) => {
        setLoadedImages((prev) => ({ ...prev, [index]: true }));
    };

    const imageSources = [
        product.images.featuredImage,
        product.images.image1,
        product.images.image2,
        product.images.image3,
        product.images.image4
    ].filter(Boolean);

    return (
        <View style={styles.imageContainer}>
            <Swiper
                style={styles.wrapper}
                showsPagination={true}
                dotStyle={{ backgroundColor: '#ccc', width: 8, height: 8 }}
                activeDotStyle={{ backgroundColor: '#1254e8', width: 10, height: 10 }}
                autoplay={false}
                loop={false}
            >
                {imageSources.map((imageUri, index) => (
                    <View style={styles.slide} key={index}>
                        {!loadedImages[index] && (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#1254e8" />
                            </View>
                        )}
                        {(!loadedImages[index] || imageUri) && (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.productImage}
                                contentFit="contain"
                                onLoad={() => handleLoad(index)}
                            />
                        )}
                    </View>
                ))}
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 300,
        marginBottom: 16,
    },
    wrapper: {
        height: 300,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    }
});

export default ProductImageSlider;
