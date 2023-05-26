const container = document.querySelector('.code-editor-container')
const preCodeInput = document.querySelector('#codeinput')
const codeWrapper = document.querySelector('.code-wrapper')
const consoleWrapper = document.querySelector('.console-wrapper')
const textarea = document.querySelector('#console-input')
const lineNumbersContainer = document.querySelector('.line-numbers')
let linesCount = preCodeInput.childElementCount
let caretPos = window.getSelection().focusOffset

document.body.onload = setHeightCodeInput()

preCodeInput.addEventListener('keyup', (e) => {
        caretPos = window.getSelection().focusOffset
})

function createNewLineCode(e, text) {
    let newCode = document.createElement('code')
        editableTrue(newCode)
        newCode.tabIndex = 0
        newCode.innerHTML = text ?? ''
        if (text == null){
            e.target.after(newCode)
            e.target.nextElementSibling.focus()
        } else {
            e.target.parentElement.append(newCode)
        }
        
        linesCount++
        addNewLineNumber(linesCount)
        setHeightCodeInput(linesCount)
}

preCodeInput.addEventListener('keydown', (e) => {

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
    
                let selection = window.getSelection()
                    prevEl.innerText += textAfterCaret
                    selection.setPosition(prevEl.firstChild, prevElTextLength)
                    
                    e.target.remove()
        }
    }

    if (preCodeInput.childElementCount < linesCount) {
        linesCount--
        setHeightCodeInput(linesCount)
        deleteLastLine()
    }

    if (e.ctrlKey && e.key == 'a') {
        editableTrue(preCodeInput)
        createCopySelection()
    } else if (e.key == "Backspace") {
        if (preCodeInput.getAttribute('contenteditable') == 'true') {
            linesCount = 1
            lineNumbersContainer.innerHTML = ''
            preCodeInput.innerHTML = ''
            editableFalse(preCodeInput)
            
            let newCode = document.createElement('code')
            editableTrue(newCode)
            newCode.tabIndex = 0
            newCode.innerText = ''
            newCode.classList.add('highlighted')
            preCodeInput.append(newCode)
            preCodeInput.firstElementChild.focus()

            addNewLineNumber(linesCount)
            setHeightCodeInput(linesCount)
            setLineHightligher()

            updateLineColInfo(getFocusedLine())
        }
    }
})

function setHeightCodeInput(linesCount) {
    let scrollPos = document.querySelector('.code-wrapper').scrollTop 
    let linesHeight = linesCount * 21 // 21 is lineheight (in 'px') declared in css 
    preCodeInput.style.height = 'max-content'
    let codeWrapperHeight = codeWrapper.offsetHeight
    
    preCodeInput.style.height = linesHeight + codeWrapperHeight - 64 + 'px'
    
    linesHeight < codeWrapperHeight ?
        codeWrapper.scrollTo(0, scrollPos) :
        codeWrapper.scrollBy(0, 21) // to add some space between the line adn console
}



function addNewLineNumber(linesCount) {
    let newNumber = document.createElement('span')
    newNumber.innerText = linesCount

    lineNumbersContainer.append(newNumber)
}

function deleteLastLine() {
    if (lineNumbersContainer.childElementCount > 1) {
        lineNumbersContainer.lastElementChild.remove()
    }
}


// fullscreenToggle

const btn = document.querySelector('.fullscreenToggle')
btn.addEventListener('click', () => {
    btn.classList.toggle('active')
    container.classList.toggle('fullscreen')
    setHeightCodeInput(linesCount)
})

function updateLineColInfo(line) {
    let col = window.getSelection().focusOffset
    let lineColInfo = document.querySelector('.lineColInfo')
        lineColInfo.innerText = `Ln ${++line}, Col ${++col}`
}



// to select code 
function editableTrue(el) {
    el.setAttribute('contenteditable', true)
}

function editableFalse(el) {
    el.setAttribute('contenteditable', false)
}

preCodeInput.addEventListener('pointermove', (e) => {
    
    if (e.buttons == 1) {
            editableTrue(preCodeInput)
    } else
        if (e.buttons != 1 && window.getSelection().type == 'Range') {
            if (!document.querySelector('.copy-btn-popup'))
                createCopySelection(e)
    } else
        {
            editableFalse(preCodeInput)
    }
    
})

// let lastElSelected = window.getSelection().focusNode.parentElement
// let fistElSelected = window.getSelection().baseNode.parentElement
// end

// Hightlighting the active line / line with cursor

function getFocusedLine() {
    let focusEl = document.activeElement
    let linesArr = Array.from(preCodeInput.children)
    let lineNumberHasFocus = linesArr.indexOf(focusEl)

    return lineNumberHasFocus
}

function setLineHightligher() {
    let lineNumberList = Array.from(lineNumbersContainer.children)
    let lineCodeList = Array.from(preCodeInput.children)

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
        lineNumberList[getFocusedLine()].classList.add('highlighted')
        lineCodeList[getFocusedLine()].classList.add('highlighted')
    } catch { }
    
}

preCodeInput.addEventListener('keydown', (e) => {
    let key = [8, 13, 35, 36, 37, 38, 39, 40, 46]
    if (key.includes(e.keyCode)) {
        setLineHightligher()
    }
})

preCodeInput.addEventListener('click', (e) => {
    if (e.target.localName == 'code'){
        setLineHightligher() 
        updateLineColInfo(getFocusedLine())
    }
})

preCodeInput.addEventListener('keyup', () => {
        updateLineColInfo(getFocusedLine())
})


// Console Script --> https://github.com/kurnia-dev/javascript-console/

// auto resize textarea 
window.onload = resize() // to maintain the height, becase the textarea value not lost after page load
textarea.addEventListener('input', () => resize()) 

function resize() {
    textarea.style.height = 'auto' // to reset the height 
    textarea.style.height = (textarea.scrollHeight) + 'px' // then set again the height
}

// Intruction

const info = `
<div class="info">Instruction: 
    <ul>
        <li>You can input code bellow, then press "Enter" to execute.</li>
        <li>Press "Shift + Enter" to add a new line.</li>
        <li>Type "clear()" to clear the console history</li>
        <li>
            You can also type "console.log()" to log a value of variable
            or code, but it not necessary.
            <br />
            <br />
            Just type "1 + 2" instead of "console.log(1 + 2)" it will
            generate the same result.
        </li>
        <li>Use Up and Down Arrows to get the command history.</li>
    </ul>
        <br />
        <br />
Info : Type "clear()" to clear this message!
</div>
`



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

textarea.addEventListener('keydown', (e) => {
    if (e.key == 'Tab') {
        e.preventDefault() // by default tab key is for change elements focus
        
        // to add indent if tab key pressed
        caretPos = e.target.selectionStart // caret is the cursor/text pointer, it will return the index position of caret from the string
        let val = textarea.value

        textarea.value = // it will insert tab (space) into the caret position
            val.substring(0, caretPos) 
            + "    " +  // tab size = 4 space
            val.substring(caretPos)  
        textarea.setSelectionRange(caretPos + 4, caretPos + 4) // here caretPos + 4 (relative to tab size)
        //end
    }

    if (!e.shiftKey && e.key == 'Enter') {   
        e.preventDefault() // to prevent new line on Enter Key Pressed

        if (!!textarea.value) { // if text area is not empty. then ...
            let code = textarea.value
            let output
            try {
                eval(codeHistory + '\n' + code) // here i try evaluate codeHistory + new code, 
                // if the eval() generates error, the codes bellow will not executed, 
                // the error message will be catched and asigned to output
                codeHistory += '\n' + code // if not error, then add new code to the history
                output = eval(codeHistory) // if not error, output will have eval(codeHistory) return value
            } catch (err) {
                output = err // but if eval(codeHistory) return error, the error message will be asigned to ouput
            }
    
            addToHistory(code, output) // adding to console-history element
            textarea.value = "" // to reset textarea
    
            // to automatic scroll down when press Enter and the height of console is over that the wrapper
            // to make textarea.console-input always visible
            let scrollHeight = consoleWrapper.scrollHeight + 2 // 2 is for the border width -> 1px top-bottom
            let height = consoleWrapper.offsetHeight // get the height of the wrapper
            consoleWrapper.scrollTo(0, (scrollHeight - height)) // to scroll down

            // save the history to sessionStorage
            if (code != 'clear()') saveHistory(code) // prevent clear() saved to  history
            // if clear() saved, it will be executed every time, and console-history will always removed
        }

        logIndex = logHistory.length // to reset the logIndex if Enter pressed
    } 
    
    if (e.key == "ArrowUp") getHistory('up', e.target.selectionStart)
    if (e.key == "ArrowDown") getHistory('down', e.target.selectionStart)
})

// the function bellow will add the code inputed and its result to Console-history element as new children element
const consoleHistory = document.querySelector('.console-history')

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
    if (code != 'clear()') consoleHistory.append(consoleInput, consoleOutput) // only append if code is not clear()
    // if code is clear(), it will delete all history element
}


// save the console input history to array, can be accessed again with arrow up and down
// like the real browser console
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


let getHistory = (direction, caretPos) => {//loaf the console history by pressing arrowUp and Down

    if (caretPos == textarea.value.length || caretPos == 0) { 
        // to load hostory only if the caret position is at the end or the begining  of the textare
        
        if (logHistory.length != 0) {
            if (direction == "up") {
                textarea.value = logIndex <= 0 ? // to prevent the log index have negative value
                    logHistory[0] : logHistory[--logIndex] 
            } else {
                textarea.value = logIndex >= logHistory.length - 1 ?   // to prevent the log index have value more than log history length
                logHistory[logHistory.length - 1] : logHistory[logIndex++]
            }
        }

    }
}

function clear() { // override the default clear() method
    Array.from(consoleHistory.children).forEach(child => {
        child.remove()
    })
}

// const console = { // override the default console.log() method
//     log(val) {
//         return eval(val)
//     }
// }

// to resize teh console height
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


// maximize and restore heigt of console
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
    // this callback will change style element without add any class on CSS-- 
    // direcly from JS
    // coz, i was lazy to add new stylesheet
})

// button close console and display open console
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

let openConsole = () => {
    openConsoleBtn.style.opacity = 0
    consoleWrapper.style.height = heightBeforeClosed + 'px'   
}

openConsoleBtn.addEventListener('click', openConsole)


// Open Shortcut (Alt + C)
document.body.addEventListener('keydown', e => {
    if (openConsoleBtn.style.opacity == 1) {
        // only executed if openConsoleBtn is visible 
        // to prevent error on maximizeBtn click event
        if (e.altKey && e.key == 'c') openConsole()
    }
})

// End of console script



// Popup button copy selection

function createCopySelection(e) {
        
    let copyBtn = document.createElement('span')
    copyBtn.classList.add('copy-btn-popup')
    copyBtn.title = 'Copy'
    document.querySelector('code.highlighted').append(copyBtn)
    
    container.addEventListener('click', (e) => {
        let selectedText = window.getSelection().toString()

        if (e.target.className == 'copy-btn-popup') {
            navigator.clipboard.writeText(selectedText)
        }
        
        copyBtn.remove()
        window.getSelection().removeAllRanges() 
    }, {once:true})

}


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

        preCodeInput.lastElementChild.focus()
        setCaretPosition()

    }

    setLineHightligher()
    
    codeWrapper.scrollTo(codeWrapper.scrollWidth, 0)
})


function setCaretPosition(offset) {
    let selection = window.getSelection()

        offset <= selection.focusNode.length && !!offset ? 
            selection.setPosition(selection.focusNode, caretPos) :
            selection.setPosition(selection.focusNode, selection.focusNode.length)  
}


// ============================ To do list ================================= //
// todo : highlighter

// ======================== End of To do list ============================== //





// ==========================================================================//
//                              Unecesarry Code                              //
// ==========================================================================//


// window.onload = setWidthHighlighter()
// window.addEventListener('resize', ()=> setWidthHighlighter())

// function setWidthHighlighter() {
//     let preCodeInputWidth = preCodeInput.offsetWidth
//     let lineHighlighter = document.querySelector('.line-numbers span.highlighted')
//     let _after = window.getComputedStyle(lineHighlighter, "::after")

//     lineHighlighter.style.setProperty('--width', 'auto')
//     lineHighlighter.style.setProperty('--width', preCodeInputWidth + 'px' )
// }