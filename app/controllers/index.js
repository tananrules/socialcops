import Ember from 'ember';

function csvJSON(csv){
  let lines = csv.split("\n");
  let result = [];
  let headers = lines[0].split(",");
  for(let i = 1; i < lines.length - 1; i++){
    let obj = {};
    let currentline = lines[i].split(",");
    for(let j = 0; j < headers.length; j++){
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  return JSON.stringify(result);
}

function getTotalRuns(store) {
  let total = 0;
  store.peekAll('sachin').forEach((singleRecord) => {
    if(isNaN(parseInt(singleRecord.get('batting_score'))) !== true) {
      total = total + parseInt(singleRecord.get('batting_score'));
    }
  });
  return total;
}

function getYearWiseRuns(store) {
  let label = [];
  let data = [];
  store.peekAll('sachin').forEach((singleRecord) => {
    let year = new Date(singleRecord.get('date')).getFullYear().toString();
    if(label.contains(year)) {
      if (isNaN(parseInt(singleRecord.get('batting_score'))) !== true) {
        data[label.indexOf(year)] = data[label.indexOf(year)] + parseInt(singleRecord.get('batting_score'));
      }
    } else {
      label.push(year);
      data.push(parseInt(singleRecord.get('batting_score')));
    }
  });
  return {
    labels: label,
    datasets: [
      {
        label: "My First dataset",
        data: data 
      }
    ]
  };
}

function getResult(store, resultFor) {
  let winsCount = 0;
  let lostCount = 0;
  let tieCount = 0;
  store.peekAll('sachin').forEach((singleRecord) => {
    if(singleRecord.get(resultFor) === 'won') {
      winsCount = ++winsCount;
    } else if(singleRecord.get(resultFor) === 'lost') {
      lostCount = ++lostCount;
    } else {
      tieCount = ++tieCount;
    }
  });
  return [
    {
      label: 'Won',
      value: winsCount
    },
    {
      label: 'Lost',
      value: lostCount
    },
    {
      label: 'Tie',
      value: tieCount
    }
  ];
}

function getCountryWiseRuns(store) {
  let countries = Ember.A();
  store.peekAll('sachin').forEach((singleRecord) => {
    if(isNaN(parseInt(singleRecord.get('batting_score'))) !== true) {
      if(countries.findBy('label', singleRecord.get('opposition'))) {
        let country = countries.findBy('label', singleRecord.get('opposition'));
        country.set('value', parseInt(country.value) + parseInt(singleRecord.get('batting_score')));
      } else {
        countries.push(Ember.Object.create({
          label: singleRecord.get('opposition'),
          value: parseInt(singleRecord.get('batting_score'))
        }));
      }
    }
  });
  return countries;
}

export default Ember.Controller.extend({
  fileUploaded: false,

  actions: {
    uploadCSV(file, fileName) {
      if (fileName.split('.')[fileName.split('.').length - 1] === 'csv') {

        let result = csvJSON(file);
        this.set('dataArray', JSON.parse(result));
        let data = this.get('dataArray');
        data.forEach((singleRecord, index) => {
          singleRecord.id = index+1;
          this.store.createRecord('sachin', singleRecord);
        });
        this.toggleProperty('fileUploaded');
      } else {
        alert(`${fileName.split('.')[fileName.split('.').length - 1]} format not supported`);
      }
    },

    showData() {
      let totalRuns = getTotalRuns(this.store);
      this.set('totalRuns', totalRuns);

      let countryWiseRuns = getCountryWiseRuns(this.store);
      this.set('countries', countryWiseRuns);
      
      let matchResult = getResult(this.store, 'match_result');
      this.set('matchResult', matchResult); 

      let tossResult = getResult(this.store, 'toss');
      this.set('tossResult', tossResult);
    
      let yearWiseRuns = getYearWiseRuns(this.store);
      this.set('yearWiseRuns', yearWiseRuns);
    }
  }
});
