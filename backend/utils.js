import { pull } from "./fetch.js";
import moment from "moment";

const convertValue = (dataItem, value) => {
  const di = global.programMetadata.dataItems[dataItem];
  if (di.valueSet) {
    return di.valueSet[value];
  }
  switch (di.valueType) {
    case "DATE":
      return value ? moment(value).format("YYYY-MM-DD") : "";
    default:
      return value;
  }
};

const findAttribute = (attributes, attribute) => {
  const found = attributes.find((attr) => {
    return attr.attribute === attribute;
  });
  return found ? convertValue(attribute, found.value) : "";
};

const findDataElement = (dataValues, dataElement) => {
  const found = dataValues.find((dv) => {
    return dv.dataElement === dataElement;
  });
  return found ? convertValue(dataElement, found.value) : "";
};

const init = async () => {
  const program = await pull(
    `/api/programs/yDuAzyqYABS.json?fields=programTrackedEntityAttributes[trackedEntityAttribute[id,name,valueType,optionSet[id,options[id,name,code]]]],programStages[id,name,programStageDataElements[dataElement[id,name,valueType,optionSet[options[id,name,code]]]`
  );
  const programMetadata = {
    dataItems: {
      eventDate: {
        valueType: "DATE",
        valueSet: null
      },
      dueDate: {
        valueType: "DATE",
        valueSet: null
      },
      status: {
        valueType: "TEXT",
        valueSet: null
      },
      orgUnitName: {
        valueType: "TEXT",
        valueSet: null
      }
    }
  };
  program.programTrackedEntityAttributes.forEach((ptea) => {
    const tea = ptea.trackedEntityAttribute;
    programMetadata.dataItems[tea.id] = {
      valueType: tea.valueType,
      valueSet: tea.optionSet
        ? tea.optionSet.options.reduce((prev, current) => {
            prev[current.code] = current.name;
            return prev;
          }, {})
        : null
    };
  });
  program.programStages.forEach((ps) => {
    ps.programStageDataElements.forEach((psde) => {
      const dataElement = psde.dataElement;
      programMetadata.dataItems[dataElement.id] = {
        valueType: dataElement.valueType,
        valueSet: dataElement.optionSet
          ? dataElement.optionSet.options.reduce((prev, current) => {
              prev[current.code] = current.name;
              return prev;
            }, {})
          : null
      };
    });
  });

  const rootOu = await pull(`/api/organisationUnits?level=1`);
  global.rootOu = rootOu.organisationUnits[0].id;
  global.programMetadata = programMetadata;
};

export { init, findAttribute, findDataElement };
