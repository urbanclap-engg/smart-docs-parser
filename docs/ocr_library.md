# Folder Structure
```
/src
  /ocr
    /index.ts
    /google-vision
    /your-library-goes-here
```
# Interface changes
## src/interfaces/SmartDocuments.ts
```Javascript
export interface ExtractDocumentDetailsFromImageRequest {
  document_url: string;
  document_type: "PAN_CARD"|"AADHAAR_CARD";
  ocr_library: {
    ocr_type: "google-vision";// Add new OCR library here
    api_key: string;
  };
}
```

# Configuration changes
## src/constants.ts
```Javascript
Constants.OCR_AGENTS = {
  GOOGLE_VISION: "google-vision"
  // Add new OCR library here
};
```
# Implementation changes
## src/ocr/google-vision/index.ts
```Javascript
import YourLibrary from "./your-library-goes-here";

// Make strategy for new document
OCR[Constants.OCR_AGENTS.YOUR_LIBRARY] = {
  extractDocumentText: YourLibrary.extractDocumentText
};
```
## src//ocr/your-library-goes-here/index.ts
- Your library should expose a function called `extractDocumentText`. 
- For function contract check *src/interfaces/OCR.ts*
- For reference please check the source code of google-vision integration.
```Javascript
import {
  ExtractDocumentTypeRequest,
  ExtractDocumentTypeResponse
} from "../../interfaces/OCR";

// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
YourLibrary.extractDocumentText = async (
  params: ExtractDocumentTypeRequest
): Promise<ExtractDocumentTypeResponse> => {
  ....
  ....
  ....
  return {
    raw_text: _.split(text, "\n")
  };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

export default YourLibrary;

```
