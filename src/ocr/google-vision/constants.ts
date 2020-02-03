const Constants: any = {};
Constants.BASE_URL = "https://vision.googleapis.com/v1/images:annotate";
Constants.KEY_CONNECTOR = "?key=";
Constants.REQUEST_PAYLOAD = {
  requests: [
    {
      image: {
        content: ""
      },
      features: [
        {
          type: "TEXT_DETECTION"
        }
      ],
      imageContext: {
        languageHints: ["en"]
      }
    }
  ]
};

export default Constants;
