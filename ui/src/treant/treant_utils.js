import $ from 'jquery';

class TreantUtils {
  /**
   * Directly updates, recursively/deeply, the first object
   * with all properties in the second object.
   */
  static inheritAttrs(applyTo, applyFrom) {
    Object.keys(applyFrom).forEach((attr) => {
      if (
        applyTo[attr] instanceof Object &&
        applyFrom[attr] instanceof Object &&
        typeof applyFrom[attr] !== 'function'
      ) {
        TreantUtils.inheritAttrs(applyTo[attr], applyFrom[attr]);
      } else {
        // eslint-disable-next-line no-param-reassign
        applyTo[attr] = applyFrom[attr];
      }
    });
    return applyTo;
  }

  /**
   * Returns a new object by merging the two supplied objects
   */
  static createMerge(obj1, obj2) {
    const newObj = {};
    if (obj1) {
      TreantUtils.inheritAttrs(newObj, TreantUtils.cloneObj(obj1));
    }
    if (obj2) {
      TreantUtils.inheritAttrs(newObj, obj2);
    }
    return newObj;
  }

  static isPrimitive(obj) {
    return Object(obj) !== obj;
  }

  static cloneObj(obj) {
    if (TreantUtils.isPrimitive(obj)) {
      return obj;
    }
    const res = new obj.constructor();
    Object.keys(obj).forEach((key) => {
      res[key] = TreantUtils.cloneObj(obj[key]);
    });
    return res;
  }

  static addEvent(el, eventType, handler) {
    $(el).on(`${eventType}.treant`, handler);
  }

  static findEl(selector, raw, parentEl) {
    const $element = $(selector, parentEl || document);
    return raw ? $element.get(0) : $element;
  }

  static addClass(element, cssClass) {
    $(element).addClass(cssClass);
  }

  static toggleClass(element, cls, apply) {
    $(element).toggleClass(cls, apply);
  }

  static setDimensions(element, width, height) {
    $(element).width(width).height(height);
  }
}

export default TreantUtils;
