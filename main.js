const container = document.querySelector('.code-editor-container')
const codeWrapper = document.querySelector('.code-wrapper')
const codeInput = document.querySelector('#codeinput')
const lineNumbersContainer = document.querySelector('.line-numbers')
let linesCount = codeInput.childElementCount

// Varible for console start here //
const consoleWrapper = document.querySelector('.console-wrapper')
const consoleHistory = document.querySelector('.console-history')
const consoleInput = document.querySelector('#console-input')

// Console Intruction
const info = `
<div class="info">
    Instruction:
    <ul>
        <li>You can input code below, then press "Enter" to execute.</li>
        <li>Press "Shift + Enter" to add a new line.</li>
        <li>Type "clear()" to clear the console history.</li>
        <li>
            You can also type "console.log()" to log the value of a variable
            or code, but it is not necessary.
            <br /><br />
            Just type "1 + 2" instead of "console.log(1 + 2)". It will
            generate the same result.
        </li>
        <li>Use the Up and Down Arrows to navigate the command history.</li>
    </ul>
    <br /><br />
    Info: Type "clear()" to clear this message!
</div>
`



/**
 * Creates an HTML element with the specified properties.
 * @param {Object} properties - The properties object parameter.
 * @param {string} properties.name - The name of the element to create. (Required)
 * @param {string} [properties.id] - The ID to assign to the element (optional).
 * @param {string|string[]} [properties.classList] - The class(es) to add to the element (optional).
 * @param {string} [properties.title] - The title attribute of the element (optional).
 * @param {string} [properties.innerHTML] - The inner HTML content of the element (optional).
 * @param {Object} [properties.eventListener] - The event listener configuration (optional).
 * @param {string} properties.eventListener.eventName - The name of the event to listen to.
 * @param {Function} properties.eventListener.callback - The callback function for the event listener.
 * @param {Object} [properties.action] - The action to perform on the target element (optional).
 * @param {string} properties.action.target - The target element selector (e.g., ".className", "#id", "tagName").
 * @param {string} properties.action.type - The type of action to perform. It can be 'append', 'prepend', 'after', or 'before'.
 * @returns {HTMLElement} The created HTML element.
 *
 * @example
 * // Usage examples
 * const element = createElement('div', { classList: ['class1', 'class2'], eventListener: { eventName: 'click', callback: handleClick } });
 * createElement('span', { action: { type: 'append', target: '.container' } });
 */
  
function createElement({ name, id, classList, title, innerHTML, eventListener, action }) {
    const el = document.createElement(name)
  
    if (id) el.id = id
  
    if (classList) {
      // Add classes to the element
      // Check if classList is an array, then add each class individually
      // If classList is not an array, treat it as a single class and add it to the element
      el.classList.add(...(classList instanceof Array ? classList : [classList]))
    }
  
    if (title) el.title = title
    if (innerHTML) el.innerHTML = innerHTML
    if (eventListener) {
      // Add event listener to the element
      // Attach the event specified in eventListener.eventName and the callback function in eventListener.callback
      el.addEventListener(eventListener.eventName, eventListener.callback)
    }
  
    if (action) {
      const { target, type } = action
      // Execute the action on the target element
      // Use the target selector to query the target element and perform the specified action (type) with the created element (el)
      document.querySelector(target)[type](el)
    }
  
    return el
}
  

let caretPos = window.getSelection().focusOffset

codeInput.addEventListener('keyup', (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
        caretPos = window.getSelection().focusOffset
    }
})

codeInput.addEventListener('pointerup', () => {
    caretPos = window.getSelection().focusOffset
})


// ====================================================== //
//                CODE EDITOR FUNCTIONS                   //
// ====================================================== //

document.body.onload = setHeightCodeInput()

function setCaretPosition(offset) {
    let selection = window.getSelection()

    !!offset && offset <= selection.focusNode.length ? 
            selection.setPosition(selection.focusNode, caretPos) :
            selection.setPosition(selection.focusNode, selection.focusNode.length)  
}


function addNewLineNumber(linesCount) {
    let newNumber = document.createElement('span')
        newNumber.innerText = linesCount

    lineNumbersContainer.append(newNumber)
}


function deleteLastLine() {
    if (lineNumbersContainer.childElementCount > 1) 
        lineNumbersContainer.lastElementChild.remove()
}


function createNewLineCode(e, text) {
    let textAfterCaret = e.target.innerText.substring(caretPos)
    let textBeforeCaret = e.target.innerText.substring(0, caretPos)
    
    let newCode = document.createElement('code')
        setEditableTrue(newCode)
        newCode.tabIndex = 0
        newCode.innerHTML = text ?? textAfterCaret

    if (text == null){
        e.target.innerText = textBeforeCaret
        e.target.after(newCode)
        e.target.nextElementSibling.focus()
    } else {
        e.target.parentElement.append(newCode)
    }
        
    linesCount++
    addNewLineNumber(linesCount)
    setHeightCodeInput(linesCount)
}


function updateLineColInfo(line) {
    let col = window.getSelection().focusOffset
    let lineColInfo = document.querySelector('.lineColInfo')
        lineColInfo.innerText = `Ln ${++line}, Col ${++col}`
}


function getFocusedLineIndexPosition() {
    let focusedLine = document.activeElement
    let codeInputLines = Array.from(codeInput.children)
    let focusedLineIndexPosition = codeInputLines.indexOf(focusedLine)

    return focusedLineIndexPosition
}



function createCopySelectionButton() {

    createElement({
        name: "span", 
        classList: "copy-btn-popup",
        title: "Copy", 
        action: {
            type: "append",
            target: "code.highlighted"
        } 
    })

    container.addEventListener('click', (e) => {
        if (e.target.className == 'copy-btn-popup')
            copySelection() 
        
        deleteCopyButton()
    }, {once:true})

}

let copySelection = () => {
    let selectedText = window.getSelection().toString()
    navigator.clipboard.writeText(selectedText)
    deleteCopyButton()
}

let deleteCopyButton = () => {
    let copyBtn = document.querySelector('.copy-btn-popup')
    if (copyBtn) copyBtn.remove()
    window.getSelection().removeAllRanges()
}


function setHeightCodeInput(linesCount) {
    let scrollPos = document.querySelector('.code-wrapper').scrollTop 
    let linesHeight = linesCount * 21 // 21 is lineheight (in 'px') declared in css 
    codeInput.style.height = 'max-content'
    let codeWrapperHeight = codeWrapper.offsetHeight
    
    codeInput.style.height = linesHeight + codeWrapperHeight - 64 + 'px'
    
    linesHeight < codeWrapperHeight ?
        codeWrapper.scrollTo(0, scrollPos) :
        codeWrapper.scrollBy(0, 21) // to add some space between the line adn console
}


function setEditableTrue(el) {
    el.setAttribute('contenteditable', true)
}

function setEditableFalse(el) {
    el.setAttribute('contenteditable', false)
}


function setLineHightligher() {
    let lineNumberList = Array.from(lineNumbersContainer.children)
    let lineCodeList = Array.from(codeInput.children)

    lineNumberList.forEach(line => {
        if (line.classList.contains('highlighted')) {
            line.classList.remove('highlighted')
        } 
    });

    lineCodeList.forEach(code => {
        if (code.classList.contains('highlighted')) {
            code.classList.remove('highlighted')
        } 
    });
    
    try {
        lineNumberList[getFocusedLineIndexPosition()].classList.add('highlighted')
        lineCodeList[getFocusedLineIndexPosition()].classList.add('highlighted')
    } catch { }
    
}





// ====================================================== //
//              CODE EDITOR EVENT LISTENER                //
// ====================================================== //

codeInput.addEventListener('keydown', (e) => {

    if (e.key == 'Enter') {
        e.preventDefault()
        createNewLineCode(e)
    }

    
    if (e.key == "ArrowDown") {
        e.preventDefault()
        try {
            e.target.nextElementSibling.focus();
            setCaretPosition(caretPos)
        } catch { }
    }

    
    if (e.key == "ArrowUp") {
        e.preventDefault()
        try {
            e.target.previousElementSibling.focus();
            setCaretPosition(caretPos)
        } catch { }
    }


    if (e.key == "Backspace" && caretPos == 0) {
        
        if (e.target.previousElementSibling) {
            e.preventDefault()
            let prevEl = e.target.previousElementSibling
            let prevElTextLength = prevEl.innerText.length
            let textAfterCaret = e.target.innerHTML
                prevEl.focus()
                prevEl.innerText += textAfterCaret
    
                if (prevElTextLength) {
                    let selection = window.getSelection()
                        selection.setPosition(prevEl.firstChild, prevElTextLength)
                }
                    
                e.target.remove()
        }
    }


    if (codeInput.childElementCount < linesCount) {
        linesCount--
        setHeightCodeInput(linesCount)
        deleteLastLine()
    }


    if (e.ctrlKey && e.key == 'a') {
        setEditableTrue(codeInput)
        createCopySelectionButton()

    }

    if (e.ctrlKey && e.key == 'c') {
        copySelection()
    }
    
    if (e.key == "Backspace") {

        if (codeInput.getAttribute('contenteditable') == 'true') {
            linesCount = 1
            lineNumbersContainer.innerHTML = ''
            codeInput.innerHTML = ''
            setEditableFalse(codeInput)
            
            let newCode = document.createElement('code')
                setEditableTrue(newCode)
                newCode.tabIndex = 0
                newCode.innerText = ''
                newCode.classList.add('highlighted')
                
            codeInput.append(newCode)
            codeInput.firstElementChild.focus()

            addNewLineNumber(linesCount)
            setHeightCodeInput(linesCount)
            setLineHightligher()

            updateLineColInfo(getFocusedLineIndexPosition())
        }
    }
})



// ====================================================== //
//              Feature: Toggle Fullscreen                //
// ====================================================== //

const btn = document.querySelector('.fullscreenToggle')
btn.addEventListener('click', () => {
    btn.classList.toggle('active')
    container.classList.toggle('fullscreen')
    setHeightCodeInput(linesCount)
})



// ====================================================== //
//            Feature : select code with mouse            //
// ====================================================== //


codeInput.addEventListener('pointermove', (e) => {
    
    if (e.buttons == 1) {
            setEditableTrue(codeInput)
    } else
        if (e.buttons != 1 && window.getSelection().type == 'Range') {
            if (!document.querySelector('.copy-btn-popup'))
                createCopySelectionButton(e)
    } else
        {
            setEditableFalse(codeInput)
    }
    
})


codeInput.addEventListener('keydown', (e) => {
    let key = [8, 13, 35, 36, 37, 38, 39, 40, 46]
    if (key.includes(e.keyCode)) {
        setLineHightligher()
    }
})



// ====================================================== //
//     Feature: display Line and Column position info     //
// ====================================================== //

codeInput.addEventListener('click', (e) => {
    if (e.target.localName == 'code'){
        setLineHightligher() 
        updateLineColInfo(getFocusedLineIndexPosition())
    }
})

codeInput.addEventListener('keyup', () => {
        updateLineColInfo(getFocusedLineIndexPosition())
})


// ====================================================== //
//                  Paste Event Handler                   //
// ====================================================== //

// paste text into multi line and remove text formater :

// by default, if user paste text, the text format will be pasted
// it must be prevented

// if user copy multi line and paste it, it will just be one line
// it must be separated by spliting into array, 
// and create a new line for each array

codeWrapper.addEventListener('paste', e => {
    e.preventDefault()

    let textArr = e.clipboardData.getData("text").split("\n")

    if (textArr.length == 1){
        let selection = window.getSelection()
            selection.getRangeAt(0).insertNode(document.createTextNode(textArr[0]))
                selection.collapseToEnd()

    } else {
        for (let i in textArr) {
            if (i == 0) {
                let selection = window.getSelection()
                    selection.getRangeAt(0).insertNode(document.createTextNode(textArr[0]))
            } else {
                createNewLineCode(e, textArr[i])
            }
        }

        codeInput.lastElementChild.focus()
        setCaretPosition()

    }

    setLineHightligher()
    
    codeWrapper.scrollTo(codeWrapper.scrollWidth, 0)
})










// ====================================================== //
//                                                        //
//                    CONSOLE SCRIPT                      //
//                                                        //
//  Source :                                              //
//  https://github.com/kurnia-dev/javascript-console/     //
//                                                        //
//                                                        //
// ====================================================== //




// ====================================================== //
//               Console Functions start here             //
// ====================================================== //

let openConsole = () => {
    openConsoleBtn.style.opacity = 0
    consoleWrapper.style.height = heightBeforeClosed + 'px'   
}

function resize() {
    consoleInput.style.height = 'auto' // to reset the height 
    consoleInput.style.height = (consoleInput.scrollHeight) + 'px' // then set again the height
}

// override the default clear() method
function clear() { 
    console.log('called');
    consoleHistory.innerHTML = ""
    // Array.from(consoleHistory.children).forEach(child => {
    //     child.remove()
    // })
}

// override the default console.log() method
// const console = { 
//     log(val) {
//         return eval(val)
//     }
// }

// add the code inputed and its result to Console-history element 
// as a new children element

function addToHistory(code, output) {
    let consoleOutput = document.createElement('div')
    consoleOutput.classList.add('console-output')
    consoleOutput.innerHTML = String(output)

    if (output instanceof Error) { // to check if the output is from error catch
        consoleOutput.classList.add('error')
    } else if (output == undefined || output == null) {
        consoleOutput.classList.add('undefined')
    } 

    let consoleInput = document.createElement('div')
    consoleInput.classList.add('console-input')
    consoleInput.innerText = code // using innertext to maintain the breaking line
    if (code != 'clear()') {
        consoleHistory.append(consoleInput, consoleOutput)
    }
    // only append if code is not clear()
    // if code is clear(), it will delete all history element
}




// ====================================================== //
//                resize consoleInput height              //
// ====================================================== //

window.onload = resize() // to maintain the height, 
// becase the textarea consoleInput value not lost after page load

consoleInput.addEventListener('input', () => resize()) 


// ======================================================================= //
//          Combine all code inputed to string to be executed again        //
// ======================================================================= //

let codeHistory = '' // here i make a variable to store all inputed code
// every new input will be combined to the old input
// then all inputed code will executed together
// by doing this, if we enter a new line of code, the value will be saved and can be used again
// e.g:
// 1st input => let a = 2  *it will declare variable 'a', the value can be used again in the next input
// 2nd input => a + 2 * now, the old value of 'a' is 2, then sum old 'a' with '2', 'a' is now '4'
// the 'a' value can be used again and again

// ======================================================================= //

consoleInput.addEventListener('keydown', (e) => {
    if (e.key == 'Tab') {
        e.preventDefault() // by default tab key is for change elements focus
        
        // to add indent if tab key pressed
        caretPos = e.target.selectionStart // caret is the cursor/text pointer, it will return the index position of caret from the string
        let val = consoleInput.value

        consoleInput.value = // it will insert tab (space) into the caret position
            val.substring(0, caretPos) 
            + "    " +  // tab size = 4 space
            val.substring(caretPos)  
        consoleInput.setSelectionRange(caretPos + 4, caretPos + 4) // here caretPos + 4 (relative to tab size)
        
    }

    if (!e.shiftKey && e.key == 'Enter') {   
        e.preventDefault() // to prevent new line on Enter Key Pressed

        if (!!consoleInput.value) { // if text area is not empty. then ...
            let code = consoleInput.value
            let output
            try {
                eval(codeHistory + '\n' + code) // here i try evaluate codeHistory + new code, 
                // if the eval() generates error, the codes bellow will not executed, 
                // the error message will be catched and asigned to output
                if (code != 'clear()') codeHistory += '\n' + code // prevent clear() added to codehistory
                // because, it will be executed every time, and console-history will always removed
                output = eval(codeHistory) // if not error, output will have eval(codeHistory) return value
            } catch (err) {
                output = err // but if eval(codeHistory) return error, the error message will be asigned to ouput
            }
    
            addToHistory(code, output) // adding to console-history element
            consoleInput.value = "" // to reset consoleInput
    
            // to automatic scroll down when press Enter and the height of console is over that the wrapper
            // to make consoleInput.console-input always visible
            let scrollHeight = consoleWrapper.scrollHeight + 2 // 2 is for the border width -> 1px top-bottom
            let height = consoleWrapper.offsetHeight // get the height of the wrapper
            consoleWrapper.scrollTo(0, (scrollHeight - height)) // to scroll down

            // save the history to sessionStorage
            saveHistory(code) 
        }

        logIndex = logHistory.length // to reset the logIndex if Enter pressed
    } 
    
    if (e.key == "ArrowUp") getHistory('up', e.target.selectionStart)
    if (e.key == "ArrowDown") getHistory('down', e.target.selectionStart)
})



// ====================================================== //
// Feature : save the console input history to array,     //
//          save into session storage                     //
//         can be accessed again with arrow up and down   //
//        like the real browser console                   //
// ====================================================== //

const logHistory = sessionStorage.getItem('logHistory') != null ? // if logHistory exist in sessionStorage
    JSON.parse(sessionStorage.getItem('logHistory')) // asign logHistory value
    : [] // else, asign empty array
 
let logIndex = logHistory.length // used in getHostory()


let saveHistory = code => { // save the log history to sessionStorage
    let logItem = sessionStorage.logHistory != null ? // if localHistory is exist
        JSON.parse(sessionStorage.logHistory) // get the last saved loghistory
        : [] // if not exist, asign empty arrau
    
    sessionStorage.logHistory == null ? // // if localHistory is not exist
        logHistory.push(code) // push the code into logHistory Array 
        : logItem.push(code) // else, push into logItem
    
    // either logItem or logHistory will be pushed (using setItem) into sessionStorage

    sessionStorage.getItem('logHistory') == null ?
        sessionStorage.setItem('logHistory', JSON.stringify(logHistory))
        : sessionStorage.setItem('logHistory', JSON.stringify(logItem))
    
    // to update The Loghistory Array value
    logHistory.push(code)
}




// ====================================================== //
//       Feature : load the console history               //
//                by pressing arrowUp and Down            //
// ====================================================== //

let getHistory = (direction, caretPos) => { 

    if (caretPos == consoleInput.value.length || caretPos == 0) { 
        // to load hostory only if the caret position is at the end or the begining  of the textare
        
        if (logHistory.length != 0) {
            if (direction == "up") {
                consoleInput.value = logIndex <= 0 ? // to prevent the log index have negative value
                    logHistory[0] : logHistory[--logIndex] 
            } else {
                consoleInput.value = logIndex >= logHistory.length - 1 ?   // to prevent the log index have value more than log history length
                logHistory[logHistory.length - 1] : logHistory[logIndex++]
            }
        }

    }
}


// ====================================================== //
//    Feature : Resize Console Height with Pointer drag   // 
// ====================================================== //

const resizer = document.querySelector('.resizer')

resizer.addEventListener('pointerdown', () => {
    let mainWrapperHeight = document.querySelector('.main-wrapper').offsetHeight
    consoleWrapper.style.maxHeight = mainWrapperHeight - 16 + 'px' // 16 from padding top code-wrapper

    consoleWrapper.parentElement.addEventListener('pointermove', f = (e) => {
        if (e.buttons == 1) {
            document.body.style.cursor = 'ns-resize'
            let availableSpace = e.clientY - (codeWrapper.offsetTop + container.offsetTop)
            
            if (availableSpace > 0) {
                let newConsoleHeight = mainWrapperHeight - availableSpace + 'px'
                
                consoleWrapper.style.height = 'auto'
                consoleWrapper.style.height = newConsoleHeight
            }
            
        } else {
            document.body.style.cursor = 'default'
            consoleWrapper.parentElement.removeEventListener('pointermove', f)
        }
    })    
})



// ====================================================== //
//    Feature : maximize and restore height of console    //
// ====================================================== //

const maximizeBtn = document.querySelector('.maximize')
maximizeBtn.setAttribute('title', "Maximize Console Height") 
consoleWrapper.style.transition = 'all 0.2s'
maximizeBtn.style.transition = 'all 0.2s'
let heightBeforeMaximized // it will store old height to be restored if user click again on maximizebtn

maximizeBtn.addEventListener('click', () => {
    let mainWrapperHeight = document.querySelector('.main-wrapper').offsetHeight

    if (maximizeBtn.classList.contains('true')) {
        consoleWrapper.style.height = heightBeforeMaximized + 'px'
        maximizeBtn.setAttribute('title', "Maximize Console Height")
        maximizeBtn.style.transform = "rotate(0)"
    } else {
        heightBeforeMaximized = consoleWrapper.offsetHeight
        consoleWrapper.style.maxHeight = mainWrapperHeight - 16 + 'px'
        consoleWrapper.style.height = mainWrapperHeight - 16 + 'px'
        maximizeBtn.setAttribute('title', "Restore Console Height")
        maximizeBtn.style.transform = "rotate(180deg)"
    }

    maximizeBtn.classList.toggle('true')
    // Note : 
    // this callback will change style element 
    // without add any class on CSS-- direcly from JS
    // coz, i was lazy to add new stylesheet
})



// ====================================================== //
//    Feature : Close console and open console Button     //
// ====================================================== //

const closeConsoleBtn = document.querySelector('.close-console')
closeConsoleBtn.setAttribute('title', "Close Console") 
let codeInfo = document.querySelector('.code-info')
let heightBeforeClosed

let openConsoleBtn = document.createElement('div')
    openConsoleBtn.classList.add('code-info-item', 'open-console-btn')
    openConsoleBtn.title = "Open Console (Alt + C)"
    openConsoleBtn.innerHTML = "<u>C</u>onsole"
    openConsoleBtn.style.opacity = 0
    codeInfo.prepend(openConsoleBtn)
    
closeConsoleBtn.addEventListener('click', () => {
    openConsoleBtn = document.querySelector('.open-console-btn')
    heightBeforeClosed = consoleWrapper.offsetHeight
    consoleWrapper.style.height = 0 + 'px'
    openConsoleBtn.style.opacity = 1
})

openConsoleBtn.addEventListener('click', openConsole)


// ====================================================== //
//       Feature : Open Console Shortcut (Alt + C)        //
// ====================================================== //

document.body.addEventListener('keydown', e => {
    if (openConsoleBtn.style.opacity == 1) {
        // only executed if openConsoleBtn is visible 
        // to prevent error on maximizeBtn click event
        if (e.altKey && e.key == 'c') openConsole()
    }
})





// ====================================================== //
//                      To do list                        //
// ====================================================== //


//  1 : highlighter






// ====================================================== //
//                  Unecesarry Code                       //
// ====================================================== //



// window.onload = setWidthHighlighter()
// window.addEventListener('resize', ()=> setWidthHighlighter())

// function setWidthHighlighter() {
//     let codeInputWidth = codeInput.offsetWidth
//     let lineHighlighter = document.querySelector('.line-numbers span.highlighted')
//     let _after = window.getComputedStyle(lineHighlighter, "::after")

//     lineHighlighter.style.setProperty('--width', 'auto')
//     lineHighlighter.style.setProperty('--width', codeInputWidth + 'px' )
// }