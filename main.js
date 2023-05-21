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
let linesCount = preCodeInput.childElementCount + 1


preCodeInput.addEventListener('keydown', (e) => {
    let scrollPos = document.querySelector('.code-wrapper').scrollTop

    if (e.key == 'Enter') {
        if (lineNumbersContainer.childElementCount >= 1) {
            linesCount++
            addNewLineNumber(linesCount)
            setHeightTextarea(linesCount, scrollPos)
        }
    } else if (e.key = "Backspace") {

        if (preCodeInput.childElementCount - 1 <= linesCount ) {
            if (lineNumbersContainer.childElementCount > 1) {
                setHeightTextarea(linesCount, scrollPos)
                deleteLastLine(linesCount)
                linesCount--
            }
        }
        
    }
    
})



function setHeightTextarea(linesCount, scrollPos) {
    let linesHeight = linesCount * 21 // 21 is lineheight (in 'px') declared in css 
    preCodeInput.style.height = 'max-content'
    let codeWrapperHeight = codeWrapper.offsetHeight
    
    preCodeInput.style.height = linesHeight + codeWrapperHeight - 53 + 'px'
    codeWrapper.scrollTo(0, scrollPos)
}



const lineNumbersContainer = document.querySelector('.line-numbers')
function addNewLineNumber(linesCount) {
    let newNumber = document.createElement('span')
    newNumber.innerText = linesCount

    lineNumbersContainer.append(newNumber)
}

function deleteLastLine() {
    lineNumbersContainer.lastElementChild.remove()
}


// change highlighted line by arrow up and enter