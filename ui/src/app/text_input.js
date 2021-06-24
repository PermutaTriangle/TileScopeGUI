import $ from 'jquery';
import { isStr, isObj } from '../utils/utils';
import Tiling from '../combinatorics/tiling';
import { getTiling } from '../consumers/service';
import statusCode from '../consumers/status_codes';

import './styles/text_input.scss';

/**
 * A component for root input.
 */
class TextInput {
  /**
   * Get raw HTML for text input.
   */
  static getHTML() {
    // Modified version of https://codepen.io/lucasyem/pen/ZEEYKdj
    return `<div class="basis-input">
    <input type="input" placeholder="Basis" name="basis" required />
    <label for="basis" class="basis-label">Basis</label>
  </div>`;
  }

  static requestFailureMessage = 'Server unavailable';

  static inputFailureMessage = 'Invalid input';

  static statusToMessage(status) {
    if (status < 0) return TextInput.requestFailureMessage;
    return TextInput.inputFailureMessage;
  }

  static validTilingJsonInput(obj) {
    return (
      'class_module' in obj &&
      'comb_class' in obj &&
      'obstructions' in obj &&
      'requirements' in obj &&
      'assumptions' in obj
    );
  }

  /**
   * Create a text input bar. This will generate the HTML and add to parent.
   */
  constructor(parentSelector, errorMsg, callback) {
    parentSelector.append(TextInput.getHTML());
    this.selector = $('.basis-input');
    this.callback = callback;
    this.setEvents(errorMsg);
  }

  /**
   * Set events for input field.
   */
  setEvents(errorMsg) {
    // Process on enter
    $('.basis-input > input').on('keypress', async (evt) => {
      if (evt.key === 'Enter') {
        const [val, err] = TextInput.processInput(evt.target.value);
        if (err) {
          errorMsg(TextInput.inputFailureMessage);
        } else {
          const res = await getTiling(val);
          if (res.status !== statusCode.OK) {
            errorMsg(TextInput.statusToMessage(res.status));
          } else {
            this.callback(res.data);
          }
        }
      }
    });

    // Focus on label click
    $('.basis-input > label').on('click', () => {
      if (!$('.basis-input > input').val()) {
        $('.basis-input > input').trigger('focus');
      }
    });
  }

  /**
   * Validate and sanitize input.
   */
  static sanitizeInput(value) {
    const err = [null, true];
    // Convert numbers to strings
    if (Number.isInteger(value)) {
      return [value.toString(), null];
    }
    // Convert strings to 123_1432 format basis
    if (isStr(value)) {
      const res = Tiling.convertBasis(value);
      if (res) return [res, null];
      return err;
    }
    // Make sure object has tiling's jsonable attributes
    if (isObj(value) && !Array.isArray(value)) {
      if (TextInput.validTilingJsonInput(value)) {
        return [value, null];
      }
      return err;
    }
    return err;
  }

  /**
   * Parse input data.
   */
  static processInput(value) {
    const trimmed = value.trim();
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      parsed = JSON.parse(JSON.stringify(trimmed));
    }
    return TextInput.sanitizeInput(parsed);
  }

  /**
   * Remove the text input. This will clean up all DOM elements.
   */
  remove() {
    this.selector.remove();
  }
}

export default TextInput;
