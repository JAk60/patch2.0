import { TextField } from "@material-ui/core";
import React from "react";
import ReactDom from "react-dom";

export const getDatePicker = () => {
  debugger;
  const fillZeros = (a) => {
    return Number(a) < 10 ? "0" + a : a;
  };
  const getFormattedDateOutput = (dateString) => {
    const dateParse = new Date(dateString);
    const dd = dateParse.getDate();
    const mm = dateParse.getMonth() + 1; //January is 0!
    const yyyy = dateParse.getFullYear();
    // console.log(dateString, dateParse);
    return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
  };
  function Datepicker() {}
  Datepicker.prototype.init = function (params) {
    this.textInput = React.createRef();
    const getFormattedDateMaterial = (dateString) => {
      const dateParse = new Date(
        dateString.split("/")[2] +
          "-" +
          dateString.split("/")[1] +
          "-" +
          dateString.split("/")[0]
      );
      const dd = dateParse.getDate();
      const mm = dateParse.getMonth() + 1; //January is 0!
      const yyyy = dateParse.getFullYear();
      console.log(dateString, dateParse);
      return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
    };
    const eInput = React.createElement(TextField, {
      type: "date",
      defaultValue: getFormattedDateMaterial(params.value),
      ref: this.textInput,
      style: { width: "95%" },
    });
    this.div = document.createElement("div");
    this.div.className = "ag-cell-parent-append";
    ReactDom.render(eInput, this.div);
  };
  Datepicker.prototype.getGui = function () {
    return this.div;
  };
  Datepicker.prototype.afterGuiAttached = function () {
    this.textInput.current.focus();
  };
  Datepicker.prototype.getValue = function () {
    return getFormattedDateOutput(
      this.textInput.current.querySelector("input").value
    );
  };
  Datepicker.prototype.destroy = function () {};
  Datepicker.prototype.isPopup = function () {
    return false;
  };
  return Datepicker;
};
