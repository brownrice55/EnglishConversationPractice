(function() {

  'use strict';

  let qaDataGlobal = new Map();
  let qaData = localStorage.getItem('qaData');

  if(qaData!=='undefined') {
    const qaDataJson = JSON.parse(qaData);
    qaDataGlobal = new Map(qaDataJson);
  }

  const DataManagement = function() {
    this.initialize.apply(this, arguments);
  };

  DataManagement.prototype.initialize = function() {
    this.qaData = qaDataGlobal;
    this.registerQaElm = document.querySelector('.js-registerQA');
    this.registerQAanswerDivElm = this.registerQaElm.querySelector('.js-registerQAanswerDiv');
    this.registerQAcategorySelectElm = this.registerQaElm.querySelector('.js-registerQAcategorySelect');
    this.registerQaTextAreaElms = this.registerQaElm.querySelectorAll('textarea');
    const registerQaBtnElms = this.registerQaElm.querySelectorAll('button');
    this.resisterQaBtnAddElm = registerQaBtnElms[0];
    this.resisterQaBtnRegisterElm = registerQaBtnElms[1];
  };

  DataManagement.prototype.saveQaData = function() {
    if(!this.registerQaTextAreaElms[0].value || !this.registerQaTextAreaElms[1].value) {
      return;
    }
    let answerArray = [];
    for(let cnt=1,len=this.registerQaTextAreaElms.length;cnt<len;++cnt) {
      if(this.registerQaTextAreaElms[cnt].value) {
        answerArray.push(this.registerQaTextAreaElms[cnt].value);
      }
    }
    this.qaData.set((this.qaData.size+1), { question:this.registerQaTextAreaElms[0].value, answer:answerArray, category: this.registerQAcategorySelectElm.value});
    localStorage.setItem('qaData', JSON.stringify([...this.qaData]));
    window.location.reload(false);
  };

  DataManagement.prototype.addQaAnswerTextarea = function() {
    let textarea = document.createElement('textarea');
    this.registerQAanswerDivElm.appendChild(textarea);
  }

  DataManagement.prototype.setEvent = function() {
    const that = this;
    this.resisterQaBtnAddElm.addEventListener('click', function() {
      that.addQaAnswerTextarea();
    });
    this.resisterQaBtnRegisterElm.addEventListener('click', function() {
      that.registerQaTextAreaElms = that.registerQaElm.querySelectorAll('textarea');
      that.saveQaData();
    });
  };

  DataManagement.prototype.run = function() {
    this.setEvent();
  };

  window.addEventListener('DOMContentLoaded', function() {
    let dataManagement = new DataManagement();
    dataManagement.run();
  });

}());