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
    },

    getTotalRuns() {
      let data = this.get('dataArray');
      let total = 0;
      data.forEach((singleData) => {
        if (!isNaN(parseInt(singleData.batting_score))) {
          total = total+parseInt(singleData.batting_score);
        };
      });
      this.set('totalRuns', total)
    }
  }
});
