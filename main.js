const preCodeInput = document.querySelector('#codeinput')
const codeWrapper = document.querySelector('.code-wrapper')

window.onload = setWidthHighlighter()
window.addEventListener('resize', ()=> setWidthHighlighter())

function setWidthHighlighter() {
    let preCodeInputWidth = preCodeInput.offsetWidth
    let lineHighlighter = document.querySelector('.line-numbers span.highlighted')
    let _after = window.getComputedStyle(lineHighlighter, "::after")

    lineHighlighter.style.setProperty('--width', 'auto')
    lineHighlighter.style.setProperty('--width', preCodeInputWidth + 'px' )
}

setHeightTextarea()

let linesCount = preCodeInput.childElementCount




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
        setHeightTextarea(linesCount, scrollPos)
    }

    // todo : change highlighted line by arrow up and enter 

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

    // console.log(e);
    
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
        setHeightTextarea(linesCount, scrollPos)
        deleteLastLine()
    }
    
})

preCodeInput.addEventListener('input', (e) => {
    let scrollPos = document.querySelector('.code-wrapper').scrollTop
    
})


function setHeightTextarea(linesCount, scrollPos) {
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
    setWidthHighlighter()
    setHeightTextarea(linesCount)
})

function updateLineColInfo(line, col) {
    col = window.getSelection().focusOffset
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
    lineNumberList.forEach(line => {
        if (line.classList.contains('highlighted')) {
            line.classList.remove('highlighted')
        } 
    });
    
    try {
        lineNumberList[getFocusedLine()].classList.add('highlighted')
        setWidthHighlighter()
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
        updateLineColInfo(getFocusedLine(), getCaretColumnPosition())
    }
})


//  todo : update line col

// to get Cols / caret position from left

function getCaretColumnPosition() {
    try {
        let range = document.createRange()
        range.setStart(document.activeElement.childNodes[0], 0)
        range.setEnd(document.activeElement.childNodes[0], window.getSelection().focusOffset)
        
        return range.toString().length // col
    }catch{}
}

preCodeInput.addEventListener('keyup', () => {
        updateLineColInfo(getFocusedLine(), getCaretColumnPosition())
})
