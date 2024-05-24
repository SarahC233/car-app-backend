require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  PredictionAPIClient,
} = require("@azure/cognitiveservices-customvision-prediction");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

//New CORS configuration
const allowedOrigins = ["https://your-frontend-url", "http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const predictionKey = process.env.VISION_PREDICTION_KEY;
const predictionEndpoint = process.env.VISION_PREDICTION_ENDPOINT;
const projectId = process.env.PROJECT_ID;
const publishIterationName = process.env.PUBLISH_ITERATION_NAME;

const upload = multer({ dest: "uploads/" });

const predictorCredentials = new ApiKeyCredentials({
  inHeader: { "Prediction-key": predictionKey },
});

const predictor = new PredictionAPIClient(
  predictorCredentials,
  predictionEndpoint
);

//Health check endpoint
app.get("/health", (req, res) => {
  res.send("Server is running");
});

//Prediction endpoint
app.post("/predict", upload.single("image"), async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  const imageFilePath = req.file.path;
  console.log(req.file);

  try {
    const results = await predictor.classifyImage(
      projectId,
      publishIterationName,
      fs.readFileSync(imageFilePath)
    );
    fs.unlinkSync(imageFilePath);

    const predictions = results.predictions
      .filter((prediction) => prediction.probability > 0.5)
      .map((prediction) => ({
        tagName: prediction.tagName,
        probability: prediction.probability,
      }));

    const highestPrediction = predictions.reduce((prev, current) => {
      return prev.probability > current.probability ? prev : current;
    }, {});

    if (!highestPrediction.tagName) {
      throw new Error("No predictions with sufficient probability found.");
    }

    const vehicleType = highestPrediction.tagName;
    const confidence = highestPrediction.probability;

    const premiums = {
      utility: "The annual premium for this type of vehicle is $1000.",
      SUV: "The annual premium for this type of vehicle is $1200.",
      sedan: "The annual premium for this type of vehicle is $800.",
      hatchback: "The annual premium for this type of vehicle is $600.",
    };

    const premiumEstimate =
      premiums[vehicleType] || "Premium not available for this vehicle type.";

    res.status(200).send({ vehicleType, confidence, premiumEstimate });
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).send({ error: "Error predicting car type" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
