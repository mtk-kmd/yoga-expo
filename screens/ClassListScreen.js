import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from 'react-native';

export default function ClassListScreen({ navigation }) {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [booking, setBooking] = useState([]);
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');

  const fetchClasses = async () => {
    const response = await fetch('https://yoga.mtktechlab.com/classes');
    const data = await response.json();
    setClasses(data);
    setFilteredClasses(data);
  };

  const fetchBooking = async () => {
    const response = await fetch('https://yoga.mtktechlab.com/bookings');
    const data = await response.json();
    setBooking(data.bookings);
  }

  useEffect(() => {
    fetchClasses();
    fetchBooking();
  }, []);

  const refreshButton = () => {
    fetchClasses();
    fetchBooking();
  }

  const deleteBooking = async (id) => {
    console.log(id);
    const response = await fetch(`https://yoga.mtktechlab.com/bookings?id=${id}`, {
      method: 'DELETE',
    });

    fetchBooking();
  }

  const filterClasses = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = classes.filter(item =>
      item.day.toLowerCase().includes(lowerQuery) ||
      item.time.toLowerCase().includes(lowerQuery)
    );
    setFilteredClasses(filtered);
  };

  const filterBookings = (query) => {
    const lowerQuery = query.toLowerCase();
    if (!query.trim()) {
      setFilteredBooking(booking);
    } else {
      const filtered = booking.filter(item =>
        item.type.toLowerCase().includes(lowerQuery) ||
        item.day.toLowerCase().includes(lowerQuery) ||
        item.time.toLowerCase().includes(lowerQuery)
      );
      setFilteredBooking(filtered);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search by day or time"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          filterClasses(text);
        }}
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your available bookings:</Text>
      <FlatList
        data={filteredClasses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.day} - {item.time}</Text>
            <Button
              title="Book Now"
              onPress={() => navigation.navigate('Booking', { classId: item.id })}
            />
          </View>
        )}
      />
      {booking.length > 0 && (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your booked classes:</Text>
          <Button title="Refresh" onPress={refreshButton} />
          <TextInput
            style={styles.input}
            placeholder="Search your bookings by type, day, or time"
            value={bookingSearchQuery}
            onChangeText={(text) => {
              setBookingSearchQuery(text);
              filterBookings(text); // Update the filtered list
            }}
          />
          <FlatList
            data={filteredBooking} // Display filtered or all bookings
            keyExtractor={(item, index) => `${item.bookingId}-${index}`}
            renderItem={({ item }) => (
              <View>
                <Text>{item.type}</Text>
                <Text>{item.day} - {item.time}</Text>
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => deleteBooking(item.bookingId)}
                />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
  },
});
