const original = global.setTimeout;

export default {
  setFixedTimeoutDuration: (time) => {
    global.setTimeout = (callback) => {
      original(() => {
        callback();
      }, time);
    };
  },

  restore: () => {
    global.setTimeout = original;
  },
};
