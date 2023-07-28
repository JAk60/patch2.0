export const saveSensor=(data,setSnackBarMessage)=>{
    console.log(data);
    fetch("/save_condition_monitoring", {
        method: "POST",
        body: JSON.stringify({
          flatData: data,
          dtype: 'insertSensor',
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setSnackBarMessage({
            severity: "success",
            message: data.message,
            showSnackBar: true,
          });
        })
        .catch((error) => {
          setSnackBarMessage({
            severity: "error",
            message: "Some Error Occured. " + error,
            showSnackBar: true,
          })
        })
}