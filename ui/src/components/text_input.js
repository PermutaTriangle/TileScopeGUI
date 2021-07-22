import $ from 'jquery';

import { isStr, isObj } from '../utils/utils';
import Tiling from '../combinatorics/tiling';

import '../utils/typedefs';

import './styles/text_input.scss';

/**
 * A component for root input.
 */
class TextInput {
  // #region Static functions

  /**
   * Get raw HTML for text input.
   *
   * @returns {string} raw HTML string
   */
  static #getHTML() {
    return `<div class="basis-input">
  <input type="input" placeholder="Basis" name="basis" autocomplete="off" required />
  <label for="basis" class="basis-label">Basis</label>
</div>`;
  }

  /**
   * Check if tiling json is valid. It is not necessarily valid
   * when this returns true but just containes the required outer
   * most properties.
   *
   * @param {object} obj
   * @returns {boolean} true if object contains needed fields
   */
  static #validTilingJsonInput(obj) {
    return (
      'class_module' in obj &&
      'comb_class' in obj &&
      'obstructions' in obj &&
      'requirements' in obj &&
      'assumptions' in obj
    );
  }

  /**
   * Validate and sanitize input.
   *
   * @param {any} value
   * @returns {any[]} A tuple of [value, error]
   */
  static #sanitizeInput(value) {
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
      if (TextInput.#validTilingJsonInput(value)) {
        return [value, null];
      }
      return err;
    }
    return err;
  }

  /**
   * Parse input data.
   *
   * @param {string} value
   * @returns {any} jsonified input
   */
  static #processInput(value) {
    const trimmed = value.trim();
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      parsed = JSON.parse(JSON.stringify(trimmed));
    }
    return TextInput.#sanitizeInput(parsed);
  }

  // #endregion

  // #region Private instance variables

  #selector;

  #callback;

  // #endregion

  // #region Public functions

  /**
   * Create a text input bar. This will generate the HTML and add to parent.
   *
   * @constructor
   * @param {JQuery} parentSelector
   * @param {(msg: string) => void} errorMsg
   * @param {(data: any) => void} callback
   */
  constructor(parentSelector, errorMsg, callback) {
    parentSelector.append(TextInput.#getHTML());
    /** @type {JQuery} */
    this.#selector = $('.basis-input');
    /** @type {(data: TilingResponse) => void} */
    this.#callback = callback;
    this.#setEvents(errorMsg);
  }

  /**
   * Remove the text input. This will clean up all DOM elements.
   */
  remove() {
    this.#selector.remove();
  }

  // #endregion

  // #region Private functions

  /**
   * Set events for input field.
   *
   * @param {(msg: string) => void} errorMsg
   */
  #setEvents(errorMsg) {
    // Process on enter
    $('.basis-input > input').on('keypress', async (evt) => {
      if (evt.key === 'Enter') {
        const [val, err] = TextInput.#processInput(evt.target.value);
        if (err) {
          errorMsg('Invalid input');
        } else {
          this.#callback(val);
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

  // #endregion
}

export default TextInput;
