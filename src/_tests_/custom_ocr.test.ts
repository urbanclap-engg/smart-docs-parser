import SmartDocuments from "../index";
import customOCR from "./custom_ocr.mock";

test("Custom OCR", async () => {
  const extractedDetails = await SmartDocuments.extractDocumentDetailsFromImage(
    {
      document_url:
        "https://avatars2.githubusercontent.com/u/20634933?s=40&v=4",
      document_type: "PAN_CARD",
      ocr_library: "custom-library",
      custom_ocr: customOCR
    }
  );
  expect(extractedDetails).toStrictEqual({
    raw_text: ["https://avatars2.githubusercontent.com/u/20634933?s=40&v=4"],
    is_document_valid: false,
    document_details: {}
  });
});
