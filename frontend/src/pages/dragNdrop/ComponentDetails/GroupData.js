import { useSelector } from "react-redux";
import _ from "lodash";
const GroupData = () => {
  const allElements = useSelector((state) => state.elements.elements);
  const group = _.groupBy(
    allElements.filter((x) => x.dtype === "edge"),
    (x) => x.source
  );
  const groupKeys = Object.keys(group);
  const groupName = groupKeys.map((item, index) => {
    const gName = allElements.filter((x) => x.id === item)[0].data.label;
    const gOption = group[item].map((ele, eIndex) => {
      const filteredEle = allElements.filter((x) => x.id === ele.target)[0];
      return { value: filteredEle.id, label : filteredEle.data.label };
    });
    return {
      label: `Parent Nsme - ${gName}`,
      options: gOption,
    };
  });
  return groupName;
};
export default GroupData;
