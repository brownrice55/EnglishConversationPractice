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
    this.contentsDivElms = document.querySelectorAll('.js-registerQAcontentsDiv');
    this.tabIndexArray = [[1,0],[0,1]];
    
    if(this.qaData.size==0) {
      this.tabLiQaElms[1].classList.add('disp--none');
      this.tabIndexNo = 0;
    }
    else {
      this.tabIndexNo = Math.trunc(localStorage.getItem('tabQa')) || 0;
    }

    this.qalistDataUl = document.querySelector('.js-qalistDataUl');
    this.isPopupOpen = false;
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
    window.location.reload(false); // **後で見直し
  };

  QaDataManagement.prototype.addQaAnswerTextarea = function() {
    const textarea = document.createElement('textarea');
    textarea.value = this.textareaValue;
    this.registerQaAnswerDivElm.appendChild(textarea);
  };

  QaDataManagement.prototype.editQaData = function() {
    this.contentsDivElms[1].classList.add('disp--none');
    this.contentsDivElms[0].classList.remove('disp--none');
    let selectedData = this.qaData.get(this.qaListId);
    this.registerQaTextAreaElms = this.registerQaElm.querySelectorAll('textarea');
    this.registerQaTextAreaElms[0].value = selectedData.question;
    this.registerQaTextAreaElms[1].value = selectedData.answer[0];
    let selectedDataAnswerArrayLength = selectedData.answer.length;
    for(let cnt2=1;cnt2<selectedDataAnswerArrayLength;++cnt2) {
      this.textareaValue = selectedData.answer[cnt2];
      this.addQaAnswerTextarea();
    }
    this.registerQaCategorySelectElm.value = selectedData.category;
    this.textareaValue = '';
    this.resisterQaBtnRegisterElm.innerHTML = '上書き保存する';
    this.resisterQaBtnCancelElm.classList.remove('disp--none');
  };

  QaDataManagement.prototype.displayQuestionList = function() {
    let listQaData = '';
    this.qaData.forEach((value, key) => {
      listQaData += '<li data-index="' + key + '"><p class="js-listQuestion">' + value.question + '</p><div class="main__contents__list__rightMenu"><button class="js-listRightMenuBtn">…</button><ul class="js-listRightMenuUl disp--none"><li class="js-editLi">編集</li><li class="js-deleteLi">削除</li></ul><div class="js-popup disp--none main__contents__list__popup"><div><p>「' + value.question + '」を削除しますか？</p><button class="js-popupCancleBtn">キャンセル</button><button class="js-popupDeleteBtn">削除する</button></div></div></div></li>';
    });
    this.qalistDataUl.innerHTML = listQaData;
    this.listDataElms = this.qalistDataUl.querySelectorAll('.js-listQuestion');
    this.listDataRightMenuElms = this.qalistDataUl.querySelectorAll('.js-listRightMenuBtn');
    this.qaListId = 0;
  };

  QaDataManagement.prototype.displayPopupWindow = function() {
    const that = this;
    let popupElms = document.querySelectorAll('.js-popup');
    let popupCancelBtnElms = document.querySelectorAll('.js-popupCancleBtn');
    let popupDeleteBtnElms = document.querySelectorAll('.js-popupDeleteBtn');
    this.isPopupOpen = true;

    popupElms[(this.qaListId-1)].classList.remove('disp--none');
    for(let cnt=0,len=popupElms.length;cnt<len;++cnt) {
      popupCancelBtnElms[cnt].addEventListener('click', function() {
        this.parentNode.parentNode.classList.add('disp--none');
      });
      popupDeleteBtnElms[cnt].addEventListener('click', function() {
        that.qaData.delete(that.qaListId);
        let qaData = new Map();
        let id = 0;
        that.qaData.forEach((value) => {
          ++id;
          qaData.set(id, { question:value.question, answer:value.answer, category:value.category });
        });
        localStorage.setItem('qaData', JSON.stringify([...qaData]));
        localStorage.setItem('tabQa', that.tabIndexNo);
        window.location.reload(false); // **後で見直し
        // this.parentNode.parentNode.classList.add('disp--none'); **後で
        // that.qaData = qaData;
        // that.displayQuestionList();　**後で
      });
    }
    
    window.addEventListener('click', function() {
      if(that.isPopupOpen) {
        if(event.target==popupElms[(that.qaListId-1)]) {
          popupElms[(that.qaListId-1)].classList.add('disp--none');
          that.isPopupOpen = false;
        }
      }
    });  

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

    this.editLiElms = document.querySelectorAll('.js-editLi');
    this.deleteLiElms = document.querySelectorAll('.js-deleteLi');
    let listRightMenuUlElms = document.querySelectorAll('.js-listRightMenuUl');
    let isRightMenuOpen = false;
    let clientX = 0;
    let clientY = 0;

    for(let cnt=0,len=this.listDataElms.length;cnt<len;++cnt) {
      this.listDataElms[cnt].addEventListener('click', function() {
        that.qaListId = Math.trunc(this.parentNode.dataset.index);
        that.editQaData();
      });
      this.listDataRightMenuElms[cnt].addEventListener('click', function() {
        this.nextSibling.classList.remove('disp--none');
        that.qaListId = Math.trunc(this.parentNode.parentNode.dataset.index);
        clientX = event.clientX;
        clientY = event.clientY;
        isRightMenuOpen = true;
      });
      this.editLiElms[cnt].addEventListener('click', function() {
        that.qaListId = Math.trunc(this.parentNode.parentNode.parentNode.dataset.index);
        that.editQaData();
        this.parentNode.classList.add('disp--none');
      }); 
      this.deleteLiElms[cnt].addEventListener('click', function() {
        that.qaListId = Math.trunc(this.parentNode.parentNode.parentNode.dataset.index);
        this.parentNode.classList.add('disp--none');
        that.displayPopupWindow();
      }); 
    }

    window.addEventListener('click', function() {
      let clientX2 = event.clientX;
      let clientY2 = event.clientY;
      if(clientX!=clientX2 && clientY!=clientY2 && isRightMenuOpen) {
        listRightMenuUlElms[(that.qaListId-1)].classList.add('disp--none');
        isRightMenuOpen = false;
      }
    });

    this.resisterQaBtnCancelElm.addEventListener('click', function() {
      that.contentsDivElms[0].classList.add('disp--none');
      that.contentsDivElms[1].classList.remove('disp--none');
      that.reset();
    });

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