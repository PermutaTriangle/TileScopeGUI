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

export { downloadJson };
