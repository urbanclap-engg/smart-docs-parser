# Folder Structure
```
/src
  /document-parser
    /index.ts
    /aadhaar-parser.ts
    /pan-parser.ts
    /your-parser-goes-here.ts
```
# Interface changes
## src/interfaces/SmartDocuments.ts
```Javascript
export interface ExtractDocumentDetailsFromImageRequest {
  document_url: string;
  document_type: "PAN_CARD"|"AADHAAR_CARD"; // Add new document type here
  ocr_library: {
    ocr_type: "google-vision";
    api_key: string;
  };
}
```
* *(Optionally)* If your parser exposes new document fields
## src/interfaces/SmartDocuments.ts
``` Javascript
interface DocumentDetails {
  document_type?: string;
  identification_number?: string;
  name?: string;
  fathers_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  // Add new fields here
}
```
## src/interfaces/DocumentParser.ts
```
interface DocumentDetails {
  document_type?: string;
  identification_number?: string;
  name?: string;
  fathers_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  // Add new fields here
}
```

# Configuration changes
## src/constants.ts
```Javascript
Constants.DOCUMENT_TYPES = {
  PAN_CARD: "PAN_CARD",
  AADHAAR_CARD: "AADHAAR_CARD"
  // // Add new document type here
};
```
# Implementation changes
## src/document-parser/index.ts
```Javascript
import YourParser from "./your-parser-goes-here";

// Make strategy for new document
DocumentParser[Constants.DOCUMENT_TYPES.NEW_DOCUMENT] = {
  parseDocumentDetails: YourParser.parseDocumentDetails
};

```
## src/document-parser/your-parser-goes-here.ts
- Your parser should expose a function called `parseDocumentDetails`. 
- For function contract check *src/interfaces/DocumentParser.ts*
- For reference please check the source code of other parsers.
- Read about the process from ([here](https://gist.github.com/SourabhJaz/9e505613520a4ef3920104e9edbe2e6c))
```Javascript
import {
  ParseDocumentDetailsRequest,
  ParseDocumentDetailsResponse
} from "../interfaces/DocumentParser";

// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
YourParser.parseDocumentDetails = (
  rawTextLines: ParseDocumentDetailsRequest
): ParseDocumentDetailsResponse => {
  ....
  ....
  ....
  return {
    is_document_valid: true,
    document_details: parsedDetails
  };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

export default YourParser;

```
