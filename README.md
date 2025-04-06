ObesiCheck App (https://obesity-app-latest.onrender.com/)

ObesiCHECK is a machine learning web application designed to help individuals monitor their weight levels and track their obesity category. 
The app classifies users into four categories: Normal weight, Overweight, Obese, and Underweight.

## How to set up project

1. Clone the repository:
   ```
   git https://github.com/bakudbilla/ObesityPredictionApp.git
   cd ObesityPredictionApp
   cd  Obesity_prediction
   ```
2. Install dependencies
   ```
   npm install
   ```
   
3. Run the project
   ```
   npm run dev
   ```

## To build and run the app in a Docker container:

Requirements; 
Download Docker to be able to run container

 1. Build the Docker image

```
docker build -t obesity-check .
```
2.Run the container
  ```
  docker run -p 3000:3000 obesity-check
  ```

The app will be available at http://localhost:3000


