const preCodeInput = document.querySelector('#codeinput')
const codeWrapper = document.querySelector('.code-wrapper')
let linesCount = preCodeInput.childElementCount

setHeightCodeInput()

preCodeInput.addEventListener('keydown', (e) => {
    let scrollPos = document.querySelector('.code-wrapper').scrollTop

    if (e.key == 'Enter') {
        e.preventDefault()
        let newCode = document.createElement('code')
        newCode.setAttribute('contenteditable', true)
        newCode.tabIndex = 0
        newCode.innerText = ''
        e.target.after(newCode)
        e.target.nextElementSibling.focus()
        linesCount++
        addNewLineNumber(linesCount)
        setHeightCodeInput(linesCount, scrollPos)
    }

    if (e.key == "ArrowDown") {
        try {
            e.target.nextElementSibling.focus();
        } catch { }
    }
    if (e.key == "ArrowUp") {
        try {
            e.target.previousElementSibling.focus();
        } catch { }
    }

    if (e.key == "Backspace" && !e.target.innerText) {
        try {
            e.target.previousElementSibling.focus()
        } catch { }
        
        if (e.target.previousElementSibling) {
            e.target.remove()
        }
    }

    if (preCodeInput.childElementCount < linesCount) {
        linesCount--
        setHeightCodeInput(linesCount, scrollPos)
        deleteLastLine()
    }
    
})

preCodeInput.addEventListener('input', (e) => {
    let scrollPos = document.querySelector('.code-wrapper').scrollTop
    
})


function setHeightCodeInput(linesCount, scrollPos) {
    let linesHeight = linesCount * 21 // 21 is lineheight (in 'px') declared in css 
    preCodeInput.style.height = 'max-content'
    let codeWrapperHeight = codeWrapper.offsetHeight
    
    preCodeInput.style.height = linesHeight + codeWrapperHeight - 64 + 'px'
    codeWrapper.scrollTo(0, scrollPos)
}



const lineNumbersContainer = document.querySelector('.line-numbers')
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

const container = document.querySelector('.code-editor-container')
const btn = document.querySelector('.fullscreenToggle')
btn.addEventListener('click', () => {
    btn.classList.toggle('active')
    container.classList.toggle('fullscreen')
    setHeightCodeInput(linesCount)
})

function updateLineColInfo(line) {
    let col = window.getSelection().focusOffset
    let caretPos = document.querySelector('.caretPos')
    caretPos.innerText = `Ln ${++line}, Col ${++col}`
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
        // console.log(true);
        editableTrue(preCodeInput)
    } else {
        editableFalse(preCodeInput)
    }

})
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

const consoleWrapper = document.querySelector('.console-wrapper')
const textarea = document.querySelector('#console-input')

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
        let caretPos = e.target.selectionStart // caret is the cursor/text pointer, it will return the index position of caret from the string
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
let oldHeight // it will store old height to be restored if user click again on maximizebtn

maximizeBtn.addEventListener('click', () => {
    let mainWrapperHeight = document.querySelector('.main-wrapper').offsetHeight

    if (maximizeBtn.classList.contains('true')) {
        consoleWrapper.style.height = oldHeight + 'px'
        maximizeBtn.setAttribute('title', "Maximize Console Height")
        maximizeBtn.style.transform = "rotate(0)"
    } else {
        oldHeight = consoleWrapper.offsetHeight
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

// End of console script




// ============================ To do list ================================= //
// todo : fix scroll code input on enter

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