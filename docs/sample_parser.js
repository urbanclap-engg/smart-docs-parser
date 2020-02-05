// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
const parseDocumentDetails = ({ raw_text: rawText }) => {
  return {
    is_document_valid: true,
    document_details: {
    	name: 'sample_name'
    }
  };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

module.exports = { parseDocumentDetails };
