import Ember from 'ember';
 
 export default Ember.TextField.extend({
  type: 'file',
  
  change: function(e) {
    let self = this;

    let inputFiles = e.target.files;
    if (inputFiles.length < 1) {
      return;
    }
 
    let inputFile = inputFiles[0];
 
    let fileReader = new FileReader();
 
    fileReader.onload = function(e) {
      let uploadedFile = e.srcElement.result;
      self.sendAction('fileChanged', uploadedFile);
    };
 
    let firstFile = e.target.files[0];
    fileReader.readAsText(firstFile);
  },
});