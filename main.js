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

let linesCount = preCodeInput.value.split('\n').length

preCodeInput.addEventListener('keydown', (e) => {
    let scrollPos = document.querySelector('.code-wrapper').scrollTop

    if (e.key == 'Enter') {
        linesCount++
        addNewLineNumber(linesCount)
        setHeightTextarea(linesCount, scrollPos)
    } 
})

preCodeInput.addEventListener('input', (e) => {
    let scrollPos = document.querySelector('.code-wrapper').scrollTop

    if (preCodeInput.value.split('\n').length < linesCount) {
        linesCount--
        setHeightTextarea(linesCount, scrollPos)
        deleteLastLine()
    } 
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


// todo : change highlighted line by arrow up and enter 



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
    let caretPos = document.querySelector('.caretPos')
    caretPos.innerText = `Ln ${line}, Col ${col}`
}