'use strict';

class Editor {

    constructor (element, textareaId) {
        (typeof(element) === 'object')? this.element = element : this.element = document.getElementById(element);
        (textareaId)? this.textarea = textareaId : this.textarea = 'mdeditor-textarea';
    }

    

    // VALUES //

    getValue() {
        return document.getElementById(this.textarea).value
    }

    setValue(data) {
        document.getElementById(this.textarea).value = data
    }
    
    // RENDER //

    Menu() {
        return [
            {
                title: 'Bold',
                icon: 'bold',
                role: 'mdeditor-bold',
                id: 'mdeditor-bold',
            },
            {
                title: 'Italic',
                icon: 'italic',
                role: 'mdeditor-italic',
                id: 'mdeditor-italic',
            },
            {
                title: 'Strikethrough',
                icon: 'strikethrough',
                role: 'mdeditor-strikethrough',
                id: 'mdeditor-strikethrough',
            },
            {
                title: 'Code',
                icon: 'code',
                role: 'mdeditor-code',
                id: 'mdeditor-code',
            },
            // {
            //     title: 'Quotes',
            //     icon: 'quote-right',
            //     role: 'mdeditor-quote-right',
            //     id: 'mdeditor-quote-right',
            // },
            {
                title: 'Link',
                icon: 'link',
                role: 'mdeditor-link',
                id: 'mdeditor-link',
            },
            {
                title: 'Image',
                icon: 'image',
                role: 'mdeditor-image',
                id: 'mdeditor-image',
            },
            // {
            //     title: 'List',
            //     icon: 'list',
            //     role: 'mdeditor-list',
            //     id: 'mdeditor-list',
            // },
            {
                title: 'Show result',
                icon: 'happy',
                role: 'mdeditor-result',
                id: 'mdeditor-result',
            },
        ]
    }

    Content () {
        return `
        <div class="uk-margin">
            <textarea class="uk-textarea" id="${this.textarea}" rows="25"></textarea>
            <div class="mdeditor-result-container"></div>
        </div>
        `
    }

    render (options) {
        let menu = this.Menu()
        if (options) {
            if (options.menu) {
                menu = options.menu
            }
        }

        let tabBar = `
        <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
        <ul class="uk-navbar-nav uk-margin-top">
        `
        let iterator = 0
        for (let item of menu) {
            if (iterator === 0) {
                tabBar += `
                <li class="uk-active">
                    <button class="uk-close-large uk-icon-button" uk-tooltip="${item.title}" uk-icon="${item.icon}" id="${item.role}"></button>
                </li>
                `
            } else {
                tabBar += `
                <li class="uk-active uk-margin-left">
                    <button class="uk-close-large uk-icon-button" uk-tooltip="${item.title}" uk-icon="${item.icon}" id="${item.role}"></button>
                </li>
                `
            }
            iterator++
        }
        tabBar += `</ul></div></nav>`

        this.element.innerHTML = tabBar + this.Content()
        if (options) {
            if (options.focus) {
                document.getElementById(this.textarea).focus()
            }
        }

        this.addListeners(menu)
        return this
    }

    renderResult() {
        let textarea = document.getElementById(this.textarea)
        let txt = textarea.value
        textarea.classList = 'uk-hidden'
        this.element.getElementsByClassName('mdeditor-result-container')[0].innerHTML = this.parseMdContent(txt)
        return this
    }

    renderTextarea () {
        let textarea = document.getElementById(this.textarea)
        textarea.classList = 'uk-textarea'
        this.element.getElementsByClassName('mdeditor-result-container')[0].innerHTML = ''
        return this
    }

    showResult () {
        let textarea = document.getElementById(this.textarea)
        let txt = textarea.value
        if (textarea.classList.toString().indexOf('uk-hidden') > -1) {
            textarea.classList = 'uk-textarea'
            this.element.getElementsByClassName('mdeditor-result-container')[0].innerHTML = ''
        } else {
            textarea.classList = 'uk-hidden'
            this.element.getElementsByClassName('mdeditor-result-container')[0].innerHTML = this.parseMdContent(txt)
        }
        return this
    }

    parseMdContent (txt) {
        txt = txt.replace(new RegExp('\n','g'),'<br>')
        txt = txt.replace(new RegExp(' ','g'),'&nbsp;')
        

        let italicFound = false
        let boldFound = false
        let strikeFound = false
        let codeFound = false
        let linkFound = false
        let imageFound = false

        let imageLinkFound = false
        let imageAltFound = false
        let imageTitleFound = false
        let imageStart = 0

        let linkTextFound = false
        let linkHrefFound = false
        let linkTitleFound = false
        let linkStart = 0

        let txtList = txt.split('')
        for (let i = 0; i < txtList.length; i++) {
            // Ищем курсив и полужирный текст
            if (txtList[i] === '*') {
                if (codeFound) {
                    continue
                }
                if (italicFound) {
                    txtList[italicFound] = '<i>'
                    txtList[i] = '</i>'
                    italicFound = false
                } else {
                    if (txtList[i - 1] !== '*' && txtList[i + 1] !== '*') {
                        italicFound = i
                    } else {
                        if (!boldFound) {
                            if (txtList[i - 1] === '*') {
                                delete txtList[i - 1]
                                txtList[i] = '<b>'
                                boldFound = true
                            } else if (txtList[i + 1] === '*') {
                                delete txtList[i + 1]
                                txtList[i] = '<b>'
                                boldFound = true
                            }
                        } else {
                            if (txtList[i - 1] === '*') {
                                delete txtList[i - 1]
                                txtList[i] = '</b>'
                                boldFound = false
                            } else if (txtList[i + 1] === '*') {
                                delete txtList[i + 1]
                                txtList[i] = '</b>'
                                boldFound = false
                            }
                        }
                        
                    }
                }
                
            }
            // Ищем зачеркнутый текст
            if (txtList[i] === '~') {
                if (codeFound) {
                    continue
                }
                if (!strikeFound) {
                    if (txtList[i - 1] === '~') {
                        delete txtList[i - 1]
                        txtList[i] = '<strike>'
                        strikeFound = true
                    } else if (txtList[i + 1] === '~') {
                        delete txtList[i + 1]
                        txtList[i] = '<strike>'
                        strikeFound = true
                    }
                } else {
                    if (txtList[i - 1] === '~') {
                        delete txtList[i - 1]
                        txtList[i] = '</strike>'
                        strikeFound = false
                    } else if (txtList[i + 1] === '~') {
                        delete txtList[i + 1]
                        txtList[i] = '</strike>'
                        strikeFound = false
                    }
                }
            }
            // Ищем код
            if (txtList[i] === '`') {
                
                if (typeof(codeFound) === 'number') {
                    txtList[codeFound] = '<code>'
                    txtList[i] = '</code>'
                    codeFound = false
                } else {
                    codeFound = i
                }
                
            }
            // Ищем ссылку
            if (linkFound) {
                // Если ссылка найдена
                if (linkFound.text && linkFound.href && linkFound.title) {
                    if (txtList[i] === ')') {
                        for (let x = linkStart; x < i; x++) {
                            delete txtList[x]
                        }
                        txtList[i] = `<a href="${linkFound.href}">${linkFound.text}</a>`
                        linkFound = false
                    }
                    
                }else {
                    // Алгоритм поиска подходящих значений
                    if (typeof(linkHrefFound) === 'string') {
                        if (txtList[i] !== ' ') {
                            linkHrefFound += txtList[i]
                        } else {
                            linkFound.href = linkHrefFound
                            linkHrefFound = false
                        }
                    }
                    if (typeof(linkTitleFound) === 'string') {
                        if (txtList[i] !== '"') {
                            linkTitleFound += txtList[i]
                        } else {
                            linkFound.title = linkTitleFound
                            linkTitleFound = false
                        }
                    }
                    if (typeof(linkTextFound) === 'string') {
                        if (txtList[i] !== ']') {
                            if (txtList[i] !== '[') {
                                linkTextFound += txtList[i]
                            }
                        } else {
                            linkFound.text = linkTextFound
                            linkTextFound = false
                        }
                    } 
                    if (txtList[i] === '(') {
                        linkHrefFound = ''
                    }
                    if (txtList[i] === '"') {
                        linkTitleFound = ''
                    }
                }
            }
            // Ищем изображения
            if (!imageFound) {
                if (txtList[i] === '!') {
                    if (txtList[i + 1] === '[') {
                        imageStart = i
                        imageFound = {
                            alt: false,
                            link: false,
                            title: false
                        }
                        imageAltFound = ''
                    }
                }
                if (txtList[i] === '[') {
                    linkStart = i
                    linkFound = {
                        text: false,
                        href: false,
                        title: false
                    }
                    linkTextFound = ''
                }
            } else {
                // Если для изображения все есть
                if (imageFound.alt && imageFound.link && imageFound.title) {
                    if (txtList[i] === ')') {
                        for (let x = imageStart; x < i; x++) {
                            delete txtList[x]
                        }
                        txtList[i] = `<img src="${imageFound.link}" alt="${imageFound.alt}">`
                        imageFound = false
                    }
                    
                }else {
                    // Алгоритм поиска подходящих значений
                    if (typeof(imageLinkFound) === 'string') {
                        if (txtList[i] !== ' ') {
                            imageLinkFound += txtList[i]
                        } else {
                            imageFound.link = imageLinkFound
                            imageLinkFound = false
                        }
                    }
                    if (typeof(imageTitleFound) === 'string') {
                        if (txtList[i] !== '"') {
                            imageTitleFound += txtList[i]
                        } else {
                            imageFound.title = imageTitleFound
                            imageTitleFound = false
                        }
                    }
                    if (typeof(imageAltFound) === 'string') {
                        if (txtList[i] !== ']') {
                            if (txtList[i] !== '[') {
                                imageAltFound += txtList[i]
                            }
                        } else {
                            imageFound.alt = imageAltFound
                            imageAltFound = false
                        }
                    } 
                    if (txtList[i] === '(') {
                        imageLinkFound = ''
                    }
                    if (txtList[i] === '"') {
                        imageTitleFound = ''
                    }
                }
                
            }
            
        }

        txt = txtList.join('')
        return txt
    }


    // LISTENERS //

    addListeners (options) {

        for (let item of options) {
            let callbackFunc
            switch (item.role) {
                case 'mdeditor-bold':
                    callbackFunc = this.clickBold
                    break;
                case 'mdeditor-italic':
                    callbackFunc = this.clickItalic
                    break;
                case 'mdeditor-strikethrough':
                    callbackFunc = this.clickStrikethrough
                    break;
                case 'mdeditor-code':
                    callbackFunc = this.clickCode
                    break;
                case 'mdeditor-quote-right':
                    callbackFunc = this.clickQuoteRight
                    break;
                case 'mdeditor-link':
                    callbackFunc = this.clickLink
                    break;
                case 'mdeditor-image':
                    callbackFunc = this.clickImage
                    break;
                case 'mdeditor-list':
                    callbackFunc = this.clickList
                    break;
                case 'mdeditor-result':
                    callbackFunc = this.clickResult
                    break;
            }

            var self = this
            document.getElementById(item.id).addEventListener('click', () => {
                callbackFunc(self)
            })
        }
    }


    // CLICK CALLBACKS //

    clickBold (ctx) {
        ctx.insertAtCaret('****')
    }

    clickItalic (ctx) {
        ctx.insertAtCaret('**')
    }

    clickStrikethrough (ctx) {
        ctx.insertAtCaret('~~~~')
    }

    clickCode (ctx) {
        ctx.insertAtCaret('``')
    }

    clickQuoteRight (ctx) {
        ctx.insertAtCaret('>')
    }

    clickLink (ctx) {
        ctx.insertAtCaret('[Link text](http://link.address "Link title")')
    }

    clickImage (ctx) {
        ctx.insertAtCaret('![Alt text](http://image.address "Image title")')
    }

    clickList (ctx) {
        ctx.insertAtCaret('*')
    }

    clickResult (ctx) {
        ctx.showResult()
    }

    // HANDLERS //
    insertAtCaret(text) {
        var txtarea = document.getElementById(this.textarea)
		if (!txtarea) { return; }

		var scrollPos = txtarea.scrollTop;
		var strPos = 0;
		var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
			"ff" : (document.selection ? "ie" : false ) );
		if (br == "ie") {
			txtarea.focus();
			var range = document.selection.createRange();
			range.moveStart ('character', -txtarea.value.length);
			strPos = range.text.length;
		} else if (br == "ff") {
			strPos = txtarea.selectionStart;
		}

		var front = (txtarea.value).substring(0, strPos);
		var back = (txtarea.value).substring(strPos, txtarea.value.length);
		txtarea.value = front + text + back;
		strPos = strPos + text.length;
		if (br == "ie") {
			txtarea.focus();
			var ieRange = document.selection.createRange();
			ieRange.moveStart ('character', -txtarea.value.length);
			ieRange.moveStart ('character', strPos);
			ieRange.moveEnd ('character', 0);
			ieRange.select();
		} else if (br == "ff") {
			txtarea.selectionStart = strPos;
			txtarea.selectionEnd = strPos;
			txtarea.focus();
		}

		txtarea.scrollTop = scrollPos;
	}

}