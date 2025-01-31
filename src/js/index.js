(function() {

  'use strict';

  let qaDataGlobal = new Map();
  let qaData = localStorage.getItem('qaData');

  if(qaData!=='undefined') {
    const qaDataJson = JSON.parse(qaData);
    qaDataGlobal = new Map(qaDataJson);
  }

  const tabUlElmsGlobal = document.querySelectorAll('.js-tabUl');
  // this.tabPracticeElm = tabElmsGlobal[0];

  const QaDataManagement = function() {
    this.initialize.apply(this, arguments);
  };

  QaDataManagement.prototype.initialize = function() {
    this.qaData = qaDataGlobal;
    this.registerQaElm = document.querySelector('.js-registerQA');
    this.registerQaAnswerDivElm = this.registerQaElm.querySelector('.js-registerQAanswerDiv');
    this.registerQaCategorySelectElm = this.registerQaElm.querySelector('.js-registerQAcategorySelect');
    this.registerQaTextAreaElms = this.registerQaElm.querySelectorAll('textarea');
    const registerQaBtnElms = this.registerQaElm.querySelectorAll('button');
    this.resisterQaBtnAddElm = registerQaBtnElms[0];
    this.resisterQaBtnCancelElm = registerQaBtnElms[1];
    this.resisterQaBtnRegisterElm = registerQaBtnElms[2];
    this.textareaValue = '';

    this.tabLiQaElms = tabUlElmsGlobal[1].querySelectorAll('li');
    this.contentsDivElms = document.querySelectorAll('.js-contentsDiv');
    this.tabIndexArray = [[1,0],[0,1]];
    
    if(this.qaData.size==0) {
      this.tabLiQaElms[1].classList.add('disp--none');
      this.tabIndexNo = 0;
    }
    else {
      this.tabIndexNo = Math.trunc(localStorage.getItem('tabQa')) || 0;
    }

    this.qalistDataUl = document.querySelector('.js-qalistDataUl');
  };

  QaDataManagement.prototype.saveQaData = function() {
    if(!this.registerQaTextAreaElms[0].value || !this.registerQaTextAreaElms[1].value) {
      return;
    }
    let answerArray = [];
    for(let cnt=1,len=this.registerQaTextAreaElms.length;cnt<len;++cnt) {
      if(this.registerQaTextAreaElms[cnt].value) {
        answerArray.push(this.registerQaTextAreaElms[cnt].value);
      }
    }
    let id = (this.tabIndexNo) ? Math.trunc(this.qaListId) : this.qaData.size+1;
    this.qaData.set(id, { question:this.registerQaTextAreaElms[0].value, answer:answerArray, category:this.registerQaCategorySelectElm.value});
    localStorage.setItem('qaData', JSON.stringify([...this.qaData]));
    localStorage.setItem('tabQa', this.tabIndexNo);
    window.location.reload(false);
  };

  QaDataManagement.prototype.addQaAnswerTextarea = function() {
    const textarea = document.createElement('textarea');
    textarea.value = this.textareaValue;
    this.registerQaAnswerDivElm.appendChild(textarea);
  };

  QaDataManagement.prototype.editQaData = function() {
    const that = this;
    this.listDataElms = this.qalistDataUl.childNodes;
    this.qaListId = 0;
    for(let cnt=0,len=this.listDataElms.length;cnt<len;++cnt) {
      this.listDataElms[cnt].addEventListener('click', function() {
        that.qaListId = Math.trunc(this.dataset.index);
        that.contentsDivElms[1].classList.add('disp--none');
        that.contentsDivElms[0].classList.remove('disp--none');
        let selectedData = that.qaData.get(that.qaListId);
        that.registerQaTextAreaElms = that.registerQaElm.querySelectorAll('textarea');
        that.registerQaTextAreaElms[0].value = selectedData.question;
        that.registerQaTextAreaElms[1].value = selectedData.answer[0];
        let selectedDataAnswerArrayLength = selectedData.answer.length;
        for(let cnt2=1;cnt2<selectedDataAnswerArrayLength;++cnt2) {
          that.textareaValue = selectedData.answer[cnt2];
          that.addQaAnswerTextarea();
        }
        that.registerQaCategorySelectElm.value = selectedData.category;
        that.textareaValue = '';
        that.resisterQaBtnRegisterElm.innerHTML = '上書き保存する';
        that.resisterQaBtnCancelElm.classList.remove('disp--none');
      });
    }
    this.resisterQaBtnCancelElm.addEventListener('click', function() {
      that.contentsDivElms[0].classList.add('disp--none');
      that.contentsDivElms[1].classList.remove('disp--none');
      that.reset();
    });
  };

  QaDataManagement.prototype.displayQuestionList = function() {
    let listQaData = '';
    this.qaData.forEach((value, key) => {
      listQaData += '<li data-index="' + key + '"><p>' + value.question + '</p><span>…</span></li>';
    });
    this.qalistDataUl.innerHTML = listQaData;
    this.editQaData();
  };

  QaDataManagement.prototype.switchTabs = function() {
    this.tabLiQaElms[this.tabIndexArray[this.tabIndexNo][0]].classList.remove('active');
    this.tabLiQaElms[this.tabIndexArray[this.tabIndexNo][1]].classList.add('active');
    this.contentsDivElms[this.tabIndexArray[this.tabIndexNo][0]].classList.add('disp--none');
    this.contentsDivElms[this.tabIndexArray[this.tabIndexNo][1]].classList.remove('disp--none');
  };

  QaDataManagement.prototype.reset = function() {
    if(!this.tabIndexNo) {
      this.resisterQaBtnRegisterElm.innerHTML = '登録する';
      this.resisterQaBtnCancelElm.classList.add('disp--none');
      this.registerQaTextAreaElms[0].value = '';
      this.registerQaCategorySelectElm.value = 'hobby';
    }
    this.registerQaAnswerDivElm.innerHTML = '<h3>回答例（英語）<span class="required">※</span></h3><textarea name="" id=""></textarea>';
  };

  QaDataManagement.prototype.setEvent = function() {
    const that = this;
    this.displayQuestionList();
    this.resisterQaBtnAddElm.addEventListener('click', function() {
      that.addQaAnswerTextarea();
    });
    this.resisterQaBtnRegisterElm.addEventListener('click', function() {
      that.registerQaTextAreaElms = that.registerQaElm.querySelectorAll('textarea');
      that.saveQaData();
    });
    for(let cnt=0,len=2;cnt<len;++cnt) {
      this.tabLiQaElms[cnt].addEventListener('click', function() {
        that.tabIndexNo = Math.trunc(this.dataset.index);
        that.switchTabs();
        that.reset();
      });  
    }
  };

  QaDataManagement.prototype.run = function() {
    this.setEvent();
    if(this.tabIndexNo) {
      this.tabLiQaElms[this.tabIndexArray[this.tabIndexNo][0]].classList.remove('active');
      this.tabLiQaElms[this.tabIndexArray[this.tabIndexNo][1]].classList.add('active');
      this.contentsDivElms[this.tabIndexArray[this.tabIndexNo][0]].classList.add('disp--none');
      this.contentsDivElms[this.tabIndexArray[this.tabIndexNo][1]].classList.remove('disp--none');
    }
  };

  window.addEventListener('DOMContentLoaded', function() {
    let qaDataManagement = new QaDataManagement();
    qaDataManagement.run();
  });

}());