interface DocumentDetails {
  document_type?: string;
  identification_number?: string;
  name?: string;
  fathers_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
}

export interface ExtractDocumentDetailsFromImageRequest {
  document_url: string;
  document_type: string;
  ocr_library: {
    ocr_type: "google-vision";
    api_key: string;
  };
}

export interface ExtractDocumentDetailsFromImageResponse {
  raw_text: Array<string>;
  is_document_valid: boolean;
  document_details: DocumentDetails;
}
