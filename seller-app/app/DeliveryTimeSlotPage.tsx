import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Switch, StyleSheet, Alert, Modal, ActivityIndicator, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';
import { UserContext } from '@/utils/UserContext';
import DropDownPicker from 'react-native-dropdown-picker';
import WheelPickerExpo from "react-native-wheel-picker-expo";

const timeOptions = Array.from({ length: 60 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 })); // 1 to 60
const unitOptions = ["Minute", "Hour", "Day"].map(unit => ({ label: unit, value: unit }));

const DeliveryTimeSlotPage = () => {
    const { user, isLoading } = useContext(UserContext);
    const [timeSlots, setTimeSlots] = useState([]);
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [loading, setLoading] = useState(false)

    const [modalVisible, setModalVisible] = useState(false);
    const [minTime, setMinTime] = useState();
    const [maxTime, setMaxTime] = useState();
    const [unit, setUnit] = useState();

    const [open, setOpen] = useState(false); // Dropdown open/close state
    const [value, setValue] = useState(); // Selected value
    const [items, setItems] = useState(
        // Convert categories array into dropdown-friendly format
        [
            { value: "allTime", label: "All Time Delivery" },
            { value: "quick", label: "Quick Delivery" },
            { value: "deliveryTimeSlot", label: "Delivery Time Slot" },
        ]
    );

    console.log(minTime, maxTime, unit)

    useEffect(() => {
        if (user) {
            setTimeSlots(user?.deliveryTimeSlot)
            setValue(user?.deliveryTimeType)
            if (user?.estimatedDeliveryTime) {
                setMinTime(user?.estimatedDeliveryTime?.minTime)
                setMaxTime(user?.estimatedDeliveryTime?.maxTime)
                setUnit(user?.estimatedDeliveryTime?.unit)
            } else {
                setMinTime(timeOptions[6].label); // Default: 7 minutes
                setMaxTime(timeOptions[9].label); // Default: 10 minutes
                setUnit(unitOptions[0].label); // Default: Minute
            }
        }
    }, [isLoading])

    // Add a new time slot
    const addTimeSlot = () => {
        if (!startTime || !endTime) {
            Alert.alert('Incomplete Time Slot', 'Please select both start and end times.');
            return;
        }

        if (timeSlots.find(slot => slot.start === startTime && slot.end === endTime)) {
            Alert.alert('Duplicate Time Slot', 'This time slot is already added.');
            return;
        }

        setTimeSlots([...timeSlots, { id: timeSlots.length + 1, start: startTime, end: endTime }]);
        setStartTime(null);
        setEndTime(null);
    };

    // Remove a time slot
    const removeTimeSlot = (id) => {
        setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    };

    // Save changes
    const saveChanges = async () => {
        setLoading(true)
        try {
            if (value === "allTime") {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/all-time-delivery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ deliveryTimeType: value, sellerId: user._id }),
                });
                if (response.ok) {
                    Alert.alert('Settings Saved', 'All Time Delivery is enabled.');
                } else {
                    alert('Something wnet wrong');
                }
            } else if (value === "deliveryTimeSlot") {
                if (timeSlots.length === 0) {
                    Alert.alert('No Slots Added', 'Please add at least one time slot or enable All Time Delivery.');
                } else {
                    console.log(timeSlots)
                    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/add-time-slot`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ timeSlots, sellerId: user._id, deliveryTimeType: value }),
                    });

                    if (response.ok) {
                        Alert.alert('Settings Saved', `Time slots saved: ${timeSlots.map(slot => `${slot.start} - ${slot.end}`).join(', ')}`);
                    } else {
                        alert('Something went wrong');
                    }
                }
            } else {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/set-estimated-delivery-time`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ estimatedTime: { minTime, maxTime, unit }, sellerId: user._id, deliveryTimeType: value }),
                });

                if (response.ok) {
                    Alert.alert('Settings Saved', `Estimated Delivery Time: ${minTime + " - " + maxTime + " " + unit}`);
                } else {
                    alert('Something went wrong');
                }
            }
        } catch (error) {
            console.log(error)
            alert("Sonething went wrong")
        }
        setLoading(false)
    };

    if (isLoading && !timeSlots) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Manage Delivery Time"
                }} />
            {/* <Text style={styles.title}>Add Delivery Time Slots</Text>

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>All Time Delivery</Text>
                <Switch
                    value={isAllTimeDelivery}
                    onValueChange={(value) => setIsAllTimeDelivery(value)}
                />
            </View> */}

            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select delivery type"
                placeholderStyle={{ color: "#888" }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
            />

            {value === "quick" && (
                <View>
                    <View style={styles.switchContainer}>
                        {/* <Text style={styles.switchLabel}>Set Estimated Delivery Time</Text> */}
                        {/* Open Modal Button */}
                        <TouchableOpacity style={styles.openButton} onPress={() => setModalVisible(true)}>
                            <Text style={styles.buttonText}>Set Estimated Delivery Time</Text>
                        </TouchableOpacity>

                        {/* Delivery Time Selection Modal */}
                        <Modal animationType="slide" transparent={true} visible={modalVisible}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Estimated Delivery Time</Text>
                                    <Text style={styles.modalSubtitle}>This item will be shown in the user app website</Text>

                                    {/* Wheel Pickers for Min Time, Max Time, and Unit */}
                                    <View style={styles.wheelContainer}>
                                        <WheelPickerExpo
                                            height={150}
                                            width={70}
                                            initialSelectedIndex={6}
                                            items={timeOptions}
                                            onChange={({ item }) => setMinTime(item.label)}
                                        />
                                        <Text style={styles.separator}>-</Text>
                                        <WheelPickerExpo
                                            height={150}
                                            width={70}
                                            initialSelectedIndex={9}
                                            items={timeOptions}
                                            onChange={({ item }) => setMaxTime(item.label)}
                                        />
                                        <WheelPickerExpo
                                            height={150}
                                            width={100}
                                            initialSelectedIndex={0}
                                            items={unitOptions}
                                            onChange={({ item }) => setUnit(item.label)}
                                        />
                                    </View>

                                    {/* Selected Time Preview */}
                                    <Text style={styles.selectedText}>{`${minTime} - ${maxTime} ${unit.toLowerCase()}(s)`}</Text>

                                    {/* Save Button */}
                                    <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.buttonText}>Set</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <Text style={styles.selectedText}>Estimated Delivery Time: {`${minTime} - ${maxTime} ${unit.toLowerCase()}(s)`}</Text>
                </View>
            )}

            {value === "deliveryTimeSlot" && (
                <View>
                    <Text style={styles.switchLabel}>Add Delivery Time Slot</Text>
                    <ScrollView horizontal style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Start Time (e.g., 8:00 AM)"
                            value={startTime}
                            onChangeText={setStartTime}
                            placeholderTextColor={"#4a4a4a"}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="End Time (e.g., 10:00 AM)"
                            value={endTime}
                            onChangeText={setEndTime}
                            placeholderTextColor={"#4a4a4a"}
                        />
                    </ScrollView>

                    <TouchableOpacity style={styles.addButton} onPress={addTimeSlot}>
                        <Text style={styles.addButtonText}>Add Time Slot</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={timeSlots}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.timeSlotItem}>
                                <Text style={styles.timeSlotText}>{`${item.start} - ${item.end}`}</Text>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeTimeSlot(item.id)}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            {/* Modal for loading popup */}
            {loading && (
                <Modal transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.loadingText}>Saving Changes...</Text>
                    </View>
                </Modal>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    dropdown: {
        borderColor: "#ccc",
        marginBottom: 10
    },
    dropdownContainer: {
        borderColor: "#ccc",
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '800',
        paddingVertical: 10,
        textAlign: 'center',
        marginTop: 6
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#f9f9f9',
    },
    addButton: {
        backgroundColor: '#1254e8',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    timeSlotItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    timeSlotText: {
        fontSize: 16,
    },
    removeButton: {
        backgroundColor: '#f44336',
        padding: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        width: '100%'
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        color: '#ffffff',
    },
    openButton: { backgroundColor: "#ff6600", padding: 15, borderRadius: 5, width: "100%" },
    buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
    modalTitle: { fontSize: 18, fontWeight: "bold" },
    modalSubtitle: { fontSize: 14, color: "gray", textAlign: "center", marginVertical: 10 },
    selectedText: { fontSize: 16, marginVertical: 10, fontWeight: "bold", color: "#333" },
    // saveButton: { backgroundColor: "#ff6600", padding: 10, borderRadius: 5, marginTop: 10 },
    wheelContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginVertical: 10 },
    separator: { fontSize: 20, fontWeight: "bold", marginHorizontal: 5 },
});

export default DeliveryTimeSlotPage;
