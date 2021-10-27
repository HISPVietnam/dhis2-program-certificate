import { pull, svsPull, svsPost } from "./fetch.js";
import { findAttribute, findDataElement } from "./utils.js";
import moment from "moment";

const convert = async (tei) => {
  const data = {
    firstName: findAttribute(tei.attributes, "sB1IHYu2xQT"),
    lastName: findAttribute(tei.attributes, "ENRjVGxVL6l"),
    dob: findAttribute(tei.attributes, "NI0QRzJvQ0k"),
    sex: findAttribute(tei.attributes, "oindugucx72"),
    systemId: findAttribute(tei.attributes, "KSr2yTdu1AI"),
    vaccinations: tei.enrollments[0].events
      .filter((event) => event.programStage === "a1jCssI2LkW")
      .map((event) => {
        return {
          vaccinationDate: moment(event.eventDate).format("YYYY-MM-DD"),
          doseNumber: findDataElement(event.dataValues, "LUIsbsm3okG"),
          vaccineName: findDataElement(event.dataValues, "bbnyNYD1wgS"),
          vaccineManufacturer: findDataElement(event.dataValues, "rpkH9ZPGJcX"),
          vaccinationSite: event.orgUnitName,
          batchNumber: findDataElement(event.dataValues, "Yp1F4txx8tm")
        };
      }),
    qr: null
  };
  const response = await svsPull(`/api/dhis2/${tei.trackedEntityInstance}`);
  const buffer = await response.buffer();
  data.qr = `data:image/png;base64,` + buffer.toString("base64");
  return data;
};

const certificate = async (req, res, next) => {
  const { systemId, phoneNo } = req.query;
  if (!systemId || !phoneNo) res.sendStatus(403);
  const result = await pull(
    `/api/trackedEntityInstances?program=yDuAzyqYABS&ou=jjKIShO8MjG&ouMode=DESCENDANTS&filter=KSr2yTdu1AI:EQ:${systemId}&filter=fctSQp5nAYl:EQ:${phoneNo}&fields=*`
  );
  if (result.trackedEntityInstances.length === 0) {
    res.sendStatus(404);
  } else {
    const converted = await convert(result.trackedEntityInstances[0]);
    if (converted.vaccinations.length < 2) {
      res.sendStatus(404);
    } else {
      res.send(converted);
    }
  }
};

const verify = async (req, res, next) => {
  const response = await svsPost("/verify", req.body);
  const json = await response.json();
  res.send(json);
};
export { certificate, verify };
