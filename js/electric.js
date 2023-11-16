const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDjfqKtzcnRMExnGSP_8j-wzaOkhAL55_Q",
  authDomain: "esp32-mx2.firebaseapp.com",
  databaseURL: "https://esp32-mx2-default-rtdb.firebaseio.com",
  projectId: "esp32-mx2",
  storageBucket: "esp32-mx2.appspot.com",
  messagingSenderId: "273854976046",
  appId: "1:273854976046:web:0914d0125eed13563ecfbf",
  measurementId: "G-LBX7H74CQL"
}

const SECOND_TO_DRAW = 5 // tính là giây
const MAX_COLUMN_SHOW = 20 // số cột thời gian hiển thị

// ------------------------------------------------------------
var dataLocalI = []

firebase.initializeApp(FIREBASE_CONFIG);

var chartIa = null
var chartIb = null
var chartIc = null

const initChart = () => {
  const ctxIa = document.getElementById('Ia');
  const ctxIb = document.getElementById('Ib');
  const ctxIc = document.getElementById('Ic');

  let dataIa = {
    labels: [],
    datasets: [{
      label: 'Ia',
      data: [],
      fill: false,
      borderColor: '#FF0000',
      tension: 0.1
    }]
  };
  chartIa = new Chart(ctxIa, {
    type: 'line', 
    data: dataIa,
  });

  let dataIb = {
    labels: [],
    datasets: [{
      label: 'Ib',
      data: [],
      fill: false,
      borderColor: '#000000',
      tension: 0.1
    }]
  };
  chartIb = new Chart(ctxIb, {
    type: 'line', 
    data: dataIb,
  });

  let dataIc = {
    labels: [],
    datasets: [{
      label: 'Ic',
      data: [],
      fill: false,
      borderColor: '#800000',
      tension: 0.1
    }]
  };
  chartIc = new Chart(ctxIc, {
    type: 'line', 
    data: dataIc,
  });
}

initChart()

const updateChart = (dataRealtime) => {
  if (chartIa === null || chartIb === null || chartIc === null) initChart()

  const resultChainIa = []
  const resultChainIb = []
  const resultChainIc = []

  dataRealtime.forEach(item => {
    const date = new Date(item.time)
    resultChainIa.push({
      value: item.Ia,
      date: `0${date.getHours()}`.slice(-2) + ':' + `0${date.getMinutes()}`.slice(-2) + ":" + `0${date.getSeconds()}`.slice(-2)
    })

    resultChainIb.push({
      value: item.Ib,
      date: `0${date.getHours()}`.slice(-2) + ':' + `0${date.getMinutes()}`.slice(-2) + ":" + `0${date.getSeconds()}`.slice(-2)
    })

    resultChainIc.push({
      value: item.Ic,
      date: `0${date.getHours()}`.slice(-2) + ':' + `0${date.getMinutes()}`.slice(-2) + ":" + `0${date.getSeconds()}`.slice(-2)
    })
  });

  let labelsIa = []
  let datasIa = []
  resultChainIa.forEach(item => {
    labelsIa.push(item.date)
    datasIa.push(item.value)
  });
  var chart_data_ia = chartIa.config.data
  chart_data_ia.datasets[0].data = datasIa
  chart_data_ia.labels = labelsIa
  chartIa.update()

  let labelsIb = []
  let datasIb = []
  resultChainIb.forEach(item => {
    labelsIb.push(item.date)
    datasIb.push(item.value)
  });
  var chart_data_ib = chartIb.config.data
  chart_data_ib.datasets[0].data = datasIb
  chart_data_ib.labels = labelsIb
  chartIb.update()

  let labelsIc = []
  let datasIc = []
  resultChainIc.forEach(item => {
    labelsIc.push(item.date)
    datasIc.push(item.value)
  });
  var chart_data_ic = chartIc.config.data
  chart_data_ic.datasets[0].data = datasIc
  chart_data_ic.labels = labelsIc
  chartIc.update()
}

var ref = firebase.database().ref('/');
var firestore = firebase.firestore()
var renderCount = 0

const getRowsData = async (number) => {
  const response = await new Promise((resolve, reject) => {
    firestore.collection("data")
      .orderBy("time", "desc")
      .limit(number)
      .get()
      .then((querySnapshot) => {
        const data = []
        querySnapshot.forEach((doc) => {
          data.push(doc.data())
          console.log(doc.id, " => ", doc.data())
        });
        resolve(data)
      });
  })

  return response.reverse()
}

const updateToFireStore = (data) => { 
    
  // try {
  //   firestore.collection("data").add({
  //     ...data,
  //     time: new Date().getTime()
  //   })
  //   .then((docRef) => {
  //       console.log("Document written with ID: ", docRef.id);
  //   })
  //   .catch((error) => {
  //       console.error("Error adding document: ", error);
  //   });
  // } catch (error) {
  //   console.log(error)
  // } 
}

const insertDataToLocal = (data) => {
  try {
    if (dataLocalI.length < MAX_COLUMN_SHOW)
      dataLocalI.push({
        ...data,
        time: new Date().getTime()
      })
    else {
      for (let i = 0; i < dataLocalI.length - 1; i++) {
        dataLocalI[i] = dataLocalI[i + 1]
      }
      dataLocalI[MAX_COLUMN_SHOW - 1] = {
        ...data,
        time: new Date().getTime()
      }
    }
  } catch (error) {
    console.log("error: ", error)
  }
}

const response = await getRowsData(MAX_COLUMN_SHOW)
dataLocalI = response
console.log("dataLocalI: ", dataLocalI)

updateChart(dataLocalI)

ref.on('value', async(snapshot) => {
  renderCount++
  if (renderCount <= 1) return
  const data = snapshot.val();
  console.log("data", data)
  const currentData = await getRowsData(1)
  console.log("currentData", currentData)
  if (currentData && currentData.length > 0) {
    const miliseconds = currentData[0].time
    let date = new Date(miliseconds).setSeconds(new Date(miliseconds).getSeconds() + SECOND_TO_DRAW)
    date = new Date(date)
    if (date.getTime() <= new Date().getTime()) {
      insertDataToLocal(data)
      updateChart(dataLocalI)
      updateToFireStore(data)
    }
  } else {
    insertDataToLocal(data)
    updateChart(dataLocalI)
    updateToFireStore(data)
  }
  
});


// firestore.collection("data")
// .onSnapshot(async (snapshot) => {
//     const response = await getRowsData(MAX_COLUMN_SHOW)
//     updateChart(response)
// }, (error) => {
//   console.log(error)
// });