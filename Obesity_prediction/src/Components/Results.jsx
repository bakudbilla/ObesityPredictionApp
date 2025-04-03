/* eslint-disable react/prop-types */


export default function Results({ metrics }) {
    return (
      <section className="mt-10">
        <h2 className="text-center text-2xl md:text-3xl mb-10 mt-4 font-bold text-[#00abf0]">
          Model Performance Metrics
        </h2>
  
        <div className="flex gap-6 justify-center flex-wrap px-8">
          {["Loss", "Accuracy", "Precision", "Recall", "F1 Scores"].map((metric, index) => (
            <div
              key={index}
              className="w-[12rem] h-[10rem] p-4 rounded-md shadow-lg border flex flex-col items-center justify-center bg-white"
            >
              <p className="text-xl font-semibold">{metric}:</p>
              <p className="text-lg text-[#00abf0] font-bold mt-2">
                {metrics ? metrics[metric] : "..."}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  