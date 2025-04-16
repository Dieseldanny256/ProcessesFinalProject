import React, { useState, useEffect } from 'react';
import {View,Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

interface Exercise {
  _id: number;
  name: string;
  category: string;
  __v: number;
}

interface EditWorkoutPanelProps {
    date: string;
    index: number;
    showPanel: (visible: boolean) => void;
    panelVisible: boolean;
    //userId: string;
    exerciseType:{
      exerciseId: Exercise;
      sets: number;
      reps: number;
      _id: number;
    };
    setExerciseType: React.Dispatch<React.SetStateAction<{
      exerciseId: Exercise;
      sets: number;
      reps: number;
      _id: number;
    }>>;
  }
  
  const EditWorkoutPanel: React.FC<EditWorkoutPanelProps> = ({ 
    date, 
    index, 
    showPanel, 
    panelVisible,
    exerciseType,
    setExerciseType
  }) => {
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [type, setType] = useState({ _id: -1, name: "Select Workout", category: "", __v: -1 });
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    useEffect(() => {
      if (panelVisible) {
        setSets(exerciseType.sets.toString());
        setReps(exerciseType.reps.toString());
        setType(exerciseType.exerciseId);
      }
    }, [panelVisible, exerciseType]);

    const handleSetType = (exercise: Exercise) => {
      setType(exercise);
      setExerciseType(prev => ({
        ...prev,
        exerciseId: exercise,
      }));
      setDropdownVisible(false);
    };

    useEffect(() => {
      async function loadExercises(): Promise<void> {
        try {
          // Get the API response
          const response = await fetch(buildPath('api/exercises'), 
            { method: 'GET', headers: { 'Content-Type': 'application/json' } });
          const res = await response.json();
          setExercises(res);
        } catch (error: any) {
          console.error(error.toString());
          return;
        }
      }
    
      loadExercises();
    }, []);

    const app_name = 'powerleveling.xyz';
    
    function buildPath(route: string): string {
      if (process.env.NODE_ENV != 'development') {
        return 'http://' + app_name + ':5000/' + route;
      } else {
        return 'http://powerleveling.xyz:5000/' + route;
      }
    }

    const addExercise = async () => {
    const _userData = await AsyncStorage.getItem("user_data");
    if (!_userData) {
      alert("User not logged in.");
      return;
    }
    const userData = JSON.parse(_userData);
    const userId = userData.userId;

    try {
      if (type._id === -1) {
        return;
      }

      var obj = { exercises: [{ exerciseId: type._id, sets: sets, reps: reps }] };
      var js = JSON.stringify(obj);
      const response = await fetch(buildPath(`api/workouts/${userId}/${date}/add`), {
        method: 'PUT',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.message == null) {
        console.error("Failed to add exercise.");
      }
      
    } 
    catch (err) {
      console.error(err);
    }
  };

  const editExercise = async () => {
    const _userData = await AsyncStorage.getItem("user_data");
    if (!_userData) {
      alert("User not logged in.");
      return;
    }
    const userData = JSON.parse(_userData);
    const userId = userData.userId;

    try {
      if (exerciseType.exerciseId._id === -1) return;

      const obj = { exercise: { exerciseId: exerciseType.exerciseId._id, sets: exerciseType.sets, reps: exerciseType.reps } };
      const js = JSON.stringify(obj);
      const response = await fetch(buildPath(`api/workouts/update/${userId}/${date}/${index}`), {
        method: 'PUT',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!data.message) alert("Failed to edit exercise.");
    } catch (err) {
      console.error(err);
      alert("Failed to edit exercise.");
    }
  };

  const saveChanges = async () => {
    if (exerciseType._id === -1) {
      await addExercise();
    } else {
      await editExercise();
    }
    showPanel(false);
  };

  const handleSetReps = (value: string) => {
    setReps(value);
    setExerciseType(prev => ({
      ...prev,
      reps: parseInt(value) || 0
    }));
    setDropdownVisible(false);
  };

  const handleSetSets = (value: string) => {
    setSets(value);
    setExerciseType(prev => ({
      ...prev,
      sets: parseInt(value) || 0
    }));
  };

  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={panelVisible}
      onRequestClose={() => showPanel(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalText}>Modify Exercise</ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Type:</ThemedText>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              {/*<ThemedText style={styles.label}>{type.name}</ThemedText>*/}
              <ThemedText style={styles.buttonText}>
                  {exerciseType.exerciseId._id === -1 ? "[Select]" : exerciseType.exerciseId.name}
              </ThemedText>
            </TouchableOpacity>
            
            {dropdownVisible && (
              <ScrollView style={styles.dropdown} nestedScrollEnabled={true}>
                {exercises.map((exercise, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.dropdownItem}
                    onPress={() => handleSetType(exercise)}
                  >
                    <ThemedText style={styles.dropdownItemText}>{exercise.name}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
          
          <View style={styles.input}>
            <ThemedText style={styles.label}>Sets:</ThemedText>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={exerciseType.sets?.toString() || ''}
              onChangeText={setSets}
            />
          </View>
          
          <View style={styles.input}>
            <ThemedText style={styles.label}>Reps:</ThemedText>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={exerciseType.reps?.toString() || ''}
              onChangeText={setReps}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => showPanel(false)}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={saveChanges}
            >
              <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff0f0',
    },
    modalContent: {
        width: screenWidth * 0.8,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000000',
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 5,
        padding: 12,
        backgroundColor: '#ffffff',
      },
      dropdown: {
        maxHeight: 150,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: '#ffffff',
      },
      dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
      },
      dropdownItemText: {
        fontSize: 16,
        color: '#000000',
      },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#000000',
      },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff4444',
        marginRight: 5,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        marginLeft: 5,
    },
    buttonText: {
        color: '#000000',
        fontWeight: 'bold',
    },
});
export default EditWorkoutPanel;