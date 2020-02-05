// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
const extractDocumentText = ({ document_url: documentURL, api_key: apiKey }) => {
  return {
    	raw_text: [documentURL, apiKey]
    }
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

module.exports = { extractDocumentText };
