export const TEXT_ELEMENTS = {
  PARAGRAPH: 'p',
  SPAN: 'span',
  TEXTAREA: 'textarea',
  HEADINGS: {
    H1: 'h1',
    H2: 'h2',
    H3: 'h3',
    H4: 'h4',
    H5: 'h5',
    H6: 'h6'
  }
};
export const STRUCTURAL_ELEMENTS = {
  HTML: 'html',
  BODY: 'body',
  HEADER: 'header',
  MAIN: 'main',
  SECTION: 'section',
  ARTICLE: 'article',
  ASIDE: 'aside',
  FOOTER: 'footer',
  DIALOG: 'dialog',
  DIV: 'div',
  LISTS: {
    OL: 'ol',
    UL: 'ul',
    LI: 'li'
  }
};
export const TABLE_ELEMENTS = {
  TABLE: 'table',
  THEAD: 'thead',
  TBODY: 'tbody',
  TFOOT: 'tfoot',
  TR: 'tr',
  TH: 'th',
  TD: 'td'
};
export const INTERACTIVE_ELEMENTS = {
  BUTTON: 'button',
  SELECT: 'select',
  OPTION: 'option',
  INPUT: 'input'
};
export const FORM_ELEMENTS = {
  FORM: 'form',
  LABEL: 'label',
  FIELDSET: 'fieldset',
  LEGEND: 'legend',
  OUTPUT: 'output'
};
export const MEDIA_ELEMENTS = {
  VIDEO: 'video',
  AUDIO: 'audio',
  IMAGE: 'img',
  SVG: 'svg'
};
export const NAV_AND_META_ELEMENTS = {
  NAV: 'nav',
  ANCHOR: 'a',
  LINK: 'link',
  META: 'meta'
};
export const EMBED_ELEMENTS = {
  STYLE: 'style',
  SCRIPT: 'script',
  IFRAME: 'iframe',
  OBJECT: 'object',
  EMBED: 'embed'
};
export const INLINE_FORMATTING_ELEMENTS = {
  STRONG: 'strong',
  EM: 'em',
  B: 'b',
  I: 'i',
  MARK: 'mark',
  SMALL: 'small',
  DEL: 'del',
  INS: 'ins',
  SUB: 'sub',
  SUP: 'sup'
};

export const COMMON_ELEMENTS = {
  DIV: STRUCTURAL_ELEMENTS.DIV,
  PARAGRAPH: TEXT_ELEMENTS.PARAGRAPH,
  BUTTON: INTERACTIVE_ELEMENTS.BUTTON,
  BODY: STRUCTURAL_ELEMENTS.BODY
};
