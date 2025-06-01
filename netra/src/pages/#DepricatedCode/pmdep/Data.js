export const  getQuestions = (value) => {
  let questions = [];

  switch (value) {
    case "option1":
      questions = [
        {
          id: "beta",
          text: "beta value",
          type: "text",
          required: true,
        },
        {
          id: "eeta",
          text: "eeta value",
          type: "text",
          required: true,
        },
        {
          id: "cf",
          text: "Enter cost of unplanned failure",
          type: "text",
          required: true,
        },
        {
          id: "cp",
          text: "Enter cost of preventive replacement",
          type: "text",
          required: true,
        },
      ];
      break;
    case "option2":
      questions = [
        {
          id: "beta",
          text: "beta value",
          type: "text",
          required: true,
        },
        {
          id: "eeta",
          text: "eeta value",
          type: "text",
          required: true,
        },
        {
          id: "df",
          text: "Enter df value",
          type: "text",
          required: true,
        },
        {
          id: "dp",
          text: "Enter dp value",
          type: "text",
          required: true,
        },
      ];
      break;
    case "option3":
      questions = [
        {
          id: "n",
          text: "Enter no of components in group",
          type: "text",
          required: true,
        },
        {
          id: "pmdt",
          text: "Enter preventive downtime for group",
          type: "text",
          required: true,
        },
        {
          id: "cpm",
          text: "Enter cost per unit preventive maintenance downtime for group",
          type: "text",
          required: true,
        },
        {
          id: "cf",
          text: "Enter cost per unit failure downtime",
          type: "text",
          required: true,
        },
      ];
      break;
    case "option4":
      questions = [
        {
          id: "n",
          text: "Enter no of components in group",
          type: "text",
          required: true,
        },
        {
          id: "pmdt",
          text: "Enter preventive downtime for group",
          type: "text",
          required: true,
        },
      ];
      break;
    case "option5":
      questions = [
        {
          id: "beta",
          text: "beta value",
          type: "text",
          required: true,
        },
        {
          id: "eeta",
          text: "eeta value",
          type: "text",
          required: true,
        },
        {
          id: "cf",
          text: "Enter cost of unplanned failure",
          type: "text",
          required: true,
        },
        {
          id: "cp",
          text: "Enter cost of preventive replacement",
          type: "text",
          required: true,
        },
      ];
      break;
    case "option6":
      questions = [
        {
          id: "beta",
          text: "beta value",
          type: "text",
          required: true,
        },
        {
          id: "eeta",
          text: "eeta value",
          type: "text",
          required: true,
        },
        // {
        //   id: "p",
        //   text: "Enter p value",
        //   type: "text",
        //   required: true,
        // },
      ];
      break;
    case "option7":
      questions = [
        {
          id: "beta",
          text: "beta value",
          type: "text",
          required: true,
        },
        {
          id: "eeta",
          text: "eeta value",
          type: "text",
          required: true,
        },
        {
          id: "df",
          text: "Enter downtime of unplanned failure",
          type: "text",
          required: true,
        },
        {
          id: "dp",
          text: "Enter downtime of preventive replacement",
          type: "text",
          required: true,
        },
      ];
      break;
    default:
      questions = [
        {
          id: "beta",
          text: "beta value",
          type: "text",
          required: true,
        },
        {
          id: "eeta",
          text: "eeta value",
          type: "text",
          required: true,
        },
        // {
        //   id: "p",
        //   text: "Enter p value",
        //   type: "text",
        //   required: true,
        // },
      ];
      break;
  }

  return questions;
};
