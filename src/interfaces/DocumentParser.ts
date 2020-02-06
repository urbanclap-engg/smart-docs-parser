interface DocumentDetails {
  document_type?: string;
  identification_number?: string;
  name?: string;
  fathers_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
}

export interface ParseDocumentDetailsRequest {
  raw_text: Array<string>;
}

export interface ParseDocumentDetailsResponse {
  is_document_valid: boolean;
  document_details: DocumentDetails | object;
}

export interface CustomParser {
  parseDocumentDetails(
    params: ParseDocumentDetailsRequest
  ): ParseDocumentDetailsResponse;
}
