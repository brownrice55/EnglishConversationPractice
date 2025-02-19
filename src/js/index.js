(function() {

  'use strict';

  let qaDataGlobal = new Map();
  let qaData = localStorage.getItem('qaData');
  if(qaData!=='undefined') {
    const qaDataJson = JSON.parse(qaData);
    qaDataGlobal = new Map(qaDataJson);
  }

  const tabUlElmsGlobal = document.querySelectorAll('.js-tabUl');

  // ** settings
  const categoryNameDefault = [{ num:1, name:'挨拶' }, { num:2, name:'趣味' }, { num:3, name:'仕事' }];
  let categoryNameDataGlobal = JSON.parse(localStorage.getItem('categoryNameData')) || categoryNameDefault;

  let voiceLangDataGlobal = JSON.parse(localStorage.getItem('voiceLangData')) || ['en-GB', 'en-GB'];

  const GlobalMenu = function() {
    this.initialize.apply(this, arguments);
  };

  GlobalMenu.prototype.initialize = function() {
    this.headerNavMenuBtnElm = document.querySelector('.js-headerNavMenuBtn');
    this.headerNavMenuCloseBtnElm = document.querySelector('.js-headerNavMenuCloseBtn');
    this.headerNavMenuLiElms = document.querySelectorAll('.js-headerNavMenu li');
    this.sectionElms = document.querySelectorAll('section');
  };

  GlobalMenu.prototype.setEvent = function() {
    const that = this;
    this.headerNavMenuBtnElm.addEventListener('click', function() {
      if(speechSynthesis.speaking) {
        speechSynthesis.cancel();
        let iconPlayElm = document.querySelector('.js-practice .play');
        iconPlayElm.classList.add('stop');
        iconPlayElm.classList.remove('play');
        iconPlayElm.textContent = '停止アイコン';

        let iconAllElms = document.querySelectorAll('.js-practice .stop');
        for(let cnt=0,len=iconAllElms.length;cnt<len;++cnt) {
          iconAllElms[cnt].disabled = false;
        }
      }
      this.classList.add('disp--none');
      that.headerNavMenuCloseBtnElm.parentNode.classList.remove('disp--none');
    });
    this.headerNavMenuCloseBtnElm.addEventListener('click', function() {
      this.parentNode.classList.add('disp--none');
      that.headerNavMenuBtnElm.classList.remove('disp--none');
    });
    const sectionIndexArray = [[1,2],[0,2],[0,1]];
    for(let cnt=0,len=this.headerNavMenuLiElms.length;cnt<len;++cnt) {
      this.headerNavMenuLiElms[cnt].addEventListener('click', function() {
        that.headerNavMenuBtnElm.classList.remove('disp--none');
        that.headerNavMenuCloseBtnElm.parentNode.classList.add('disp--none');
        that.sectionElms[cnt].classList.remove('disp--none');
        for(let cnt2=0;cnt2<2;++cnt2) {
          that.sectionElms[sectionIndexArray[cnt][cnt2]].classList.add('disp--none');
        }
      });
    }
  };

  GlobalMenu.prototype.run = function() {
    this.setEvent();
  };

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
    this.categoryNameData = categoryNameDataGlobal;

    this.tabLiQaElms = tabUlElmsGlobal[1].querySelectorAll('li');
    this.contentsDivElms = document.querySelectorAll('.js-registerQAcontentsDiv');
    this.tabIndexArray = [[1,0],[0,1]];
    
    if(this.qaData.size==0) {
      this.tabLiQaElms[1].classList.add('disp--none');
      this.tabIndexNo = 0;
    }
    else {
      this.tabIndexNo = parseInt(localStorage.getItem('tabQa')) || 0;
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
    let id = (this.tabIndexNo) ? parseInt(this.qaListId) : this.qaData.size+1;
    this.qaData.set(id, { question:this.registerQaTextAreaElms[0].value, answer:answerArray, category:this.registerQaCategorySelectElm.value, clip:false});
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
        that.tabIndexNo = parseInt(this.dataset.index);
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
        that.qaListId = parseInt(this.parentNode.dataset.index);
        that.editQaData();
      });
      this.listDataRightMenuElms[cnt].addEventListener('click', function() {
        this.nextSibling.classList.remove('disp--none');
        that.qaListId = parseInt(this.parentNode.parentNode.dataset.index);
        clientX = event.clientX;
        clientY = event.clientY;
        isRightMenuOpen = true;
      });
      this.editLiElms[cnt].addEventListener('click', function() {
        that.qaListId = parseInt(this.parentNode.parentNode.parentNode.dataset.index);
        that.editQaData();
        this.parentNode.classList.add('disp--none');
      }); 
      this.deleteLiElms[cnt].addEventListener('click', function() {
        that.qaListId = parseInt(this.parentNode.parentNode.parentNode.dataset.index);
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

    for(let cnt=0,len=this.categoryNameData.length;cnt<len;++cnt) {
      let optionElm = document.createElement('option');
      optionElm.value = this.categoryNameData[cnt].name;
      optionElm.textContent = this.categoryNameData[cnt].name;
      optionElm.dataset.num = this.categoryNameData[cnt].num;
      this.registerQaCategorySelectElm.appendChild(optionElm);
    }
    this.registerQaCategorySelectElm.value = this.categoryNameData[0].name;
  };

  const Settings = function() {
    this.initialize.apply(this, arguments);
  };

  Settings.prototype.initialize = function() {
    this.settingsElm = document.querySelector('.js-settings');
    this.settingsH2Title = this.settingsElm.querySelector('h2');
    this.settingsContentsDivElms = this.settingsElm.querySelectorAll(':scope > div');
    this.settingsContentsLiElms = document.querySelectorAll('.js-settingsList li');
    this.categoryListIndexNo = 0;

    this.categoryNameSettingBtnElms = document.querySelectorAll('.js-categoryNameSettingBtn button');
    this.categoryNameAddBtnElm = this.categoryNameSettingBtnElms[0];
    this.categoryNameRegisterBtnElm = this.categoryNameSettingBtnElms[1];

    this.categoryNameData = categoryNameDataGlobal;
    this.categoryNameSettingAreaElm = document.querySelector('.js-categoryNameSettingArea');

    this.voiceLangData = voiceLangDataGlobal;
    this.settingsVoiceElms = document.querySelectorAll('.js-settingsVoice');
    this.settingsVoiceBtnElm = document.querySelector('.js-settingsVoiceBtn');
  };

  Settings.prototype.switchAndDisplayPages = function() {
    let h2Text = '';
    for(let cnt=0,len=this.settingsContentsLiElms.length;cnt<len;++cnt) {
      if(cnt==this.categoryListIndexNo) {
        this.settingsContentsDivElms[(cnt+1)].classList.remove('disp--none');
        h2Text = this.settingsContentsLiElms[cnt].textContent;
        this.settingsH2Title.innerHTML = '<span class="js-backToList backToList">←</span>' + h2Text; // **<span>←</span>の部分は後で変更
      }
      else {
        this.settingsContentsDivElms[(cnt+1)].classList.add('disp--none');
      }
    }
    const that = this;
    this.settingsContentsLiElms[0].parentNode.classList.add('disp--none');
    let backToListElm = document.querySelector('.js-backToList');
    backToListElm.addEventListener('click', function() {
      that.settingsContentsLiElms[0].parentNode.classList.remove('disp--none');
      that.settingsContentsDivElms[0].classList.remove('disp--none');
      that.settingsContentsDivElms[(that.categoryListIndexNo+1)].classList.add('disp--none');
      that.settingsH2Title.textContent = '設定';
    });
  };

  Settings.prototype.displayCategoryNameList = function() {
    let categoryNameSettingHTML = '<h3>カテゴリ名を追加</h3>';
    for(let cnt=0,len=this.categoryNameData.length;cnt<len;++cnt) {
      categoryNameSettingHTML += '<div><input type="text" name="" id="" value="' + this.categoryNameData[cnt].name + '" dataset-num="' + this.categoryNameData[cnt].num + '"><button>削除</button></div>';
    }
    this.categoryNameSettingAreaElm.innerHTML = categoryNameSettingHTML;

    let deleteButtonElms = this.categoryNameSettingAreaElm.querySelectorAll('button');
    for(let cnt=0,len=deleteButtonElms.length;cnt<len;++cnt) {
      deleteButtonElms[cnt].addEventListener('click', function() {
        this.parentNode.remove();
      });
    }
  };

  Settings.prototype.addCategoryNameInputText = function() {
    const div = document.createElement('div');
    div.innerHTML = '<input type="text" name="" id="" value="">';
    this.categoryNameSettingAreaElm.appendChild(div);
  };

  Settings.prototype.saveCategoryName = function() {
    let categoryNameSettingAreaInputElms = this.categoryNameSettingAreaElm.querySelectorAll('input');
    let isInputValueFilled = 0;
    for(let cnt=0,len=categoryNameSettingAreaInputElms.length;cnt<len;++cnt) {
      if(categoryNameSettingAreaInputElms[cnt].value) {
        ++isInputValueFilled;
      }
    }
    if(!isInputValueFilled) { return; }

    let inputArray = [];
    let categoryNum = 0;
    for(let cnt=0,len=categoryNameSettingAreaInputElms.length;cnt<len;++cnt) {
      if(categoryNameSettingAreaInputElms[cnt].value) {
        categoryNum = parseInt(categoryNameSettingAreaInputElms[cnt].dataset.num) || categoryNum+1;
        inputArray.push({name: categoryNameSettingAreaInputElms[cnt].value, num: categoryNum});
      }
    }

    this.categoryNameData = inputArray;
    localStorage.setItem('categoryNameData', JSON.stringify([...this.categoryNameData]));
    window.location.reload(false); // **後で見直し
  };

  Settings.prototype.setEvent = function() {
    const that = this;
    this.categoryNameAddBtnElm.addEventListener('click', function() {
      that.addCategoryNameInputText();
    });
    this.categoryNameRegisterBtnElm.addEventListener('click', function() {
      that.saveCategoryName();
    });

    for(let cnt=0,len=this.settingsContentsLiElms.length;cnt<len;++cnt) {
      this.settingsContentsLiElms[cnt].addEventListener('click', function() {
        that.categoryListIndexNo = parseInt(this.dataset.index);
        that.switchAndDisplayPages();
      });
    }

    this.settingsVoiceBtnElm.addEventListener('click', function() {
      localStorage.setItem('voiceLangData', JSON.stringify([that.settingsVoiceElms[0].value, that.settingsVoiceElms[1].value]));
      window.location.reload(false); // **後で見直し
    });
  };

  Settings.prototype.run = function() {
    for(let cnt=0;cnt<2;++cnt) {
      this.settingsVoiceElms[cnt].value = this.voiceLangData[cnt];
    }
    this.displayCategoryNameList();
    this.setEvent();
  };


  const Practice = function() {
    this.initialize.apply(this, arguments);
  };

  Practice.prototype.initialize = function() {
    this.qaData = qaDataGlobal;
    this.practiceQuestionElm = document.querySelector('.js-practiceQuestion');
    this.practiceAnswersElm = document.querySelector('.js-practiceAnswers');
    this.practiceDisplayAnswerBtnElm = document.querySelector('.js-practiceDisplayAnswerBtn');
    this.practiceDisplayNextQuestionBtnElm = document.querySelector('.js-practiceDisplayNextQuestionBtn');

    this.tabPracticeH2Elms = tabUlElmsGlobal[0].querySelectorAll('h2');

    this.randomIndexArray = this.getRandomIndexArray(this.qaData.size);
    this.randomCnt = 0;

    this.voiceLangData = voiceLangDataGlobal;
    this.voice = new SpeechSynthesisUtterance();
    this.questionAudioIconElm = document.querySelector('.js-questionAudioIcon');
  };

  Practice.prototype.resetDisabled = function(aTargetIconElm) {
    aTargetIconElm.classList.add('stop');
    aTargetIconElm.classList.remove('play');
    aTargetIconElm.textContent = '停止アイコン';
    this.questionAudioIconElm.disabled = false;
    for(let cnt=0,len=this.answerAudioIconElms.length;cnt<len;++cnt) {
      this.answerAudioIconElms[cnt].disabled = false;
    }
  };

  Practice.prototype.playAudio = function(aText, aIndex, aIconElm) {
    const that = this;
    
    if(speechSynthesis.speaking) {
      speechSynthesis.cancel();
      this.resetDisabled(aIconElm);
    }
    else {
      this.voice = new SpeechSynthesisUtterance(aText);
      this.voice.lang = this.voiceLangData[aIndex];
      speechSynthesis.speak(this.voice);
      aIconElm.classList.add('play');
      aIconElm.classList.remove('stop');
      aIconElm.textContent = '再生中アイコン';
  
      this.questionAudioIconElm.disabled = true;
      for(let cnt=0,len=this.answerAudioIconElms.length;cnt<len;++cnt) {
        this.answerAudioIconElms[cnt].disabled = true;
      }
      aIconElm.disabled = false;

      this.voice.addEventListener('end', function() {
        that.resetDisabled(aIconElm);
      });
    }
  };

  Practice.prototype.displayNewQuestion = function() {
    const that = this;
    this.selectedDataId = this.randomIndexArray[this.randomCnt]+1;
    this.selectedData = this.qaData.get(this.selectedDataId);
    this.practiceQuestionElm.innerHTML = this.selectedData.question;
    this.practiceAnswersElm.innerHTML = '';
    const seletedAnswerArrayLength = this.selectedData.answer.length;
    for(let cnt=0;cnt<seletedAnswerArrayLength;++cnt) {
      const dl = document.createElement('dl');
      dl.innerHTML = '<dt>回答例' + (cnt+1) + '<button class="js-audioIcon stop">停止アイコン</button></dt><dd>' + this.selectedData.answer[cnt] + '</dd>';
      this.practiceAnswersElm.appendChild(dl);
    }
    this.answerAudioIconElms = this.practiceAnswersElm.querySelectorAll('.js-audioIcon');
    this.answerAudioDdElms = this.practiceAnswersElm.querySelectorAll('dd');
    for(let cnt=0;cnt<seletedAnswerArrayLength;++cnt) {
      this.answerAudioIconElms[cnt].addEventListener('click', function() {
        that.playAudio(that.answerAudioDdElms[cnt].textContent, 1, this);
      });
    }

    this.clipIconElm = document.querySelector('.js-clipIcon');
    this.clipIconElm.textContent = (this.selectedData.clip) ? 'クリップアイコン' : 'クリップを外す';
  };

  Practice.prototype.getRandomIndexArray = function(aLength) {
    let len = aLength;
    let array = [];
    for(let cnt=0;cnt<len;++cnt) {
      array[cnt] = cnt;
    }
    for(let cnt=len-1;cnt>0;--cnt) {
      const random = Math.floor(Math.random()*(cnt+1));
      [array[cnt],array[random]] = [array[random],array[cnt]];
    }
    return array;
  };

  Practice.prototype.setEvent = function() {
    const that = this;
    this.practiceDisplayAnswerBtnElm.addEventListener('click', function() {
      that.practiceAnswersElm.classList.remove('disp--none');
      that.practiceDisplayNextQuestionBtnElm.parentNode.classList.remove('disp--none');
      this.parentNode.classList.add('disp--none');
    });
    this.practiceDisplayNextQuestionBtnElm.addEventListener('click', function() {
      speechSynthesis.cancel();
      that.practiceAnswersElm.classList.add('disp--none');
      this.parentNode.classList.add('disp--none');
      that.practiceDisplayAnswerBtnElm.parentNode.classList.remove('disp--none');
      ++that.randomCnt;
      that.displayNewQuestion();
      that.resetDisabled(that.questionAudioIconElm);
    });
    this.questionAudioIconElm.addEventListener('click', function() {
      that.playAudio(that.selectedData.question, 0 ,this);
    });

    const tabIndexArray = [[1,2],[0,2],[0,1]];
    let practiceContentsElms = document.querySelectorAll('.js-practiceContents');
    let practiceDescriptionElm = document.querySelector('.js-practiceDescription');
    let practiceDescriptionTextArray = ['登録した質問をランダムで出題します。', 'クリップした質問をランダムで出題します。', 'リスト登録した質問を登録の順番で出題します。'];
    for(let cnt=0,len=this.tabPracticeH2Elms.length;cnt<len;++cnt) {
      this.tabPracticeH2Elms[cnt].addEventListener('click', function() {
        for(let cnt2=0;cnt2<2;++cnt2) {
          that.tabPracticeH2Elms[tabIndexArray[cnt][cnt2]].parentNode.classList.remove('active');
        }
        if(cnt==2) {
          practiceContentsElms[0].classList.add('disp--none');
          practiceContentsElms[1].classList.remove('disp--none');
        }
        else {
          practiceContentsElms[1].classList.add('disp--none');
          practiceContentsElms[0].classList.remove('disp--none');
        }

        this.parentNode.classList.add('active');
        practiceDescriptionElm.innerHTML = practiceDescriptionTextArray[cnt];
      });
    }

    let clip = this.selectedData.clip;
    this.clipIconElm.addEventListener('click', function() {
      clip = !clip;
      that.qaData.set(that.selectedDataId, { question:that.selectedData.question, answer:that.selectedData.answer, category:that.selectedData.category, clip:clip});
      localStorage.setItem('qaData', JSON.stringify([...that.qaData]));
      this.textContent = (clip) ? 'クリップアイコン' : 'クリップを外す';
    });
  };

  Practice.prototype.run = function() {
    this.displayNewQuestion();
    this.setEvent();
  };

  window.addEventListener('DOMContentLoaded', function() {
    let globalMenu = new GlobalMenu();
    globalMenu.run();

    let settings = new Settings();
    settings.run();

    let qaDataManagement = new QaDataManagement();
    qaDataManagement.run();

    let practice = new Practice();
    practice.run();
  });

}());