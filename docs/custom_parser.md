> **NOTE** This guide is intended for engineers extending `smart-docs-parser` for their custom use-case. If you think this could be benificial to the community then please contribute to `smart-docs-parser` source-code using the generic guide [here](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/document_parser.md).

# Configuration changes
### sdpconfig.json
```Javascript
"custom_parsers": [{
  "document_type": "your_custom_document_type" // Add your custom document type here. (Example: "VOTER_CARD")
  "parser_path": "/path/to/parser_file.js" // Add your customer parse file path here. 
}]
```

# Parser Implementation
## /path/to/parser_file.js
### Module
Your parser should expose a function called `parseDocumentDetails`
``` 
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
YourParser.parseDocumentDetails = ({ raw_text: rawText }) => {
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

exports.default = YourParser;
```
### Request
Your parser function should accept `{ raw_text: Array<string>}` as input.

### Response
Your parser function should return `{ is_document_valid: boolean, document_details: object }` as output.
