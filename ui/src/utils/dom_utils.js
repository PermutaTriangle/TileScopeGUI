/**
 * Download content as a file.
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
 */
const divWrap = (id, content) => {
  const container = document.createElement('div');
  container.id = id;
  container.append(content);
  return container;
};

/**
 * Create a bootstrap accordion item.
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
 */
const bsLI = (content) => `<li class="list-group-item">${content}</li>`;

/**
 * Bootstrap unorder list with flush class.
 */
const bsULFlush = (content) => `<ul class="list-group list-group-flush">${content}</ul>`;

export { downloadJson, divWrap, accordionItem, bsLI, bsULFlush };
