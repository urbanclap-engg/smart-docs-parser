import requestPromise from "request-promise";
import _ from "lodash";
import * as moment from "moment";
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

// ******************************************************* //
// Logic for internal functions starts here                  //
// ******************************************************* //
const getBase64StringFromURL = async (
  documentUrl: string,
  ocrTimeout: number
) => {
  const base64Image = await request.getAsync({
    url: documentUrl,
    encoding: null,
    timeout: ocrTimeout
  });
  return Buffer.from(_.get(base64Image, "body", "")).toString("base64");
};

const getApiUrl = apiKey => {
  const baseURL = Constants.BASE_URL;
  return _.join([baseURL, apiKey], Constants.KEY_CONNECTOR);
};
// ******************************************************* //
// Logic for internal functions ends here                  //
// ******************************************************* //

// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
GoogleVision.extractDocumentText = async (
  params: ExtractDocumentTypeRequest
): Promise<ExtractDocumentTypeResponse> => {
  const {
    document_url: documentUrl,
    api_key: apiKey,
    timeout: ocrTimeout = Constants.OCR_TIMEOUT
  } = params;
  try {
    if (_.isEmpty(apiKey)) {
      return Constants.EMPTY_RESPONSE;
    }
    const base64FetchStartTime = moment.utc();
    const base64String = await getBase64StringFromURL(documentUrl, ocrTimeout);
    if (_.isEmpty(base64String)) {
      return Constants.EMPTY_RESPONSE;
    }
    const base64FetchEndTime = moment.utc();
    const base64FetchTime = moment
      .utc(base64FetchEndTime)
      .diff(base64FetchStartTime);
    const remainingOcrTime = _.max([0, ocrTimeout - base64FetchTime]);
    if (!remainingOcrTime) {
      return Constants.EMPTY_RESPONSE;
    }

    const payload = Constants.REQUEST_PAYLOAD;
    payload["requests"][0]["image"]["content"] = base64String;
    const apiURL = getApiUrl(apiKey);
    const visionResponse = await requestPromise({
      method: "POST",
      url: apiURL,
      body: payload,
      json: true,
      timeout: remainingOcrTime
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
  } catch (err) {
    throw new Error(JSON.stringify(err).substr(0, 200));
  }
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

export default GoogleVision;
