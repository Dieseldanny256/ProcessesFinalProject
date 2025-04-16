import { StyleSheet, Image, Platform, View, ImageBackground, TextInput, Button, TouchableOpacity, Text, FlatList, ActivityIndicatorBase, Dimensions, Modal, ScrollView} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import EditWorkoutPanel from '@/components/EditWorkoutPanel';



const screenWidth = Dimensions.get('window').width;
const vw = (percent: number) => screenWidth * (percent / 100);

const Dashboard: React.FC = () => {
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthAbrreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    interface Exercise {
        exerciseId: {
          _id: number;
          name: string;
          category: string;
          __v: number;
        };
        sets: number;
        reps: number;
        _id: number;
      }

    interface ExerciseDayData {
        exercises: Exercise[],
        isChecked: boolean
      }

    const[weekOffset, setWeekOffset] = useState(0);
    const[weekExcercises, setWeekExercises] = useState<ExerciseDayData[]>(
        [{exercises: [], isChecked: false},
         {exercises: [], isChecked: false},
         {exercises: [], isChecked: false},
         {exercises: [], isChecked: false},
         {exercises: [], isChecked: false},
         {exercises: [], isChecked: false},
         {exercises: [], isChecked: false}]);
    const[startDate, setStartDate] = useState<Date>(getSundayOfWeek(0));

    const [userId, setUserId] = useState<string>('');
    const [userData, setUserData] = useState<any>(null);

    const app_name = 'powerleveling.xyz';

    function buildPath(route:string) : string
    {
        if (process.env.NODE_ENV != 'development')
        {
            return 'http://' + app_name + ':5000/' + route;
        }
        else
        {
            return 'http://powerleveling.xyz:5000/' + route;
        }
    }
    

    function getDateString(date : Date)
    {
        let string = date.getFullYear() + "-";
        let month = (date.getMonth() + 1).toString();
        if (month.length < 2) {month = "0" + month;}
        let day = (date.getDate()).toString();
        if (day.length < 2) {day = "0" + day;}
        string = string + month + "-" + day;

        return string;
    }

    function getSundayOfWeek(offset = 0)
    {
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay() + offset * 7);
        return sunday;
    }
    const [panelVisible, setPanelVisible] = useState<boolean>(false);
    const [date, updateDate] = useState<string>('');
    const [index, updateIndex] = useState<number>(-1);

    const getDayIndex = (dateString: string) => {
        const parts = dateString.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        const selectedDate = new Date(year, month, day);
        const diffTime = selectedDate.getTime() - startDate.getTime();
        return Math.floor(diffTime / (1000 * 3600 * 24));
      };

    const [selectedExercise, setSelectedExercise] = useState({
        exerciseId: { _id: -1, name: "Select Workout", category: "", __v: -1 },
        sets: 0,
        reps: 0,
        _id: -1
      });

    useEffect(() => {
        setStartDate(getSundayOfWeek(weekOffset));
    }, [weekOffset]);

    useEffect(() => {
        const fetchExercises = async () => {
            console.log("Fetching exercises...");
    
            
            const _userData = await AsyncStorage.getItem('user_data');
            if (_userData) {
                const userData = JSON.parse(_userData);
                console.log("User data retrieved:", userData);
                setUserId(userData.userId);
                setUserData(userData);
            } else {
                console.log("No user data found in AsyncStorage.");
            }
    
            const dateString = getDateString(startDate);
            console.log("Date string for the request:", dateString);

            const fullPath = buildPath(`api/workouts/${userId}/${dateString}/weekExercises`);
            console.log("Full API path:", fullPath);
    
            try {
                console.log("Making API request...");
                const response = await fetch(fullPath);
                console.log("API response status:", response.status);
                
                const data = await response.json();
                console.log("Data received from API:", data);
                
                setWeekExercises(data.exercises || 
                    [{exercises: [], isChecked: false}, 
                     {exercises: [], isChecked: false}, 
                     {exercises: [], isChecked: false}, 
                     {exercises: [], isChecked: false}, 
                     {exercises: [], isChecked: false},
                     {exercises: [], isChecked: false},
                     {exercises: [], isChecked: false}]);
            } catch (err) {
                console.error("Error fetching exercises:", err);
            }
        
        };
    
        fetchExercises();
    }, [startDate, panelVisible]);
    
    const compareDates = (date1 : Date, date2 : Date) =>
    {
        if (date1.getFullYear() < date2.getFullYear())
        {
            return -1;
        }
        else if (date1.getFullYear() > date2.getFullYear())
        {
            return 1;
        }
          
        //Same year
        if (date1.getMonth() < date2.getMonth())
        {
            return -1;
        }
        else if (date1.getMonth() > date2.getMonth())
        {
            return 1;
        }
      
        //Same year and month
        if (date1.getDate() < date2.getDate())
        {
            return -1;
        }
        else if (date1.getDate() > date2.getDate())
        {
            return 1;
        }
        return 0;
    }

    const handleAddClick = (date: Date) => {
        updateDate(getDateString(date));
        updateIndex(-1);
        setSelectedExercise({
            exerciseId: { _id: -1, name: "Select Workout", category: "", __v: -1 },
            sets: 0,
            reps: 0,
            _id: -1
        });
        setPanelVisible(true);
        
    };
      
    return (
      <ThemedView style={styles.container}>
        <View style={{ flex: 1 }}>
        <ThemedView style={styles.header}>
            <ThemedText style={styles.headerText}>DASHBOARD</ThemedText>

            <Image
                source={require("@/assets/images/logo.png")}
                style={styles.image}
            />
        </ThemedView>

        <ImageBackground
            source={require("@/assets/images/dots3.png")}
            style={styles.background}
            resizeMode='cover'
        >
            <ThemedText type="title" style={styles.monthText}>{monthNames[startDate.getMonth()]} {startDate.getFullYear()}</ThemedText>
            
            <View style={styles.calendarControls}>
            <TouchableOpacity 
                style={styles.arrowButton}
                onPress={() => setWeekOffset((prev) => prev - 1)}
            >
                <ThemedText style={styles.arrowText}>&lt;</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.arrowButton}
                onPress={() => setWeekOffset((prev) => prev + 1)}
            >
                <ThemedText style={styles.arrowText}>&gt;</ThemedText>
            </TouchableOpacity>
            </View>
            
            <View style={styles.dayHeader}>
                {Array.from({ length: 7 }).map((_, i) => {
                    const headDate = new Date(startDate);
                    headDate.setDate(headDate.getDate() + i);
                    return (
                    <View key={`header-${i}`} style={styles.dayHeaderCell}>
                        <ThemedText style={styles.dayName}>
                        {dayNames[headDate.getDay()]}
                        </ThemedText>
                    </View>
                    );
                })}
            </View>
            {/*<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>*/}
                <View style={styles.weekContainer}>
                    {Array.from({ length: 7 }).map((_, i) => {
                    const cellDate = new Date(startDate);
                    cellDate.setDate(cellDate.getDate() + i);
                    const hasPassed = compareDates(new Date(), cellDate) > 0;
                    const isToday = compareDates(new Date(), cellDate) === 0;

                    return (
                        <ScrollView 
                            key={`day-${i}`}
                            style={[
                                styles.dayCell,
                                isToday && styles.todayCell,
                                hasPassed && styles.passedDay
                            ]}
                        >
                            {/* Date Header */}
                            <View style={styles.dateHeader}>
                                <ThemedText style={styles.dayName}>
                                    {monthAbrreviations[cellDate.getMonth()]}
                                </ThemedText>
                                <ThemedText style={styles.dateText}>
                                    {cellDate.getDate()}
                                </ThemedText>
                            </View>
                            
                            {/* Exercises List */}
                            {weekExcercises[i]?.exercises.map((exercise: any, j: number) => (
                                <View key={`exercise-${j}`} style={styles.exerciseItem}>
                                    <Text style={styles.exerciseName}>
                                        {exercise.exerciseId.name}
                                    </Text>
                                    <Text style={styles.exerciseDetails}>
                                        {exercise.reps} x {exercise.sets}
                                    </Text>
                                </View>
                            ))}

                            {/* Add Exercise Button
                            <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleAddClick(cellDate)}
                            >
                            <ThemedText style={styles.addButtonText}>+</ThemedText>
                            </TouchableOpacity>
                            */}
                        </ScrollView>
                    );
                    })}
                </View>
                {/* Add Exercise Button
            <EditWorkoutPanel 
                date={date}
                index={index}
                showPanel={setPanelVisible}
                panelVisible={panelVisible}
                exerciseType={selectedExercise}
                setExerciseType={setSelectedExercise}
            />
            */}
        </ImageBackground>
        </View>
      </ThemedView>

    );
};

const styles = StyleSheet.create({

    
    container: {
      flex: 1,
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#BA0000', 
        height: '13%',
        width: '100%',
        borderBottomWidth: 5,
        borderBottomColor: '#000000', //black
    },
    headerText:{
        top: 30,
        fontSize: 24,
        padding: 50,
        color: 'white',
        fontFamily: 'MicrogrammaEB',
        right: 30,
    },
    image:{
        top: 20,
        right: 20,
        resizeMode: 'contain',
        height: '50%',
        width: '25%',
      },
    background:{
        flex: 1,
        //height: '95%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    monthText:{
        fontSize:30,
        top: 0,
        
    },
    calendarControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        top: 0,
        padding: 0,
    },
    arrowButton: {
        padding: 0,
        marginLeft: 50, 
        marginRight: 50
    },
    arrowText: {
        fontSize: 40,
        fontWeight:'bold',
        padding: 20
    },
    weekContainer: {
        flexDirection: 'row',
        marginHorizontal: 0,
        borderRightWidth: 1, 
        borderBottomWidth: 1,
        height: '75%'
    },
    dayCell: {
        width: '14.28%',
        padding: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#000000',
    },
    todayCell:{
        borderWidth: 3,
        borderColor: '#FFB202',
        backgroundColor: '#fefdcd',
    },
    passedDay: {
        backgroundColor: '#9b9b9b',
        opacity: 0.7,
    },
    dayHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000000',
        backgroundColor: '#ba0000',
        borderWidth: 1,
    },
    dayHeaderCell: {
        borderWidth: 1,
        borderColor: '#000000',
        width: '14.28%', 
        alignItems: 'center',
        padding: 4,
        //backgroundColor: '#ba0000',
    },
    dateHeader: {
        alignItems: 'center',
        marginBottom: 4,
        borderRadius: 2,
    },
    dayName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000000',
    },
    dateText: {
        fontSize: 14,
        color: '#000000',
    },
    addButton:
    {
        alignItems: 'center',
        marginVertical: 4,
        borderRadius:2,
        height: 30,
        backgroundColor: '#000000'
    },
    addButtonText:
    {   
        top: 7,
        fontSize: 14,
        color:'#ffffff',
    },
    exerciseItem: {
        marginVertical: 2,
        padding: 2,
        right: 5,
        width: '130%',
        backgroundColor:'#e2e2e2',
        borderRadius: 2,
    },
    exerciseName: {
        fontSize: 8,
        color: '#000000',
        fontFamily: 'MicrogrammaEB',
    },
    exerciseDetails: {
        fontSize: 9,
        color: '#000000',
        fontFamily: 'MicrogrammaEB',
    },
  });
  
  export default Dashboard;