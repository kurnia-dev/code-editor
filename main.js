const container = document.querySelector('.code-editor-container')
const codeWrapper = document.querySelector('.code-wrapper')
const codeInput = document.querySelector('#codeinput')
const lineNumbersContainer = document.querySelector('.line-numbers')

// Varible for console start here //
const consoleWrapper = document.querySelector('.console-wrapper')
const consoleHistory = document.querySelector('.console-history')
const consoleInput = document.querySelector('#console-input')

// Console Intruction
const info = `
<div class='info'>
    Instruction:
    <ul>
        <li>You can input code below, then press 'Enter' to execute.</li>
        <li>Press 'Shift + Enter' to add a new line.</li>
        <li>Type 'clear()' to clear the console history.</li>
        <li>
            You can also type 'console.log()' to log the value of a variable
            or code, but it is not necessary.
            <br /><br />
            Just type '1 + 2' instead of 'console.log(1 + 2)'. It will
            generate the same result.
        </li>
        <li>Use the Up and Down Arrows to navigate the command history.</li>
    </ul>
    <br /><br />
    Info: Type 'clear()' to clear this message!
</div>
`

/**
 * Creates an HTML element with the specified properties.
 * @param {Object} properties - The properties object parameter.
 * @param {string} properties.name - (Required) The name of the element to create. 
 * @param {string} [properties.id] - (Optional) The ID to assign to the element.
 * @param {string|string[]} [properties.classList] - (Optional) The class(es) to add to the element.
 * @param {string} [properties.title] - (Optional) The title attribute of the element.
 * @param {string} [properties.innerHTML] - (Optional) The inner HTML content of the element.
 * @param {string} [properties.innerText] - (Optional) The inner text of the element.
 * @param {string} [properties.textContent] - (Optional) The text content of the element.
 * @param {Object} [properties.eventListener] - (Optional) The event listener configuration.
 * @param {string} properties.eventListener.eventName - The name of the event to listen to.
 * @param {Function} properties.eventListener.callback - The callback function for the event listener.
 * @param {Object} [properties.action] - (Optional) The action to perform on the target element.
 * @param {string} properties.action.target - The target element selector (e.g., '.className', '#id', 'tagName'). - Variable name e.g parentElement
 * @param {string} properties.action.type - The type of action to perform. It can be 'append', 'prepend', 'after', or 'before'.
 * @param {Object} [properties.attribute] - (Optional) The attributes to be set on the element.
 * @param {Object} [properties.style] - (Optional)The style configuration object for CSS styles.
 * 
 * @returns {HTMLElement} The created HTML element.
 * 
 * Note:
 * - The parameter object can be filled in any order.
 * - To set attributes on the element, use the `attribute` object with the format { name: 'value' }.
 * - To set stylesheet, use the `style` object width the format {property : value}
 * - The property key must follow JavaScript Style Property Rules
 * 
 * @example 
 * attribute: {
 *      type: 'text',
 *      spellcheck: 'false'
 * } 
 * 
 * @example
 * style: {
 *      color: 'red',
 *      fontSize: '16px',
 * }
 * 
 * @example
 * // using selector
 * action: {
 *      type: 'append',
 *      target: '.className',
 * }
 * 
 * @example
 * // using variable name
 * action: {
 *      type: 'append',
 *      target: parentElement,
 * }
 * 
 *
 * @example
 * const element = createElement({
 *      name: 'div', 
 *      id: 'elem', 
 *      classlist: ['firstClass', 'secondClass'], // or 'onlyOneClass' //
 *      title: 'Element Title',
 *      textContent: 'Hello World!',
 *      attribute: {
 *          contenteditable: true, 
 *          tabIndex: 0
 *      },
 *      eventListener: {
 *          eventName: 'click',
 *          callback: handleClick,
 *      },
 *      style: {
 *          textAlign: 'justify',
 *          color: 'white'
 *      }, 
 *      action: {
 *          type: 'before',
 *          target: elementVariable, or // '.elementClass'
 *      }
 * })
 */

function createElement({ name, id, classList, title, innerHTML, innerText, textContent, attribute, style, eventListener, action }) {
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
    if (innerText) el.innerText = innerText
    if (textContent) el.textContent = textContent

    if (attribute && typeof attribute === 'object') {
        for (let name in attribute) {
            el.setAttribute(name, attribute[name])
        }
    }

    if (style) {
        for (let prop in style) {
            el.style[prop] = style[prop]
        }
    }

    if (eventListener) {
      // Add event listener to the element
      // Attach the event specified in eventListener.eventName and the callback function in eventListener.callback
      el.addEventListener(eventListener.eventName, eventListener.callback)
    }
  
    if (action) {
        const { target, type } = action
        // Execute the action on the target element
        // Use the target querySelector e.g `.className` or direcly variable name e.g parentElement
        if (typeof target == 'string') {
            document.querySelector(target)[type](el)
        } else {
            target[type](el)
        }
    }
  
    return el
}
  

/**
 * Variable to track the current position of the caret within the code editor lines.
 * This value can be modified based on user actions such as input or click events. 
 * 
 * - The `caretPos` variable stores the current position of the caret within the lines of the code editor.
 * - It represents the index or offset where new content will be inserted or where actions related to the selected content will occur.
 * - The value of `caretPos` can change dynamically as the user interacts with the code editor, such as typing or clicking.
 */
let caretPos = window.getSelection().focusOffset

codeInput.addEventListener('keyup', (e) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
        caretPos = window.getSelection().focusOffset
    }
})

codeInput.addEventListener('pointerup', () => {
    caretPos = window.getSelection().focusOffset
})


/**
 * The number of lines of code in the code input of the code editor.
 * @type {number}
 */
let linesCount = codeInput.childElementCount

// ====================================================== //
//                CODE EDITOR FUNCTIONS                   //
// ====================================================== //

document.body.onload = setHeightCodeInput()

/**
 * Sets the caret position within the code editor based on the type of event.
 * This function ensures that the caret position remains consistent when using arrow keys or after a paste operation.
 * 
 * @param {string} eventType - The type of event ('keydown' or 'paste').
*/
function setCaretPosition(eventType) {
    const selection = window.getSelection()
    let focusNode = selection.focusNode
    
    // Check if the focus node is an element
    // If it is, we need to find the first child (text node) to work with
    if (focusNode instanceof Element) {
        if (focusNode.hasChildNodes()) {
            focusNode = focusNode.firstChild
        } 
    }

    const focusNodeLength = focusNode.length ?? 0

    // Handle caret position for keydown event
    // Ensure the caret position remains consistent when using arrow keys
    // If caretPos is within the length of the focus node, set the caret position accordingly
    // Otherwise, set the caret position to the end of the focus node
    if (eventType == 'keydown') {
        if (caretPos <= focusNodeLength) {
            selection.setPosition(focusNode, caretPos)
        } else {
            selection.setPosition(focusNode, focusNodeLength)  
        }
    }
    
    // Handle caret position for paste event
    // Set the caret position to the end of the focus node after a paste operation
    if (eventType == 'paste') {
        selection.setPosition(focusNode, focusNodeLength)
    }
    
}

/**
 * Adds a new line number to the line numbers container based on the current count of lines in the code editor.
 * This function is called when an Enter or paste event occurs.
 * 
 * @param {number} linesCount - The current count of lines in the code editor.
 */
function addNewLineNumber(linesCount) {
    createElement({
        name: 'span', innerText: linesCount,
        action: { type: 'append', target: lineNumbersContainer }
    })
}


function deleteLastLine() {
    if (lineNumbersContainer.childElementCount > 1) 
        lineNumbersContainer.lastElementChild.remove()
}

/**
 * Inserts a new line of code in a code input element.
 * @param {Event} e - The event object.
 * @param {string|null} text - The text to be inserted. If null, the text after the caret position will be inserted.
 * @returns {void}
 */
function insertNewLineCode(e, text = null) {
    const textAfterCaret = e.target.innerText.substring(caretPos)
    const textBeforeCaret = e.target.innerText.substring(0, caretPos)
    
    const newCode = createElement({
        name: 'code', 
        innerHTML: text || textAfterCaret,
        attribute: {
            contenteditable: true, 
            tabindex : 0
        }
    })

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

/**
 * Updates the line and column information in the lineColInfo element based on the current caret position.
 * 
 * The line number is determined by the focused line index position.
 * 
 * The column number is obtained from the caret's focus offset.
 * 
 * The updated information is displayed in the lineColInfo element in the format "Ln X, Col Y".
@returns {void}
*/
function updateLineColInfo() {
    const lineColInfo = document.querySelector('.lineColInfo');
    let line =  getFocusedLineIndexPosition()
    let col = window.getSelection().focusOffset;
    lineColInfo.innerText = `Ln ${++line}, Col ${++col}`;
}
  

/**
 * Returns the index position of the currently focused line.
 * 
 * It finds the element that currently has focus within the code input,
 * and then determines its index position among the codeInputLines.
 * 
 * The codeInputLines represent all the lines in the code input.
 * @returns {number} The index position of the currently focused line.
*/
function getFocusedLineIndexPosition() {
    const focusedLine = document.activeElement
    const codeInputLines = Array.from(codeInput.children)
    const focusedLineIndexPosition = codeInputLines.indexOf(focusedLine)

    return focusedLineIndexPosition
}


/**
 * This function is triggered when the user makes a selection.
 * It adds a copy button to the highlighted code, allowing the user to easily copy the selected text to the clipboard.
 * 
 * After copying the text or when clicked outside the button, the button is removed.
 * If user copies using  `Ctrl + c`, the button is also removed.
 * 
 * @returns {void}
 */
function createCopySelectionButton() {
    createElement({
        name: 'span', 
        classList: 'copy-btn-popup',
        title: 'Copy', 
        action: {
            type: 'append',
            target: 'code.highlighted'
        } 
    })

    container.addEventListener('pointerdown', (e) => {
        if (e.target.className == 'copy-btn-popup') copySelection() 
        deleteCopyButton() // Called if user click outside the copy button
    }, { once: true })
    
    const copySelection = () => {
        const selectedText = window.getSelection().toString()
        navigator.clipboard.writeText(selectedText)
        deleteCopyButton()
    }
    
    const deleteCopyButton = () => {
        const copyBtn = document.querySelector('.copy-btn-popup')
        if (copyBtn) copyBtn.remove()
        window.getSelection().removeAllRanges()
    }
}



/**
 * Sets the height of the code input based on the number of lines.
 * 
 * Note: 
 * - See the code implementation details inside the function.
 *
 * @param {number} linesCount - The current count of lines in the code input.
 * @returns {void}
*/
function setHeightCodeInput(linesCount) {
    const scrollPos = document.querySelector('.code-wrapper').scrollTop
    const lineElement = document.querySelector('#codeinput code')
    const lineHeight = lineElement.offsetHeight
    const totalLineHeight = linesCount * lineHeight
    const codeWrapperHeight = codeWrapper.offsetHeight
    
    // Set the height of code input to 'max-content' temporarily
    codeInput.style.height = 'max-content'
    

    // Set the final height of code input by subtracting 3 times the line height
    // This ensures that the last 3 lines remain visible when the user scrolls to the bottom
    codeInput.style.height = totalLineHeight + codeWrapperHeight - (3 * lineHeight) + 'px'
    
    // Check if the lines height is less than the code wrapper height
    // If true, scroll to the previous scroll position
    // If false, scroll by the line height to add some space between the lines and the console
    if (totalLineHeight < codeWrapperHeight) {
        codeWrapper.scrollBy(0, scrollPos)
    } else {
        codeWrapper.scrollBy(0, lineHeight)
    }
} 


/**
 * @param {boolean} status - The contenteditable status to be set (true or false)
 * @param {HTMLElement[]} listEl - The element(s) to be modified. You can pass one or more element.
 * @example 
 * setEditableStatus(true, firstEl, secondEl);
 * setEditableStatus(false, element);
 * setEditableStatus(false, ...ArrayVariable);
 * setEditableStatus(false, ...HTMLCollection);
 */
function setEditableStatus(status, ...listEl) {
    for (const el of listEl) el.setAttribute('contenteditable', status)
}



/**
 * Highlights the currently focused line in the code editor.
 * This function should be called when there is a change in focus within the code editor,
 * such as when the user clicks or interacts with a specific line.
 * 
 * It ensures that the focused line stands out visually by applying the `highlighted` class
 * to the appropriate line number and line code elements.
 * @returns {void}
 */
function setLineHightligher() {
    const lineNumberList = Array.from(lineNumbersContainer.children)
    const lineCodeList = Array.from(codeInput.children)

    lineNumberList.forEach(line => line.classList.remove('highlighted'))
    lineCodeList.forEach(code => code.classList.remove('highlighted'))
    
    const focusedLineIndex = getFocusedLineIndexPosition()
    lineNumberList[focusedLineIndex]?.classList.add('highlighted')
    lineCodeList[focusedLineIndex]?.classList.add('highlighted')
}





// ====================================================== //
//              CODE EDITOR EVENT LISTENER                //
// ====================================================== //


/**
 * Event listener for the 'keydown' event on the codeInput element.
 * Handles various keyboard inputs within the code editor.
 *
 * @param {KeyboardEvent} e - The keyboard event object.
 */
codeInput.addEventListener('keydown', (e) => {

    if (e.key == 'Enter') {
        e.preventDefault()
        insertNewLineCode(e)
    }

    
    if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        e.preventDefault()

        const target = e.key == 'ArrowDown' ?   
            e.target.nextElementSibling : 
            e.target.previousElementSibling
            
        if (target) {
            target.focus()
            setCaretPosition(e.type)
        }

    }
    

    if (e.key == 'Backspace') {
        if (window.getSelection().type == 'Caret' && caretPos == 0) {
            if (!codeInput.isContentEditable) {
                const prevEl = e.target.previousElementSibling

                if (prevEl) {
                    e.preventDefault()
        
                    const prevElTextLength = prevEl.innerText.length
                    const textAfterCaret = e.target.innerHTML
        
                    prevEl.focus()
                    prevEl.innerText += textAfterCaret
            
                    if (prevElTextLength) {
                        const selection = window.getSelection()
                        selection.setPosition(prevEl.firstChild, prevElTextLength)
                    }
                        
                    e.target.remove()
                }
            }
        }
        

        if (window.getSelection().type == 'Range') {
            if (codeInput.isContentEditable) {
                linesCount = 1
                lineNumbersContainer.innerHTML = ''
                codeInput.innerHTML = ''
                setEditableStatus(false, codeInput)
                
                createElement({
                    name: 'code', 
                    classList: 'highlighted', 
                    innerText: '',
                    attribute: {
                        contenteditable: true, 
                        tabindex: 0
                    }, 
                    action: {
                        type: 'append', 
                        target: '#codeinput'
                    }
                })
                    
                codeInput.firstElementChild.focus()
                addNewLineNumber(linesCount)
                setHeightCodeInput(linesCount)
                setLineHightligher()
                updateLineColInfo()
            }
        }
    }


    if (codeInput.childElementCount < linesCount) {
        linesCount--
        setHeightCodeInput(linesCount)
        deleteLastLine()
    }

    if (e.ctrlKey && e.key == 'a') {
        setEditableStatus(true, codeInput)
        createCopySelectionButton()
    }

    if (e.ctrlKey && e.key == 'c') {
        copySelection()
    }
    

    let key = [ // These key codes represent the keys that can potentially change the line position when pressed.
        8,   // Backspace
        13,  // Enter
        35,  // End
        36,  // Home
        37,  // Left Arrow
        38,  // Up Arrow
        39,  // Right Arrow
        40,  // Down Arrow
        46   // Delete
    ]

    if (key.includes(e.keyCode)) {
        // Trigger the setLineHightligher() function to highlight the line that is focused after one of the specified keys is pressed.
        setLineHightligher()
    }

})

// ====================================================== //
//              Feature: Toggle Fullscreen                //
// ====================================================== //

const fullscreenToggleBtn = document.querySelector('.fullscreenToggle')

fullscreenToggleBtn.addEventListener('click', () => {
    fullscreenToggleBtn.classList.toggle('active')
    container.classList.toggle('fullscreen')
    setHeightCodeInput(linesCount)
})



// ====================================================== //
//            Feature : select code with mouse            //
// ====================================================== //

codeInput.addEventListener('pointerdown', () => {
    codeInput.addEventListener('pointermove', onPointerMove)
    codeInput.addEventListener('pointerup', onPointerUp)
})


/**
 * Check if pointer button is pressed while moving.
 * Then, make the codeInput to editable to allow user select multi line code. 
 */
function onPointerMove(e) {
    if (e.buttons === 1) {
        setEditableStatus(true, codeInput)
    }
}


/**
 * If the selection type is range after pointerup occurs, 
 * this function will call createCopySelectionButton() to create copy button.
 * 
 * Then, removes the pointermove and pointerup events.
 */
function onPointerUp() {
    const copyBtn = document.querySelector('.copy-btn-popup')

    if (window.getSelection().type === 'Range') {
        if (!copyBtn) createCopySelectionButton()
    }

    setEditableStatus(false, codeInput)

    codeInput.removeEventListener('pointermove', onPointerMove)
    codeInput.removeEventListener('pointerup', onPointerUp)
}




// ====================================================== //
//     Feature: Display Line and Column position info     //
// ====================================================== //

codeInput.addEventListener('click', (e) => {
    if (e.target.localName == 'code'){
        setLineHightligher() 
        updateLineColInfo()
    }
})

codeInput.addEventListener('keyup', () => {
        updateLineColInfo()
})


// ====================================================== //
//                  Paste Event Handler                   //
// ====================================================== //

/**
 * Handles the paste event and processes the pasted text to create multiple lines without text formatting.
 * By default, when a user pastes text, the formatting is preserved. 
 * This function prevents that behavior.
 * 
 * If the user copies multiple lines and pastes them, they will be pasted as a single line.
 * This function splits the pasted text into an array and creates a new line for each element.
 * 
 * @param {ClipboardEvent} event - The paste event object.
 * @returns {void}
 */
function handlePaste(event) {
    event.preventDefault()
  
    const textArr = event.clipboardData.getData('text').split('\n')
  
    if (textArr.length == 1) {
      event.target.innerText += textArr[0]
      setCaretPosition(event.type)
    } else {
      for (let i in textArr) {
        if (i == 0) {
          event.target.innerText += textArr[0]
        } else {
          insertNewLineCode(event, textArr[i])
        }
      }
  
      codeInput.lastElementChild.focus()
      setCaretPosition(event.type)
    }
  
    setLineHightligher()
    const caretOffset = getCaretOffset() - codeInput.offsetLeft
  
    if (caretOffset > codeWrapper.offsetWidth - codeInput.offsetLeft) {
      codeWrapper.scrollTo(caretOffset, 0)
    }
}
  
codeInput.addEventListener('paste', handlePaste)
  




function getCaretOffset() {
    const selection = window.getSelection()

    if (selection.rangeCount > 0) {
        const caretRect = selection.getRangeAt(0).getBoundingClientRect()
        return caretRect.left + codeWrapper.scrollLeft
    }

    return 0
}





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

// override the default clear() method
function clear() { 
    consoleHistory.innerHTML = ''
}

// override the default console.log() method
const console = {
    log(val) {
        return eval(val)
    }
}





/**
 * Add the code inputted and its result to the console-history element as new child elements.
 * 
 * @param {string} code - The code inputted.
 * @param {*} output - The output of the code execution.
 * @returns {void}
 */
function appendToConsoleHistory(code, output) {
    // Create a new div element for the console input
    const consoleInput = createElement({
        name: 'div', 
        innerText: code, 
        classList: 'console-input'
    })

    // Create a new div element for the console output
    const consoleOutput = createElement({
        name: 'div', 
        classList: 'console-output', 
        innerHTML : String(output)
    })

    // Add 'error' class to console output if output is an instance of Error
    if (output instanceof Error) {
        consoleOutput.classList.add('error')
    }
    // Add 'undefined' class to console output if output is undefined or null
    else if (output == undefined || output == null) {
        consoleOutput.classList.add('undefined')
    } 
    
    // Append console input and console output to console history element,
    // excluding code 'clear()' which is meant to delete all history elements
    if (code != 'clear()') {
        consoleHistory.append(consoleInput, consoleOutput)
    }
}




// ====================================================== //
//                resize consoleInput height              //
// ====================================================== //

window.onload = resizeConsoleInputHeight() // to maintain the height, 
// becase the textarea consoleInput value not lost after page load

consoleInput.addEventListener('input', () => resizeConsoleInputHeight()) 

function resizeConsoleInputHeight() {
    consoleInput.style.height = 'auto' // to reset the height 
    consoleInput.style.height = consoleInput.scrollHeight + 'px' // then set again the height
}



/**
 * Combine all code inputted into a string to be executed again.
 * 
 * This variable stores all the entered code and combines it with previously entered code. 
 * By doing this, all the entered code can be executed together and reused in subsequent inputs.
 * 
 * @type {string} codeHistory - A string that stores all the entered code.
 */

let codeHistory = '' 

// ======================================================================= //

consoleInput.addEventListener('keydown', (e) => {
    if (e.key == 'Tab') {
        e.preventDefault() // by default tab key is for change elements focus
        
        // Adding indent when tab key is pressed
        const consoleCaretPos = e.target.selectionStart // caret is the cursor/text pointer, it will return the index position of caret from the string
        const val = consoleInput.value

        consoleInput.value = 
            val.substring(0, consoleCaretPos) 
            + '    ' +  // tab size = 4 spaces
            val.substring(consoleCaretPos)  
        consoleInput.setSelectionRange(consoleCaretPos + 4, consoleCaretPos + 4) // here consoleCaretPos + 4 (relative to tab size)
    }

    if (!e.shiftKey && e.key == 'Enter') {   
        e.preventDefault() // Prevents new line on Enter key pressed
        const code = consoleInput.value
        let output

        if (code) { // If the text area is not empty, then ...
            try {
                // Here, we try to evaluate codeHistory + new code.
                // If the eval() generates an error, the new code will not be combined into codeHistory to prevent errors in the future.
                eval(codeHistory + '\n' + code)
                // Prevent clear() from being added to codeHistory,
                // because it would be executed every time and console-history would always be cleared.
                if (code !== 'clear()') codeHistory += '\n' + code
                // Finally, if the above trial doesn't generate an error, output will have the value returned by eval(codeHistory).
                output = eval(codeHistory)
            } catch (err) {
                // The error message will be displayed in the console.
                output = err
            }
        
            appendToConsoleHistory(code, output) // Add the code and its output to the console-history element.
            consoleInput.value = '' // Reset the consoleInput.
        
            // Automatic scroll down when Enter is pressed and the height of console is greater than the wrapper
            // to keep consoleInput always visible.
            const scrollHeight = consoleWrapper.scrollHeight + 2 // 2 is for the border width (1px top-bottom).
            const height = consoleWrapper.offsetHeight // Get the height of the wrapper.
            consoleWrapper.scrollTo(0, (scrollHeight - height)) // Scroll down.
        
            // Save the history to sessionStorage.
            saveHistory(code)
        }
        
        logIndex = logHistory.length // Reset the logIndex if Enter is pressed.
    }
})



// ====================================================== //
// Feature : save the console input history to array,     //
//          save into session storage                     //
//         can be accessed again with arrow up and down   //
//        like the real browser console                   //
// ====================================================== //

const logHistory = JSON.parse(sessionStorage.getItem('logHistory') || '[]')
// The logHistory variable is used to store the console input history.
// It retrieves the history from session storage and parses it into an array.
// If no history is found in session storage, it assigns an empty array as the default value.


const saveHistory = (code) => {
    logHistory.push(code)
    sessionStorage.setItem('logHistory', JSON.stringify(logHistory))
}
  


// ====================================================== //
//       Feature : load the console history               //
//                by pressing arrowUp and Down            //
// ====================================================== //

let logIndex = logHistory.length - 1 

consoleInput.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowUp') getHistory('up', e.target.selectionStart, e)
    if (e.key == 'ArrowDown') getHistory('down', e.target.selectionStart)
})

const getHistory = (direction, consoleCaretPos, e) => { 
    const numLines = consoleInput.value.split('\n').length

    if (consoleCaretPos == consoleInput.value.length || consoleCaretPos == 0) {
        // Load history only if caret is at the begining or at the end of console input
        if (logHistory.length != 0) {
            // To prevent result of undefined if loghistory length is 0
            if (numLines <= 1) {
                // If numLines only one or less
                if (direction == 'up') {
                    e.preventDefault()
                    consoleInput.value = logIndex > 1
                        ? logHistory[--logIndex]
                        : logHistory[0]
                } else {
                    consoleInput.value = logIndex >= logHistory.length - 1
                        ? logHistory[logHistory.length - 1]
                        : logHistory[logIndex++]
                }
            } else {
                // If numLines is more than 1 line
                if (direction == 'up' && consoleCaretPos == 0) {
                    // Only get history if direction is up with caret at the beginning
                    consoleInput.value = logIndex <= 0
                        ? logHistory[0]
                        : logHistory[--logIndex] 
                } else if (direction == 'down' && consoleCaretPos == consoleInput.value.length) {
                    // only get history if direction down with caret at the end
                    consoleInput.value = logIndex >= logHistory.length - 1
                        ? logHistory[logHistory.length - 1]
                        : logHistory[logIndex++]
                }
                // If neither condition is met, arrow up and down will perform the default behavior
            }
        } 
    }
    
    resizeConsoleInputHeight()
}


// ====================================================== //
//    Feature : Resize Console Height with Pointer drag   // 
// ====================================================== //

const resizer = document.querySelector('.resizer')

function debounce(func, delay) {
    let timeoutId // Stores the timeout ID for the delayed execution
    return function (...args) {
      clearTimeout(timeoutId) // Clear the previous timeout
      // Set a new timeout to execute the function after the specified delay
      timeoutId = setTimeout(() => {
        func.apply(null, args) // Execute the function with the provided arguments
      }, delay)
    }
}
  
resizer.addEventListener('pointerdown', (e) => {
    let mainWrapperHeight = document.querySelector('.main-wrapper').offsetHeight
    consoleWrapper.style.maxHeight = mainWrapperHeight - 16 + 'px'
    consoleHistory.classList.add('no-select')
    const handlePointerMove = debounce((e) => {
        
        if (e.buttons === 1) {
            document.body.style.cursor = 'ns-resize'
            let availableSpace = e.clientY - (codeWrapper.offsetTop + container.offsetTop)

            if (availableSpace > 0) {
                let newConsoleHeight = mainWrapperHeight - availableSpace + 'px'

                consoleWrapper.style.height = 'auto'
                consoleWrapper.style.height = newConsoleHeight
            }
        } else {
            consoleHistory.classList.remove('no-select')
            document.body.style.cursor = 'default'
            consoleWrapper.parentElement.removeEventListener('pointermove', handlePointerMove)
        }
    }, 10)

    consoleWrapper.parentElement.addEventListener('pointermove', handlePointerMove)
})



// ====================================================== //
//    Feature : maximize and restore height of console    //
// ====================================================== //

const mainWrapper = document.querySelector('.main-wrapper')
const maximizeBtn = document.querySelector('.maximize')

maximizeBtn.setAttribute('title', 'Maximize Console Height') 
consoleWrapper.style.transition = 'all 0.2s'
maximizeBtn.style.transition = 'all 0.2s'

let heightBeforeMaximized // It will store old height to be restored if user clicks again on maximizebtn

maximizeBtn.addEventListener('click', toggleConsoleMaximized)

function maximizeConsoleHeight() {
    let mainWrapperHeight = mainWrapper.offsetHeight

    consoleWrapper.style.maxHeight = mainWrapperHeight - 16 + 'px'
    consoleWrapper.style.height = mainWrapperHeight - 16 + 'px'
    maximizeBtn.style.transform = 'rotate(180deg)'
    maximizeBtn.setAttribute('title', 'Restore Console Height')
}

function restoreConsoleHeight() {
    consoleWrapper.style.height = heightBeforeMaximized + 'px'
    maximizeBtn.style.transform = 'rotate(0)'
    maximizeBtn.setAttribute('title', 'Maximize Console Height')
}

function toggleConsoleMaximized() {
    maximizeBtn.classList.toggle('true')
    
    if (maximizeBtn.classList.contains('true')) {
        heightBeforeMaximized = consoleWrapper.offsetHeight
        maximizeConsoleHeight()
    } else {
        restoreConsoleHeight()  
    }
}

// If resize event occurs and console is maximized, 
// then set again the console height by call maximizeConsoleHeight()
window.addEventListener('resize', () => {
    if (maximizeBtn.classList.contains('true')) {
      maximizeConsoleHeight()
    }
})



// ====================================================== //
//    Feature : Close console and open console Button     //
// ====================================================== //

const closeConsoleBtn = document.querySelector('.close-console')
closeConsoleBtn.setAttribute('title', 'Close Console') 

let heightBeforeClosed
let openConsoleBtn
  
closeConsoleBtn.addEventListener('click', () => {
    heightBeforeClosed = consoleWrapper.offsetHeight
    consoleWrapper.style.height = 0 + 'px'
    createOpenConsoleBtn()
})

const createOpenConsoleBtn = () => {
    openConsoleBtn = createElement({
        name: 'div', 
        classList: ['code-info-item', 'open-console-btn'], 
        title: 'Open Console (Alt + C)', 
        innerHTML: '<u>C</u>onsole', 
        action: {
            type: 'prepend', 
            target: '.code-info'
        },
        eventListener: {
            eventName: 'click', 
            callback: () => openConsole() 
        }
    })
}

const openConsole = () => {
    if (openConsoleBtn) openConsoleBtn.remove() 
    consoleWrapper.style.height = heightBeforeClosed + 'px'   
}

// Feature : Open Console Shortcut (Alt + C)
document.body.addEventListener('keydown', e => {
    if (e.altKey && e.key == 'c') openConsole()
})





// ====================================================== //
//                      To do list                        //
// ====================================================== //


//  1 : highlighter
