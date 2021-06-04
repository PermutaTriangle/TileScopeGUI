import './styles/text_input.scss';

import $ from 'jquery';

class TextInput {
  static getHTML() {
    /**
     * Get raw HTML for text input.
     */
    // Edited from from https://codepen.io/lucasyem/pen/ZEEYKdj
    return `<div class="basis-input">
    <input type="input" placeholder="Basis" name="basis" required />
    <label for="basis" class="basis-label">Basis</label>
  </div>`;
  }

  constructor(parentSelector, callback) {
    /**
     * Create a text input bar. This will generate the HTML and add to parent.
     */
    parentSelector.append(TextInput.getHTML());
    this.selector = $('.basis-input');
    this.callback = callback;
    this.setEvents();
  }

  setEvents() {
    $('.basis-input > input').on('keypress', (evt) => {
      if (evt.key === 'Enter') {
        this.callback(TextInput.processInput(evt.target.value));
      }
    });

    $('.basis-input > label').on('click', () => {
      if (!$('.basis-input > input').val()) {
        $('.basis-input > input').trigger('focus');
      }
    });
  }

  static processInput(value) {
    /**
     * Parse input data.
     */
    let parsed;
    try {
      parsed = JSON.parse(value.trim());
      if (Number.isInteger(parsed)) {
        parsed = parsed.toString();
      }
    } catch (error) {
      parsed = value.trim();
    }
    // TODO: regex and extract ints
    return parsed;
  }

  remove() {
    /**
     * Remove the text input. This will clean up all DOM elements.
     */
    this.selector.remove();
  }
}

export default TextInput;
