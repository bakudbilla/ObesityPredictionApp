import { useState, useEffect } from "react";
import InputField from "../utils/InputField";
import regplot from "../assets/regplot.png";
import lossCurve from "../assets/losscurve.png";


export default function Prediction() {
    const [userInput, setUserInput] = useState({
        age: "",
        weight: "",
        height: "",
        bmi: "0.00",
        activityLevel: "",
    });
    const [gender, setGender] = useState("");
    const [error, setError] = useState(""); 
    const [prediction, setPrediction] = useState(null);

    function handleUserInput(event) {
        const { name, value } = event.target;
        if (parseFloat(value) < 0) return;
        if (name === "activityLevel" && parseFloat(value) > 4) return;

        setUserInput((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function calculateBmi() {
        const weight = parseFloat(userInput.weight);
        const height = parseFloat(userInput.height) / 100; 
        if (weight > 0 && height > 0) {
            const bmi = (weight / (height * height)).toFixed(2); 
            setUserInput((prevData) => ({
                ...prevData,
                bmi,
            }));
        }
    }

    async function handleSubmitForm(event) {
        event.preventDefault();

        if (!userInput.age || !userInput.weight || !userInput.height || !userInput.activityLevel || !gender) {
            setError("Please fill all fields before submitting.");
            return;
        }
        setError(""); 

        try {
            const response = await fetch("https://ml-pipeline-summative-03ve.onrender.com/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Age: parseFloat(userInput.age),
                    Gender: gender,
                    Height: parseFloat(userInput.height),
                    Weight: parseFloat(userInput.weight),
                    BMI: parseFloat(userInput.bmi),
                    PhysicalActivityLevel: parseFloat(userInput.activityLevel),
                }),
            });

            const result = await response.json();
            console.log("🔍 Full API Response:", result); // ✅ Debug API response
            
            if (response.ok && result.predicted_obesity_category) {
                setPrediction(result.predicted_obesity_category);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error("Prediction Error:", error);
            alert("Prediction request failed! Check the API response format.");
        }
    }

    useEffect(() => {
        if (userInput.weight && userInput.height) {
            calculateBmi();
        }
    }, [userInput.weight, userInput.height]);

    return (
        <section id="prediction" className="flex flex-col gap-8 justify-center items-center min-h-screen mt-0 bg-gray-100">
            <h2 className="text-5xl font-semibold text-center mb-10">Predictions</h2>
            <form onSubmit={handleSubmitForm} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-4">
                        <InputField type="number" placeholder="Age" onChange={handleUserInput} name="age" value={userInput.age} />
                        <select onChange={(e) => setGender(e.target.value)} value={gender} className="p-3 border rounded-lg focus:ring-2 focus:outline-none">
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <InputField type="number" placeholder="Enter your height in cm" name="height" value={userInput.height} onChange={handleUserInput} />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <InputField type="number" placeholder="Weight in kg" name="weight" value={userInput.weight} onChange={handleUserInput} />
                        <InputField type="text" placeholder="Body Mass Index (BMI)" name="bmi" value={userInput.bmi} readOnly />
                        <InputField type="number" placeholder="Physical Activity Level (max value 4)" name="activityLevel" value={userInput.activityLevel} onChange={handleUserInput} max="4" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                <div className="mt-6 flex justify-center">
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition">
                        Submit
                    </button>
                </div>
                {prediction && (
                    <p className="mt-6 font-bold text-lg text-center">Your Obesity category is: {prediction}</p>
                )}
            </form>
    
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-8">
                <div className="flex flex-col items-center mr-5">
                    <img src={lossCurve} className="w-[32rem]" alt="Loss Curve" />
                    <p className="text-center mt-2 font-semibold">Loss Curve</p>
                </div>
                <div className="flex flex-col items-center ml-5">
                    <img src={regplot} className="w-[32rem]" alt="Regression Plot" />
                    <p className="text-center mt-2 font-semibold">Regression Plot</p>
                </div>
            </div>
        </section>
    );
    
}
