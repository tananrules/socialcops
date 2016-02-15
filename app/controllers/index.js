import Ember from 'ember';

function csvJSON(csv){
  let lines=csv.split("\n");
  let result = [];
  let headers=lines[0].split(",");
  for(let i=1;i<lines.length;i++){
    let obj = {};
    let currentline=lines[i].split(",");
    for(let j=0;j<headers.length;j++){
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  return JSON.stringify(result);
}

export default Ember.Controller.extend({

  actions: {
    uploadCSV(file) {
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
    },

    getTotalRuns() {
      let total = 0;
      this.store.peekAll('sachin').forEach((singleRecord) => {
        total = total + parseInt(singleRecord.get('batting_score'));
      });
      this.set('totalRuns', total)
    },

    getCountryViseRuns() {
      let countries = Ember.A();
      this.store.peekAll('sachin').forEach((singleRecord) => {
        if(countries.findBy('name', singleRecord.get('opposition'))) {
          let country = countries.findBy('name', singleRecord.get('opposition'));
          country.set('runs', parseInt(country.runs) + parseInt(singleRecord.get('batting_score')));
        } else {
          countries.push(Ember.Object.create({
            name: singleRecord.get('opposition'),
            runs: parseInt(singleRecord.get('batting_score'))
          }));
        }
      });
      this.set('countries', countries);
    }
  }
});
