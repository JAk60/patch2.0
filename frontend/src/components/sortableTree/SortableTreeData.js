import { v4 as uuid } from "uuid";
const id_ = uuid();
const xData = [
  { name: "Chicken", parent: null, id: id_, newT: "random", eqType: "DA" },
  { name: "Fish", parent: id_, id: uuid(), newT: "random1", eqType: "TY" },
];

export default xData;
