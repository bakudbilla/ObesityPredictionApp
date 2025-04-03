import { useState } from "react";
import Results from "./Results"; 


export default function ModelRetrain() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API URL
  const RETRAIN_API = "https://ml-pipeline-summative-03ve.onrender.com/retrain";

  // Retrain model
  const retrainModel = async () => {
    setLoading(true);
    setError(""); 

    try {
      const response = await fetch(RETRAIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Retraining failed!");

      const data = await response.json(); 
      setMetrics({
        Loss: data.final_val_loss.toFixed(4),
        Accuracy: (data.final_val_accuracy * 100).toFixed(2) + "%",
        Precision: (data.final_precision * 100).toFixed(2) + "%",
        Recall: (data.final_recall * 100).toFixed(2) + "%",
        "F1 Scores": (data.final_f1_score * 100).toFixed(2) + "%",
      });
    } catch (error) {
      console.error("Retraining Error:", error);
      setError("Model retraining failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-10 items-center justify-center flex-col">
      {/* Retrain Model Button */}
      <button
        onClick={retrainModel}
        className="bg-[#6c20df] text-white font-bold py-2 px-8 shadow-md rounded"
        disabled={loading}
      >
        {loading ? "Retraining..." : "Click to Retrain Model"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Show Metrics in One Place Only */}
      <Results metrics={metrics} />
    </div>
  );
}
