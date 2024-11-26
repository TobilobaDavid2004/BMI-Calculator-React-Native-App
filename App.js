import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [age, setAge] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiData, setBmiData] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [history, setHistory] = useState([]);

  const calculateBMI = () => {
    if (!age || !heightFeet || !heightInches || !weight) {
      setValidationError("Please enter age, height, and weight.");
      return;
    }

    const ageValue = parseInt(age);
    const feet = parseInt(heightFeet);
    const inches = parseInt(heightInches);
    const weightInKg = parseFloat(weight);

    if (isNaN(ageValue) || isNaN(feet) || isNaN(inches) || isNaN(weightInKg)) {
      setValidationError("All inputs must be valid numbers.");
      return;
    }

    const heightInMeters = (feet * 12 + inches) * 0.0254; // Convert to meters
    const result = weightInKg / (heightInMeters * heightInMeters);
    const roundedBMI = result.toFixed(2);

    let category = "";
    if (roundedBMI < 18.5) category = "Underweight";
    else if (roundedBMI < 25) category = "Normal weight";
    else if (roundedBMI < 30) category = "Overweight";
    else category = "Obesity";

    setBmiData({ bmi: roundedBMI, category });
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        id: Date.now().toString(),
        bmi: roundedBMI,
        category,
        age: ageValue,
        height: `${feet}'${inches}"`,
        weight: `${weightInKg} kg`,
      },
    ]);
    setValidationError("");
  };

  const clearInputs = () => {
    setAge("");
    setHeightFeet("");
    setHeightInches("");
    setWeight("");
    setBmiData(null);
    setValidationError("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const github = () => {
    Linking.openURL("https://github.com/SPRHackz");
  };

  return (
    <LinearGradient colors={["#4A90E2", "#50C9C3"]} style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.card}>
        <Text style={styles.title}>BMI Calculator</Text>

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <Text style={styles.label}>Height</Text>
        <View style={styles.heightContainer}>
          <TextInput
            style={[styles.input, styles.heightInput]}
            placeholder="Feet"
            keyboardType="numeric"
            value={heightFeet}
            onChangeText={setHeightFeet}
          />
          <TextInput
            style={[styles.input, styles.heightInput]}
            placeholder="Inches"
            keyboardType="numeric"
            value={heightInches}
            onChangeText={setHeightInches}
          />
        </View>

        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Weight"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={clearInputs}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {validationError ? (
          <Text style={styles.validationError}>{validationError}</Text>
        ) : null}

        {bmiData && (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>Your BMI: {bmiData.bmi}</Text>
            <Text style={styles.bmiCategory}>{bmiData.category}</Text>
          </View>
        )}

        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>History:</Text>
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <Text style={styles.historyText}>
                    Age: {item.age}, Height: {item.height}, Weight: {item.weight}, 
                    BMI: {item.bmi} ({item.category})
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.clearHistoryButton} onPress={clearHistory}>
              <Text style={styles.clearHistoryButtonText}>Clear History</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={github}>
        <Text style={styles.github}>&copy; 2024 App</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  heightInput: {
    width: "48%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  calculateButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultCard: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#50C9C3",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  bmiCategory: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 10,
  },
  validationError: {
    color: "#F44336",
    marginTop: 10,
    fontSize: 16,
  },
  historyContainer: {
    marginTop: 20,
    width: "100%",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  historyItem: {
    paddingVertical: 5,
  },
  historyText: {
    fontSize: 16,
    color: "#555",
  },
  clearHistoryButton: {
    backgroundColor: "#FF6F61",
    padding: 10,
    marginTop: 10,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
  },
  clearHistoryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  github: {
    fontSize: 16,
    color: "#4A90E2",
    marginTop: 20,
  },
});