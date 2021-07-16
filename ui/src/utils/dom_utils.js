/**
 * Download content as a file.
 *
 * @param {Object} content
 * @param {string} fileName
 */
const downloadJson = (content, fileName) => {
  const a = document.createElement('a');
  const file = new Blob([JSON.stringify(content)], { type: 'text/plain' });
  a.href = URL.createObjectURL(file);
  a.download = `${fileName}.json`;
  a.click();
};

/**
 * Wrap element in div with id.
 *
 * @param {string} id
 * @param {HTMLElement} content
 * @returns {HTMLDivElement} A div with id containing the element as child
 */
const divWrap = (id, content) => {
  const container = document.createElement('div');
  container.id = id;
  container.append(content);
  return container;
};

/**
 * Create a bootstrap accordion item.
 *
 * @param {number} idx
 * @param {string} title
 * @param {string} accordionBody
 * @returns {string} BS accordion html string
 */
const accordionItem = (idx, title, accordionBody) => `<div class="accordion-item">
    <h2 class="accordion-header" id="panelsStayOpen-heading${idx}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${idx}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${idx}">
        ${title}
      </button>
    </h2>
    <div id="panelsStayOpen-collapse${idx}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${idx}">
      <div class="accordion-body">
        ${accordionBody}
      </div>
    </div>
  </div>`;

/**
 * Bootstrap list item.
 *
 * @param {string} content
 * @returns {string} BS list item
 */
const bsLI = (content) => `<li class="list-group-item">${content}</li>`;

/**
 * Bootstrap unorder list with flush class.
 *
 * @param {string} content
 * @returns {string} BS ul with flush clash
 */
const bsULFlush = (content) => `<ul class="list-group list-group-flush">${content}</ul>`;

/**
 * Generate a random id.
 *
 * @returns {string} A random unique string id.
 */
const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // eslint-disable-next-line no-bitwise
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );

export { downloadJson, divWrap, accordionItem, bsLI, bsULFlush, uuid };
