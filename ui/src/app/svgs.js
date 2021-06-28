/**
 * A clipboard copy icon.
 */
const copyToClipboard = (id = null, w = 16, h = 16) => {
  // From https://icons.getbootstrap.com/icons/clipboard/
  const htmlIdentifier = id === null ? '' : `id="${id}" `;
  return `<svg ${htmlIdentifier}width="${w}" height="${h}" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>
    </svg>`;
};

/**
 * A boxed arrow.
 */
const boxedArrow = (id, rotation, w, h) => {
  const htmlIdentifier = id === null ? '' : `id="${id}" `;
  return `<svg ${htmlIdentifier} width="${w}" height="${h}" fill="currentColor" class="bi bi-arrow-left-square" viewBox="0 0 16 16">
    <g transform="rotate(${rotation} 8 8)">
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
    </g>
  </svg>`;
};

/**
 * A boxed arrow facing left.
 */
const boxedArrowW = (id = null, w = 16, h = 16) => boxedArrow(id, 0, w, h);

/**
 * A boxed arrow facing up.
 */
const boxedArrowN = (id = null, w = 16, h = 16) => boxedArrow(id, 90, w, h);

/**
 * A boxed arrow facing right.
 */
const boxedArrowE = (id = null, w = 16, h = 16) => boxedArrow(id, 180, w, h);

/**
 * A boxed arrow facing down.
 */
const boxedArrowS = (id = null, w = 16, h = 16) => boxedArrow(id, 270, w, h);

export { copyToClipboard, boxedArrowE, boxedArrowN, boxedArrowS, boxedArrowW };
