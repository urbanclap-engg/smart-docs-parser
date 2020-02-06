// Mock for test
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
const extractDocumentText = ({ document_url: documentURL }) => {
  return {
    raw_text: [documentURL]
  };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //
export default { extractDocumentText };
