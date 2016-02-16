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
    if (isNaN(parseInt(singleRecord.get('batting_score'))) !== true) {
      total = total + parseInt(singleRecord.get('batting_score'));
    }
  });
  return total;
}

function getCountryWiseRuns(store) {
  let countries = Ember.A();
  store.peekAll('sachin').forEach((singleRecord) => {
    if (isNaN(parseInt(singleRecord.get('batting_score'))) !== true) {
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
    uploadCSV(file) {
      this.toggleProperty('fileUploaded');

      let result = csvJSON(file);
      this.set('dataArray', JSON.parse(result));
      let data = this.get('dataArray');
      data.forEach((singleRecord, index) => {
        singleRecord.id = index+1;
        this.store.createRecord('sachin', singleRecord);
      });
    },

    showData() {
      let totalRuns = getTotalRuns(this.store);
      this.set('totalRuns', totalRuns);

      let countryWiseRuns = getCountryWiseRuns(this.store);
      this.set('countries', countryWiseRuns);
    },

    

    
  }
});
