import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function BookingScreen({ route }) {
    const { classId } = route.params; // Assuming classId is passed via navigation route
    const [email, setEmail] = useState('');
    const [cart, setCart] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // To handle button state

    const addToCart = () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter a valid email before adding to cart.');
            return;
        }
        setCart((prevCart) => [...prevCart, classId]);
        Alert.alert('Success', 'Class added to cart!');
    };

    const submitBooking = async () => {
        console.log("Submitting Booking with:", { email, cart }); // Debugging cart and email

        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Please enter your email to proceed.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = JSON.stringify({ email, cart });
            console.log(payload); // Debug the payload
            console.log("Payload being sent:", payload); // Debug the payload

            const response = await fetch('https://yoga.mtktechlab.com/cart/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            });

            const data = await response.json();
            console.log("API Response:", data); // Debug API response

            if (response.ok && data.message) {
                Alert.alert('Success', 'Your booking has been submitted!');
                setCart([]); // Clear the cart after submission
                setEmail(''); // Reset email field
            } else {
                Alert.alert('Error', data.error || 'Failed to book the classes.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            Alert.alert('Error', 'An error occurred while booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Book Your Class</Text>
            <Text>Class ID: {classId}</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Button title="Add to Cart" onPress={addToCart} />

            <View style={styles.submitButton}>
                <Button
                    title={isSubmitting ? 'Submitting...' : 'Submit Booking'}
                    onPress={submitBooking}
                    disabled={isSubmitting}
                />
            </View>

            <View style={styles.cartDetails}>
                <Text style={styles.cartHeader}>Your Cart:</Text>
                {cart.length > 0 ? (
                cart.map((id, index) => (
                    <Text key={index} style={styles.cartItem}>
                    Class ID: {id}
                    </Text>
                ))
                ) : (
                <Text style={styles.cartEmpty}>Cart is empty</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    submitButton: {
        marginVertical: 10,
    },
    cartDetails: {
        marginTop: 20,
    },
    cartHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    cartItem: {
        fontSize: 14,
        paddingVertical: 2,
    },
    cartEmpty: {
        fontStyle: 'italic',
        color: '#888',
    },
});
