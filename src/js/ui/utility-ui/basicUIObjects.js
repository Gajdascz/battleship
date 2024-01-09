const btnObj = (btnTxt, attributes = {}) => {
  return {
    type: 'button',
    text: btnTxt,
    attributes
  };
};

const divObj = (attributes = {}, children) => {
  return {
    type: 'div',
    attributes,
    children
  };
};

const paragraphObj = (text, attributes = {}) => {
  return {
    type: 'p',
    text,
    attributes
  };
};

const spanObj = (text, attributes = {}) => {
  return {
    type: 'span',
    text,
    attributes
  };
};

export { btnObj, divObj, paragraphObj, spanObj };
