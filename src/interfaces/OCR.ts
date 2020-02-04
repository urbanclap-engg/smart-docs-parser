export interface ExtractDocumentTypeRequest {
  document_url: string;
  api_key: string;
}

export interface ExtractDocumentTypeResponse {
  raw_text: Array<string>;
}
