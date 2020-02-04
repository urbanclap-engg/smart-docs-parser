import requestPromise from "request-promise";
import _ from "lodash";
import BluebirdPromise from "bluebird";
import {
  ExtractDocumentTypeRequest,
  ExtractDocumentTypeResponse
} from "../../interfaces/OCR";
import Constants from "./constants";
// Request-promise is not for image format as per the documentation
import requestModule from "request";
const request = BluebirdPromise.promisifyAll(requestModule);

const GoogleVision: any = {};

const getBase64StringFromURL = async (documentUrl: string) => {
  const base64Image = await request.getAsync({
    url: documentUrl,
    encoding: null
  });
  return Buffer.from(_.get(base64Image, "body", "")).toString("base64");
};

const getApiUrl = apiKey => {
  const baseURL = Constants.BASE_URL;
  return _.join([baseURL, apiKey], Constants.KEY_CONNECTOR);
};

GoogleVision.extractDocumentText = async (
  params: ExtractDocumentTypeRequest
): Promise<ExtractDocumentTypeResponse> => {
  const { document_url: documentUrl, api_key: apiKey } = params;
  const base64String = await getBase64StringFromURL(documentUrl);
  if (_.isEmpty(base64String)) {
    return Constants.EMPTY_RESPONSE;
  }

  const payload = Constants.REQUEST_PAYLOAD;
  payload["requests"][0]["image"]["content"] = base64String;
  const apiURL = getApiUrl(apiKey);
  const visionResponse = await requestPromise({
    method: "POST",
    url: apiURL,
    body: payload,
    json: true
  });

  const annotations = _.get(visionResponse, "responses", []);
  const fullTextAnnotation = _.find(annotations, annotation => {
    const textAnnotation = _.get(annotation, "fullTextAnnotation", {});
    return !_.isEmpty(textAnnotation);
  });
  if (_.isEmpty(fullTextAnnotation)) {
    return Constants.EMPTY_RESPONSE;
  }

  const text = _.get(fullTextAnnotation, "fullTextAnnotation.text", "");
  return {
    raw_text: _.split(text, "\n")
  };
};

export default GoogleVision;
