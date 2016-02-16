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
    total = total + parseInt(singleRecord.get('batting_score'));
  });
  return total;
}

export default Ember.Controller.extend({
  fileUploaded: false,

  actions: {
    uploadCSV(file) {
      this.toggleProperty('fileUploaded');

      let result = csvJSON(file);
      this.set('dataArray', JSON.parse(result));
      let data = this.get('dataArray');
      data.forEach((singleData, index) => {
        singleData.id = index+1;
        if (isNaN(parseInt(singleData.batting_score))) {
          singleData.batting_score = '0';
        }
        this.store.createRecord('sachin', singleData);
      });

      let totalRuns = getTotalRuns(this.store);
      this.set('totalRuns', totalRuns);
    },

    

    getCountryViseRuns() {
      let countries = Ember.A();
      this.store.peekAll('sachin').forEach((singleRecord) => {
        if(countries.findBy('label', singleRecord.get('opposition'))) {
          let country = countries.findBy('label', singleRecord.get('opposition'));
          country.set('value', parseInt(country.value) + parseInt(singleRecord.get('batting_score')));
        } else {
          countries.push(Ember.Object.create({
            label: singleRecord.get('opposition'),
            value: parseInt(singleRecord.get('batting_score'))
          }));
        }
      });
      this.set('countries', countries);
    }
  }
});
