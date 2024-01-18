

//                          .+%%#*******##...      
//                        .+@#==.       :+@@#=     
//                      .+%%:             .#@@%:   
// .==.                 @#-        ======-  :*@:   
//  =@@%##..           :#@=    .####@@@@@@@##-.@%=  
//  =@@@%++%%=         -@@=   =@@@@@@@@@@@@@@*=@@*  
//  =@@@# *%@@##*      -@@=  *%@@@@@@@@@@@@@@@@@@*  
//  =@@@@@@@@@@%+      -@@=  %@@@@@@*:      +%@@@*  
//  =@@@@@@@%--:       -@@=  %@@@@#-         +@@@*  
//  =@@@@@@@@@@@@@@@@@@@@@=  %@@@@*           .*.   
//  =@@@@@@@@@@*             :*@@@*                 
//  =@@@@@@@@@@@@@@@@        :*@@@*                 
//  =@@@@@@@@@@@@@@@@@@@@@#++@@@@@*                 
//  =@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*                 
//  =@@@@@@@@@@#======%@@@@@@@@@@@*                 
//  =@@%*.@@@%:        -%@@%..=%@@*                 
//  :++.  =+=            =+-    ++-  

//    ,:;######%      S@* ,:+##:     +@#,   S@%     ,#@*:,   :@@:     +@@, ::S#?     ,#@* ,:: :@@;     ,:;@@@@?:,      S@@###S::      +#S::  ::%#%      
//    ;@#;:::,,,      S@?:*#S,,      +@#,   S@%     ,#@@@%:, :@@:     +@@;:##*,,     ,@@* ?@# :@@;     ;@@:,,,%@%      S@?:::?##,      ,;#@;:S#*,,      
//     ,:####*,,      S@@@S::        +@#,   S@%     ,#@+,?@S,;@@:     +@@@@+:,       ,@@* ?@# :@@;     ;@@,   %@%      S@@#@@#,,        ,:;#@*:,        
//     ,,::::%#%      S@?,*#S,,      +@#:,,,S@?     ,#@+ ,,*#@@@:     +@@::##*,,     ,#@?,?@#,:@@;     ;@@:,,,%@%      S@?,*@#,,      ,,;##;,S#*,,      
//    ;@@@###?:,      S@* ,:+@@:     ,:+@@@@*:,     ,#@+   ,:;@@:     +@@, ::S@?      ,:%@%:+@#;:,     ,:;@@@@?:,      S@* ,:+@#,     +@#::  ,:%@%  



// ----------------------------------------------------------------------- SKUNKWORX

// BUILT ELEMENTS ARRAY
export let elements = [];

// DEFINING THE ROOT ELEMENT
let root;
let view;
export var viewData;

// LITERALS
const lit = {
  div : 'div',
  img : 'img',
  script : 'script',
  span : 'span'
}

// SKUNKWORX FUNCTIONS
export const skunkworx = {
  genKey : function(prefix) {
    !prefix ? prefix = '' : prefix;
    const key = prefix + (Math.random() + 1).toString(36).slice(2,12);
    return key;
  },
  build : function(type) {
    const element = document.createElement(type);
    return element;
  },
  add : function(elementToAdd,target) {
    target ? target.appendChild(elementToAdd) : view.appendChild(elementToAdd);
  },
  loadComponent : function(target,source) {
    const component = typeof target === 'string' ? 
    source.find(div => div.dataset.elId  === target).cloneNode(true):
    target;
    return component;
  },
  findView : function(source,target) {
    return source.find(view => view.title === target);
  },
  findComponent : function(source,target) {
    return source.find(div => div.dataset.elId === target)
  }
}


// SKUNKWORX INIT()
export function init(startingView,settings) {
  let mainContent = skunkworx.build(lit.div);
  mainContent.classList = 'app';
  mainContent.id = 'app-main';

  if (settings) {
    assignProperties(mainContent,settings);
  }

  document.body.appendChild(mainContent);
  root = mainContent;

  let appView = skunkworx.build(lit.div);
  appView.classList = 'view';
  mainContent.appendChild(appView);
  view = appView;

  let initView = skunkworx.build(lit.script);
  initView.id = 'currentView';
  initView.type = 'module';
  initView.src = startingView;
  document.body.appendChild(initView);

  loadView(startingView);
}

export function loadView(source) {
  let currentView = document.getElementById('currentView');
  currentView ? currentView.parentNode.removeChild(currentView) : null;
  
  let newView = skunkworx.build(lit.script);
  newView.id = 'currentView';
  newView.type = 'module';
  newView.src = source;
  document.body.appendChild(newView);
}

// ------------------------------------------------------------------- END SKUNKWORX


// ----------------------------------------------------------------------- EXPORT COMPONENTS


export class div {
  constructor(properties) {
    this.element = skunkworx.build(lit.div);
    assignProperties(this.element,properties);
  }
}

export class span {
  constructor(properties) {
    this.element = skunkworx.build(lit.span);
    assignProperties(this.element,properties);
  }
}

export class text {
  constructor(properties,isChild) {
    this.element = skunkworx.build(properties.tag);
    this.element.textContent = properties.textContent;
    isChild ? null : this.element.dataset.elId = properties.key;
    assignProperties(this.element,properties);
    processText(this,properties);
  }
}

export class img {
  constructor(properties) {
    this.element = skunkworx.build(lit.img);
    assignProperties(this.element,properties);
  }
}

export class modal {
  constructor(properties) {
    let activeProps = {...properties};
    delete activeProps.state;

    this.element = skunkworx.build(lit.div);
    assignProperties(this.element,activeProps);
    this.element.classList.add('modal');
  }
}

const componentTypes = {
  div : div,
  text : text,
  img : img,
  modal : modal
}

// CREATES A CUSTOMIZED INSTANCE OF AN OBJECT WITH A NEW SET OF PROPERTIES
export function inst(element,props,child) {
  let viewElement = skunkworx.loadComponent(element,elements);
  let copyElement = viewElement.cloneNode(true);
  let editChild;

  copyElement.childNodes[child] ?
  editChild = copyElement.childNodes[child] :
  editChild = copyElement;

  assignProperties(editChild,props);

  return copyElement;
}

// ------------------------------------------------------------------- END EXPORT COMPONENTS

// BUILDS/SAVES THE OBJECT FOR USE
export function defineElement(element,content) {
  !content ? content = {key : skunkworx.genKey()} : content.key = skunkworx.genKey();
  elements.push(new element(content).element);
  return content.key;
}

// GRABS A COMPONENT FROM THE LIBRARY
export function getComp(element, options) {

  let objType;
  let objSettings;

  if (!element.type) {
    objType = 'div';
    objSettings = element;
  }else {
    const { type, ...baseObj } = element;
    objType = element.type;
    objSettings = baseObj;
  }

  console.log(objSettings);

  let newObj = skunkworx.build(objType);
  assignProperties(newObj,objSettings);

  if (options) {
    assignProperties(newObj,options);
  }

  return newObj;
}

// BUILD A GROUP 
export function group(parent, children) {

  let parentObj = getComp(parent);

  children.forEach(child => {
    let addChild;
    if (Array.isArray(child)) {
      addChild = getComp(child[0],child[1]);
    }else {
      addChild = getComp(child);
    }
    parentObj.appendChild(addChild);
  })

  return parentObj;
}

// RENDERS OBJECT TO DOM
export function render(el,children,target) {

  const foundEl = typeof el === 'string' ? 
  skunkworx.loadComponent(el,elements) : 
  el;

  if (children) {
    children.forEach(child => {
      if (typeof child === 'string') {
        let foundChild = skunkworx.loadComponent(child,elements);
        skunkworx.add(foundChild,foundEl);
      }else {
        if (Array.isArray(child)) {
          let source = skunkworx.loadComponent(child[0],elements);
          let childGroup = group(child[0],child[1]);
          skunkworx.add(childGroup,foundEl);
          return;
        }
        skunkworx.add(child,foundEl);
      }
    })
  }
  skunkworx.add(foundEl,target);
}

// BUILDS A GROUP OF OBJECTS ** MIGHT REMOVE
// export function group(parent,children) {

//   const parentEl = typeof parent === 'string' ?
//   skunkworx.loadComponent(parent,elements) :
//   parent

//   children.forEach(child => {
    
//     let childEl;
//     if (typeof child === 'string') {
//       childEl = skunkworx.loadComponent(child,elements).cloneNode(true);
//     }else {
//       childEl = child;
//     }
//     skunkworx.add(childEl,parentEl);
//   });

//   return parentEl;
// }

// ADDS A RESPONSIVE PROPERTY ** NEED TO REFACTOR TO ALLOW BREAKPOINTS
export function resProp(mobile,desktop) {
  try {
    if (typeof mobile !== 'string' || typeof desktop !== 'string') {
      throw new Error('Invalid input. Both mobile and desktop values must be strings.')
    }
    return window.innerWidth <= 600 ? mobile : desktop;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// BUILDS VIEWS
export let views = [];

export function setView(viewName, layoutGroups) {
  let view = {
    title : viewName,
    content : layoutGroups
  }
  views.push(view);

  deployView(viewName);
}

// RENDERS VIEWS TO DOM
function deployView(viewName) {
  const view = skunkworx.findView(views, viewName);
  view.content.forEach(object => {

    if (typeof object !== 'string' && Array.isArray(object)) {
      render(object[0],object[1]);
    }else {
      render(object);
    }
  })

}

export function swap(currentID, newComponent) {
  let currentComponent = document.querySelector(`[data-el-id="${currentID}`);
  let parent = currentComponent.parentNode;
  // const element = document.querySelector('[data-your-attribute="your-value"]');
  parent.replaceChild(newComponent,currentComponent);
}

// ASSIGNS THE PROPERTIES OF THE OBJECT
function assignProperties(el,props) {

  let propKeys = Object.keys(props);
  propKeys.forEach(property => {
    if (property === 'key') {
      el.dataset.elId = props.key;
      return;
    }
    if (property === 'children') {
      let children = props.children;
      children.forEach(child => {
        let childElement = child[0];
        let elementToAdd = new childElement(child[1],true).element;

        skunkworx.add(elementToAdd,el);
      });
      return;
    }

    if (property === 'style') {
      let styles = Object.keys(props.style);
      styles.forEach(s => {

        if (s === 'dashedBorder') {
          borderDash(el,props.style[s]);
          return;
        }

        el.style[s] = props.style[s];
      })
      return;
    }

    if(property === 'function') {
      let functionProperties = props.function;
      functionProperties.forEach(func => {
        let action = func[0];
        let addFunc = func[1];
        el.setAttribute(action,addFunc);
      })
    }

    if (property === 'addFunc') {
      let funcProperty = props.addFunc;
      let action = funcProperty[0];
      let newFunc = funcProperty[1];
      el.addEventListener(action, function()  {
        eval.newFunc;
      })
    }

    el[property] = props[property];
  })

  return el;
}

// WILL ADD TEXT STYLING ** NOT FUNCTIONING
function processText(element,props) {

  if (props.hasOwnProperty('textContent')) {
    let text = props.textContent;
    const regex = /\${(.*?)}/g;

    // console.log(text.includes('${'));
  }
}

export function swapView(swapToView,data) {
  console.clear();
  viewData = data;
  console.log(data);

  view.id = 'exit-view';

  let newView = skunkworx.build(lit.div);
  newView.classList = 'view';
  newView.style.transform = 'translateX(100%)';
  root.appendChild(newView);

  view = newView;
  let exitView = document.getElementById('exit-view');
  loadView(swapToView);


  setTimeout(() => {
    exitView.style.transform = 'translateX(-100%)';
    view.style.transform = 'translateX(0%)';
  }, 1);

  setTimeout(() => {
    exitView.remove();
  }, 500);

}

export function addScript(src) {
  const script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
}

export function addCSS(element,style) {
  if (!element) {
    let addStyle = document.createElement('style');
    addStyle.textContent = style;
    document.head.appendChild(addStyle);
  }
}

function borderDash(element,settings) {
  let colorHash = settings.color.includes('#') ? settings.color.replace('#','%23') : settings.color;
  let styleSettings = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='${settings.borderRadius}' ry='${settings.borderRadius}' stroke='${colorHash}' stroke-width='${settings.width}' stroke-dasharray='${settings.dashArray[0]}%2c${settings.dashArray[1]}' stroke-dashoffset='${settings.offset}' stroke-linecap='square'/%3e%3c/svg%3e")`;
  element.style.backgroundImage = styleSettings;
  element.style.borderRadius = `${settings.borderRadius}px`;
}

export function rgb(color,alpha) {
  const hex = color.replace(/^#/, '');
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);

  return !alpha ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
}
