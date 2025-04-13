import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import moment, { isMoment } from "moment";

const TimeSlotSelection = ({ onSlotSelect, timeSlots, selectedDay, setSelectedDay }) => {

    const getTimeSlots = () => {
        const now = moment();
        const todaySlots = [];
        const tomorrowSlots = [...timeSlots]; // Tomorrow always gets full slots

        timeSlots.forEach((slot) => {
            const slotTime = moment(slot.start, "h:mm A");

            if (slotTime.isAfter(now)) {
                todaySlots.push(slot); // Add only future slots for today
            }
        });

        return { todaySlots, tomorrowSlots };
    };

    const { todaySlots, tomorrowSlots } = getTimeSlots();
    // const [selectedDay, setSelectedDay] = useState("Today");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slotsToShow, setSlotsToShow] = useState(todaySlots);

    useEffect(() => {
        setSlotsToShow(selectedDay === "Today" ? todaySlots : tomorrowSlots);
    }, [selectedDay]);

    return (
        <View style={styles.slotContainer}>
            {/* Date Selection Tabs */}
            <View style={styles.dateSelector}>
                {["Today", "Tomorrow"].map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                            styles.dateButton,
                            selectedDay === day && styles.selectedDateButton,
                        ]}
                        onPress={() => {
                            setSelectedDay(day)
                            setSelectedSlot(null)
                            onSlotSelect(null)
                        }}
                    >
                        <Text
                            style={[
                                styles.dateText,
                                selectedDay === day && styles.selectedDateText,
                            ]}
                        >
                            {day}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Available Time Slots */}
            {slotsToShow.length === 0 ? (
                <Text style={styles.noSlotsText}>No slots available for {selectedDay}.</Text>
            ) : (
                <FlatList
                    data={slotsToShow}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={[
                                styles.slot,
                                selectedSlot === index && styles.selectedSlot,
                            ]}
                            onPress={() => {
                                setSelectedSlot(index);
                                if (onSlotSelect) onSlotSelect(item);
                            }}
                        >
                            <Text
                                style={[
                                    styles.slotText,
                                    selectedSlot === index && styles.selectedSlotText,
                                ]}
                            >
                                {item.start} - {item.end}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default TimeSlotSelection;

const styles = StyleSheet.create({
    slotContainer: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingBottom: 10
    },
    dateSelector: {
        flexDirection: "row",
        marginBottom: 15,
    },
    dateButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "#E0E0E0",
        marginRight: 10,
    },
    selectedDateButton: {
        backgroundColor: "#1254e8",
    },
    dateText: {
        fontSize: 16,
        color: "#333",
    },
    selectedDateText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    noSlotsText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
    slot: {
        backgroundColor: "#E0E0E0",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginRight: 10,
        height: 55,
        justifyContent: "center",
    },
    selectedSlot: {
        backgroundColor: "#1254e8",
    },
    slotText: {
        fontSize: 16,
        color: "#333",
    },
    selectedSlotText: {
        color: "#fff",
    },
});
