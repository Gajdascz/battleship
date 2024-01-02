const VIEWBOX = '0 0 24 24';
const SVGNS = 'http://www.w3.org/2000/svg';

const doubleChevronRightObj = (
  titleText = 'double chevron right',
  classAttr = 'double-chevron-right-icon',
  viewBox = VIEWBOX,
  ns = SVGNS
) => {
  return {
    type: 'svg',
    attributes: { viewBox, class: classAttr },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z'
        }
      }
    ],
    ns
  };
};

const doubleChevronLeftObj = (
  titleText = 'double chevron left',
  classAttr = 'double-chevron-left-icon',
  viewBox = VIEWBOX,
  ns = SVGNS
) => {
  return {
    type: 'svg',
    attributes: { viewBox, class: classAttr },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M18.41,7.41L17,6L11,12L17,18L18.41,16.59L13.83,12L18.41,7.41M12.41,7.41L11,6L5,12L11,18L12.41,16.59L7.83,12L12.41,7.41Z'
        }
      }
    ],
    ns
  };
};
const homeIconObj = (titleText = 'home', classAttr = 'home-icon', viewBox = VIEWBOX, ns = SVGNS) => {
  return {
    type: 'svg',
    attributes: { viewBox, class: classAttr },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: { d: 'M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z' }
      }
    ],
    ns
  };
};
const profileIconObj = (titleText = 'profile', classAttr = 'profile-icon', viewBox = VIEWBOX, ns = SVGNS) => {
  return {
    type: 'svg',
    attributes: {
      viewBox,
      class: classAttr
    },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z'
        }
      }
    ]
  };
};
const cogIconObj = (titleText = 'cog', classAttr = 'cog-icon', viewBox = VIEWBOX, ns = SVGNS) => {
  return {
    type: 'svg',
    attributes: {
      viewBox,
      class: classAttr
    },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z'
        }
      }
    ]
  };
};
const newspaperIconOneObj = (titleText = 'newspaper', classAttr = 'newspaper-icon', viewBox = VIEWBOX, ns = SVGNS) => {
  return {
    type: 'svg',
    attributes: {
      viewBox,
      class: classAttr
    },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M20 5L20 19L4 19L4 5H20M20 3H4C2.89 3 2 3.89 2 5V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V5C22 3.89 21.11 3 20 3M18 15H6V17H18V15M10 7H6V13H10V7M12 9H18V7H12V9M18 11H12V13H18V11Z'
        }
      }
    ]
  };
};
const deltaIconObj = (titleText = 'delta', classAttr = 'delta-icon', viewBox = VIEWBOX, ns = SVGNS) => {
  return {
    type: 'svg',
    attributes: {
      viewBox,
      class: classAttr
    },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M12,7.77L18.39,18H5.61L12,7.77M12,4L2,20H22'
        }
      }
    ]
  };
};
const chemicalWeaponIconObj = (
  titleText = 'chemical weapon',
  classAttr = 'chemical-weapon-icon',
  viewBox = VIEWBOX,
  ns = SVGNS
) => {
  return {
    type: 'svg',
    attributes: {
      viewBox,
      class: classAttr
    },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M11,7.83C9.83,7.42 9,6.3 9,5A3,3 0 0,1 12,2A3,3 0 0,1 15,5C15,6.31 14.16,7.42 13,7.83V10.64C12.68,10.55 12.35,10.5 12,10.5C11.65,10.5 11.32,10.55 11,10.64V7.83M18.3,21.1C17.16,20.45 16.62,19.18 16.84,17.96L14.4,16.55C14.88,16.09 15.24,15.5 15.4,14.82L17.84,16.23C18.78,15.42 20.16,15.26 21.29,15.91C22.73,16.74 23.22,18.57 22.39,20C21.56,21.44 19.73,21.93 18.3,21.1M2.7,15.9C3.83,15.25 5.21,15.42 6.15,16.22L8.6,14.81C8.76,15.5 9.11,16.08 9.6,16.54L7.15,17.95C7.38,19.17 6.83,20.45 5.7,21.1C4.26,21.93 2.43,21.44 1.6,20C0.77,18.57 1.26,16.73 2.7,15.9M14,14A2,2 0 0,1 12,16C10.89,16 10,15.1 10,14A2,2 0 0,1 12,12C13.11,12 14,12.9 14,14M17,14L16.97,14.57L15.5,13.71C15.4,12.64 14.83,11.71 14,11.12V9.41C15.77,10.19 17,11.95 17,14M14.97,18.03C14.14,18.64 13.11,19 12,19C10.89,19 9.86,18.64 9.03,18L10.5,17.17C10.96,17.38 11.47,17.5 12,17.5C12.53,17.5 13.03,17.38 13.5,17.17L14.97,18.03M7.03,14.56L7,14C7,11.95 8.23,10.19 10,9.42V11.13C9.17,11.71 8.6,12.64 8.5,13.7L7.03,14.56Z'
        }
      }
    ]
  };
};
const forumIconObj = (titleText = 'forum', classAttr = 'forum-icon', viewBox = VIEWBOX, ns = SVGNS) => {
  return {
    type: 'svg',
    attributes: {
      viewBox,
      class: classAttr
    },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M17,12V3A1,1 0 0,0 16,2H3A1,1 0 0,0 2,3V17L6,13H16A1,1 0 0,0 17,12M21,6H19V15H6V17A1,1 0 0,0 7,18H18L22,22V7A1,1 0 0,0 21,6Z'
        }
      }
    ]
  };
};
const messageIconObj = (titleText = 'message', classAttr = 'message-icon', viewBox = VIEWBOX, ns = SVGNS) => {
  return {
    type: 'svg',
    attributes: {
      viewBox,
      class: classAttr
    },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z'
        }
      }
    ]
  };
};

const thunderEyeObj = (titleText = 'Thunder Eye', classAttr = 'thunder-eye-icon', viewBox = VIEWBOX, ns = SVGNS) => {
  return {
    type: 'svg',
    attributes: {
      viewBox,
      class: classAttr
    },
    children: [
      {
        type: 'title',
        text: titleText
      },
      {
        type: 'path',
        attributes: {
          d: 'M16,5C15.44,5 15,5.44 15,6C15,6.56 15.44,7 16,7C16.56,7 17,6.56 17,6C17,5.44 16.56,5 16,5M16,2C13.27,2 10.94,3.66 10,6C10.94,8.34 13.27,10 16,10C18.73,10 21.06,8.34 22,6C21.06,3.66 18.73,2 16,2M16,3.5A2.5,2.5 0 0,1 18.5,6A2.5,2.5 0 0,1 16,8.5A2.5,2.5 0 0,1 13.5,6A2.5,2.5 0 0,1 16,3.5M3,2V14H6V23L13,11H9L10.12,8.5C9.44,7.76 8.88,6.93 8.5,6C9.19,4.29 10.5,2.88 12.11,2H3Z'
        }
      }
    ]
  };
};

export {
  doubleChevronLeftObj,
  doubleChevronRightObj,
  homeIconObj,
  profileIconObj,
  cogIconObj,
  newspaperIconOneObj,
  deltaIconObj,
  chemicalWeaponIconObj,
  forumIconObj,
  messageIconObj,
  thunderEyeObj
};

