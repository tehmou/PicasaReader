/**
 * Ribs.js 0.0.90b core
 *
 * (c) 2011 Timo Tuominen
 * Ribs.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://tehmou.github.com/ribs.js
 *
 */


 /**
 * @namespace
 */
var Ribs = {};

/**
 * @namespace
 * @desc Hash of all mixins visible to the mixin
 * parser. Add your custom ones here.
 */
Ribs.mixins = {};

/**
 * @namespace
 */
Ribs.support = {};

/**
 * @namespace
 */
Ribs.utils = {};


/**
 * c0mposer.js 0.0.2
 *
 * (c) 2011 Timo Tuominen
 * May be freely distributed under the MIT license.
 * For all details and documentation:
 * http://tehmou.github.com/c0mposer.js
 *
 */

var c0mposer;

(function () {
    c0mposer = {

        debug: false,
        library: {},

        instance: function (options) {
            return _.extend({}, c0mposer, options || {});
        },
        create: function () {
            Array.prototype.splice.apply(arguments, [0, 0, {}]);
            return this.compose.apply(this, arguments);
        },
        compose: function () {
            var obj = arguments[0];
            if (this.debug) {
                obj._lineage = obj._lineage || [undefined];
            }
            Array.prototype.splice.apply(arguments, [0, 1]);
            _.each(arguments, _.bind(function (argument) {
                this.composeOne(obj, argument);
            }, this));
            return obj;
        },
        composeOne: function (obj, srcDef) {
            var src = srcDef;
            if (_.isString(src)) {
                if (this.debug) {
                    obj._lineage.push(src);
                }
                if (_.isFunction(this.parseString)) {
                    src = this.parseString(src);
                }
            } else if (this.debug && src._lineage) {
                obj._lineage = obj._lineage.concat(src._lineage);
            }
            _.each(src, _.bind(function (value, key) {
                this.composeProperty(obj, src, key, srcDef);
            }, this));
        },
        parseString: function (string) {
            return this.findNested(this.library, string);
        },
        findNested: function (obj, path) {
            var splitPath = path.split(".");
            _.each(splitPath, _.bind(function (elem) {
                if (obj.hasOwnProperty(elem)) {
                    obj = obj[elem];
                } else {
                    this.throwError("invalidObjectPath", path);
                }
            }, this));
            return obj;
        },
        resolveKind: function (obj) {
            if (_.isArray(obj)) {
                return "array";
            } else if (_.isFunction(obj)) {
                return "function";
            } else if ( _.isString(obj) || _.isBoolean(obj) || _.isNumber(obj)) {
                return "basic";
            } else if (_.isUndefined(obj) || _.isNaN(obj) || _.isNull(obj)) {
                return "empty";
            } else {
                return "object";
            }
        },
        composeProperty: function (obj, src, prop, debugName) {
            var objKind = this.resolveKind(obj[prop]);
            var srcKind = this.resolveKind(src[prop]);
            var value;

            if (srcKind === "empty") {
                return;
            } else if (objKind === "empty") {
                value = src[prop];
            } else if (objKind === "basic" && srcKind === "basic") {
                value = src[prop];
            } else if (objKind === "array" && srcKind === "array") {
                value = this.composeArrays(obj[prop], src[prop]);
            } else if (objKind === "function" && srcKind === "function") {
                value = this.composeFunctions(obj[prop], src[prop], debugName);
            } else if (objKind === "object" && srcKind === "object") {
                value = this.composeObjects(obj[prop], src[prop]);
            } else {
                this.throwError("extendingPropertyKindMismatch", [objKind, srcKind]);
                return;
            }
            obj[prop] = value;
        },
        composeArrays: function (a, b) {
            return a.concat(b);
        },
        composeObjects: function (a, b) {
            return _.extend({}, a, b);
        },
        composeFunctions: function (a, b, debugName) {
            var stackFunction;
            if (!a.hasOwnProperty("_stack")) {
                stackFunction = this.createStackFunction();
                stackFunction.pushFunction(a);
            } else {
                stackFunction = a;
            }
            stackFunction.pushFunction(b, debugName);
            return stackFunction;
        },
        createStackFunction: function () {
            var stack = [];
            var stackFunction;
            var debug = this.debug;

            stackFunction = function () {
                for (var i = 0; i < stack.length; i++) {
                    stack[i].apply(this, arguments);
                }
            };
            stackFunction._stack = stack;
            if (debug) {
                stackFunction._lineage = [];
            }
            stackFunction.pushFunction = function (fnc, debugName) {
                if (fnc.hasOwnProperty("_stack")) {
                    this.concat(fnc);
                } else {
                    this.addOne(fnc, debugName);
                }
                return this;
            };
            stackFunction.concat = function (stackFunction) {
                Array.prototype.splice.apply(this._stack, [this._stack.length, 0].concat(stackFunction._stack));
                if (debug) {
                    Array.prototype.splice.apply(this._lineage, [this._lineage.length, 0].concat(stackFunction._lineage));
                }
                return this;
            };
            stackFunction.addOne = function (fnc, debugName) {
                this._stack.push(fnc);
                if (debug) {
                    this._lineage.push(debugName);
                }
                return this;
            };
            return stackFunction;
        },

        log: function (msg) {
            if (this.debug && typeof (console) != "undefined") {
                console.log(msg);
            }
        },
        throwError: function (msg, obj) {
            this.log("c0mposer error \"" + msg + "\", with object:");
            this.log(obj);
            throw [msg, obj];
        }
    };
})();


/**
 * @field   
 */
Ribs.enableThrowError = {
    multipleViewsForEl: true,
    modelNotFound: true,
    attributeNotFound: true,
    mixinTypeNotFound: true,
    attributeNameNotDefined: true,
    modelNameNotDefined: true,
    noCompositeMixinFoundForParsing: true,
    invalidObjectPath: true,
    addingExtendFunctionWithNonFunction: true,
    addingExtendArrayWithNonArray: true,
    extendingWithUndefinedOrNull: true,
    alreadyInitialized: true
};

/**
 * @method
 */
Ribs.throwError = function (errorType, msg) {
    if (!Ribs.enableThrowError.hasOwnProperty(errorType) || Ribs.enableThrowError[errorType]) {
        throw errorType + (typeof(msg) !== "undefined" ? ": " + msg : "");
    }
};


(function ($) {

    var methods = {
        createView: function () {
            var originalArguments = _.toArray(arguments);

            return this.each(function () {
                if (this.ribsView) {
                    Ribs.throwError("multipleViewsForEl");
                }

                var ribsView = Ribs.compose.apply(null, originalArguments);
                ribsView.el = this;

                if (_.isFunction(ribsView.mixinInitialize)) {
                    ribsView.mixinInitialize();
                }
                if (_.isFunction(ribsView.render)) {
                    ribsView.render();
                }
                this.ribsView = ribsView;
            });
        }
    };

    $.fn.ribs = function (method) {
        if (methods.hasOwnProperty(method)) {
            return methods[method].apply(this, Array.prototype.splice.call(arguments, 1));
        } else {
            $.error("Method " + method + " does not exist on jQuery.ribs");
        }
    };

}($));


Ribs.composer = c0mposer.instance({ library: Ribs.mixins });

/**
 * @method
 */
Ribs.compose = _.bind(Ribs.composer.create, Ribs.composer);

Ribs.exportQueue = [];
Ribs.export = function (name, def) {
    Ribs.exportQueue.push({ name: name, def: def });
};

(function () {
    var purgeMixin = function (obj) {
        var path = obj.name.split(".");
        var parent = Ribs.mixins;
        for (var i = 0; i < path.length - 1; i++) {
            if (!parent.hasOwnProperty(path[i])) {
                parent[path[i]] = {};
            }
            parent = parent[path[i]];
        }
        parent[_.last(path)] = Ribs.compose.apply(Ribs, obj.def);
    };

    Ribs.init = function () {
        _.each(Ribs.exportQueue, purgeMixin);
        Ribs.exportQueue = [];
    };
})();

$(function() {
    if (Ribs.autoInit === undefined || Ribs.autoInit) {
        Ribs.init();
    }
});

/**
 * @method
 */
Ribs.view = function (childrenTypes, options) {
    var view = Ribs.compose("pivot", options || {});
    view.mixinDefinitions = childrenTypes;
    return view;
};


/**
 * @field
 */
Ribs.mixins.support = {};


/**
 * @field
 */
Ribs.mixins.support.dom = {};

/**
 * @field
 */
Ribs.mixins.support.functions = {};

/**
 * @field
 */
Ribs.mixins.support.rendering = {};


/**
 * @class
 */
Ribs.mixins.support.bindAllToThis = {
    mixinInitialize: function () {
        _.bindAll(this);
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.parent
 * @requires Ribs.mixins.support.propertyInherit
 */
Ribs.mixins.support.duplicating = {
    /**
     * @field
     * @desc Array of objects to copy when initializing.
     */
    childrenTypes: [],
    
    mixinInitialize: function () {
        this.duplicate();
        this.giveHeritageToChildren();
    },
    duplicate: function () {
        this.children = [];
        _.each(this.childrenTypes, _.bind(this.createChild, this));
    },
    createChild: function (childType) {
        var mixin = Ribs.compose(childType);
        this.children.push(mixin);
    }
};


/**
 * @class
 */
Ribs.mixins.support.initializing = {
    initialized: false,
    mixinInitialize: function () {
        if (this.initialized) {
            throw Ribs.throwError("alreadyInitialized");
        }
        this.initialized = true;
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.methodInherit = {
    inheritingMethods: [],

    mixinInitialize: function () {
        this.inheritMethods();
        this.delegateToChildren("mixinInitialize", arguments);
    },
    inheritMethods: function () {
        var that = this;
        this._inheritedMethods = this._inheritedMethods || [];

        _.each(this.inheritingMethods, function (methodName) {
            if (_.indexOf(that._inheritedMethods, methodName) === -1) {
                var oldMethod = that[methodName];
                that[methodName] = function () {
                    if (_.isFunction(oldMethod)) {
                        oldMethod.apply(this, arguments);
                    }
                    this.delegateToChildren(methodName, arguments);
                };
                that._inheritedMethods.push(methodName);
            }
        });
    }
};


/**
 * @class
 * @desc Observes a model with the given name and
 * calls myModelAdded and myModelRemoved whenever
 * applicable.
 */
Ribs.mixins.support.modelChooser = {
    /**
     * @field
     * @desc Name of the model to use.
     * @default "data"
     */
    modelName: "data",

    /**
     * @method
     * @param name Name Of the model that was added.
     * @param model Model that was added.
     */
    modelAdded: function (name, model) {
        if (name && name === this.modelName) {
            this.myModel = model;
            if (_.isFunction(this.myModelAdded)) {
                this.myModelAdded(model);
            }
        }
    },

    /**
     * @method
     * @param name Name Of the model that was removed.
     * @param model Model that was removed.
     */
    modelRemoved: function (name, model) {
        if (name !== undefined && name === this.modelName) {
            this.myModel = null;
            if (_.isFunction(this.myModelRemoved)) {
                this.myModelRemoved(model);
            }
        }
    }
};


/**
 * @class
 */
Ribs.mixins.support.parent = {
    /**
     * @field
     * @default Empty array.
     */
    children: [],
    
    delegateToChildren: function (methodName, originalArguments) {
        _.each(this.children, function (mixin) {
            if (typeof(mixin[methodName]) === "function") {
                mixin[methodName].apply(mixin, originalArguments);
            }
        });
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.parsing = {
    mixinDefinitions: null,

    mixinInitialize: function () {
        if (this.mixinDefinitions) {
            Ribs.mixinParser.createCompositeFromDefinitions({
                    composite: this,
                    mixinDefinitions: this.mixinDefinitions
                });
        }
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.propertyInherit = {
    /**
     * @field
     * @default Empty array.
     */
    inheritingProperties: [],

    giveHeritageToChildren: function () {
        var that = this;
        _.each(that.children, function (child) {
            _.each(that.inheritingProperties, function (key) {
                child[key] = child[key] || that[key];
            });
        });
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.dom.element
 */
Ribs.mixins.support.dom.disposeable = {
    inheritingMethods: ["dispose"],

    /**
     * @method
     * @desc Calls $(this.el).remove();
     */
    dispose: function () {
        $(this.el).remove();
    }
};


/**
 * @class
 * @desc Create "el" in mixinInitialize if it does not already exist.
 */
Ribs.mixins.support.dom.element = {
    /**
     * @field
     * @desc Name of the tag to create, if no el was provided.
     * @default null
     */
    tagName: null,

    /**
     * @field
     * @desc If given, no element will be created, but it will
     * be used instead.
     */
    el: null,

    /**
     * @field
     */
    inheritingProperties: ["pivot"],

    mixinInitialize: function () {
        this.el = this.el || document.createElement(this.tagName || "div");
        this.pivot = this;
    }
};


(function () {
    var eventSplitter = /^(\w+)\s*(.*)$/;

    /**
     * @class
     * @desc Resolves and assigns DOM listeners for
     * events defined in events property.
     *
     * @requires Ribs.mixins.support.dom.element
     * @requires Ribs.mixins.support.rendering.renderChain
     */
    Ribs.mixins.support.dom.eventful = {
        /**
         * @field
         * @desc Hash of events to listen. Key is of form
         * "&lt;event&gt; &lt;selector&gt;" and value is the
         * name of the function to call on trigger.
         */
        events: {},

        unbindEvents: function () {
            if (this.el) {
                this.el.unbind();
            }
        },
        bindEvents: function () {
            if (!this.events || !this.el) {
                return;
            }
            _.each(this.events, _.bind(function (methodName, key) {
                var match = key.match(eventSplitter),
                        eventName = match[1], selector = match[2],
                        method = _.bind(this[methodName], this);
                if (selector === '') {
                    this.el.bind(eventName, method);
                } else {
                    this.el.delegate(selector, eventName, method);
                }
            }, this));
        }
    };
}());


/**
 * @class
 * @requires Ribs.mixins.support.dom.element
 */
Ribs.mixins.support.dom.hideable = {
    inheritingMethods: ["hide"],
    
    /**
     * @method
     * @desc Calls $(this.el).detach();
     */
    hide: function () {
        $(this.el).detach();
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.dom.element
 */
Ribs.mixins.support.dom.templated = {
    /**
     * @field
     * @desc jQuery selector for the template element.
     * @default null
     */
    templateSelector: null,

    /**
     * @field
     * @desc Plain string to use as the template.<br /><br />
     *
     * Overrides templateSelector.
     * @default null
     */
    templateString: null,

    /**
     * @field
     * @desc Template function to call when using the template.
     * Gets the model json as its first parameter.<br /><br />
     *
     * Overrides templateSelector and templateString
     * @default null
     */
    templateFunction: null,

    /**
     * @field
     * @desc If set to true, will replace the el property with the
     * template element. Otherwise replaces the contents of the el
     * with the templated element, leaving the root tag.<br /><br />
     *
     * Notice that you will have to re-append this el to DOM manually
     * in case it is overwritten.<br /><br />
     * @default false
     */
    overwriteEl: false,

    /**
     * @field
     * @desc "Data" to give to the template function. Should be
     * calculated right before rendering the template in redraw.
     */
    json: null,

    /**
     * @method
     * @desc Initializes the template based on the mentioned fields.
     */
    mixinInitialize: function () {
        if (!this.templateFunction) {
            if (this.templateSelector && !this.templateString) {
                this.templateString = $(this.templateSelector).html();
            }
            if (this.templateString) {
                this.templateFunction = _.template(this.templateString);
            }
        }
    },

    /**
     * @method
     * @desc This is where the template is applied.
     */
    redraw: function () {
        this.applyTemplate();
    },

    /**
     * @method
     */
    applyTemplate: function () {
        if (this.templateFunction) {
            if (this.overwriteEl) {
                this.el = $(this.templateFunction(this.json || {}));
            } else {
                $(this.el).html(this.templateFunction(this.json || {}));
            }
        }
    }
};


/**
 * @class
 */
Ribs.mixins.support.functions.resolveValue = function () {
    if (this.pivot && _.isFunction(this.pivot.getValue)) {
        this.value = this.pivot.getValue(this);
    }
};

/**
 * @class
 */
Ribs.mixins.support.functions.resolveJSON = function () {
    if (this.pivot && _.isFunction(this.pivot.getModelJSON)) {
        this.json = this.pivot.getModelJSON(this);
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.parent
 * @requires Ribs.mixins.support.dom.element
 */
Ribs.mixins.support.functions.resolveChildrenElements = function () {
    if (this.children && this.el) {
        var el = $(this.elementSelector, this.el);
        if (el.length === 0) {
            el = this.el;
        }
        _.each(this.children, function (mixin) {
            mixin.el = mixin.elementSelector ? $(mixin.elementSelector, el) : el;
        });
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.rendering.renderChain
 */
Ribs.mixins.support.rendering.deferredRender = {
    _renderPending: false,

    requestRender: function () {
        if (!this._renderPending) {
            this._renderPending = true;
            _.defer(_.bind(this.flushRequests, this));
        }
    },

    requestInvalidate: function () {
        this.invalidated = true;
        this.requestRender();
    },

    flushRequests: function () {
        if (this._renderPending) {
            if (_.isFunction(this.render)) {
                this.render();                
            }
            this._renderPending = false;
        }
    }
};


/**
 * @class
 * @requires Ribs.mixins.support.methodInherit
 */
Ribs.mixins.support.rendering.delegateRendering = {
    /**
     * @field
     * @default ["unbindEvents", "bindEvents", "redraw", "refresh", "hide", "dispose"]
     */
    inheritingMethods: ["unbindEvents", "bindEvents", "render", "redraw", "refresh", "hide", "dispose"]
};


/**
 * @class Creates a more sophisticated component life cycle
 * inside the render function.
 * @requires Ribs.mixins.support.initializing
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.rendering.renderChain = {
    /**
     * @field
     * @desc When calling render(), if this flag is set,
     * a redraw will occur. When redraw is finished, this
     * flag is again reset to false.
     * @default true
     */
    invalidated: true,

    /**
     * @method
     * @desc Override to Backbone.View.render.<br /><br />
     *
     * Exits if initialized flag is not set.<br /><br />
     *
     * Maintains the View life cycle of rendering. If invalidated
     * flag is set, unbinds all DOM events, calls redraw, and then
     * binds the events. After this comes always refresh,
     * regardless of the invalidated flag.
     */
    render: function () {
        if (!this.initialized) { return; }
        if (this.invalidated) {
            this.delegateToChildren("unbindEvents");
            this.delegateToChildren("redraw");
        }
        this.delegateToChildren("render");
        if (this.invalidated) {
            this.delegateToChildren("bindEvents");
            this.invalidated = false;
        }
    }
};


/**
 * @class
 */
Ribs.export("composite", [
    "support.parent",
    "support.duplicating",
    "support.methodInherit",
    "support.propertyInherit",
    "support.rendering.delegateRendering",
    {
        mixinInitialize: Ribs.mixins.support.functions.resolveChildrenElements,
        redraw: Ribs.mixins.support.functions.resolveChildrenElements
    }
]);


/**
 * @class
 * @desc Pivot mixin that is based on DOM elements. Default
 * pivot used by Ribs, though does not provide model support.
 */
Ribs.export("pivot", [
    "support.bindAllToThis",
    "support.dom.element",
    "support.parent",
    "support.rendering.renderChain",
    "support.rendering.deferredRender",
    "support.parsing",
    "support.propertyInherit",
    "support.dom.hideable",
    "support.dom.disposeable",
    "support.duplicating",
    "support.methodInherit",
    {
        mixinInitialize: Ribs.mixins.support.functions.resolveChildrenElements
    }
]);


/**
 * @class
 */
Ribs.export("plain", [
    "support.dom.eventful"
]);


/**
 * @class
 */
Ribs.export("templated", [
    { redraw: Ribs.mixins.support.functions.resolveJSON },
    { redraw: Ribs.mixins.support.functions.resolveValue },
    "support.dom.templated"
]);


/**
 * @method
 * @param parserOptions
 */
Ribs.utils.createMixinDefinitionParser = function (parserOptions) {
    parserOptions = parserOptions || {};

    var parser = { },
        parseFunction = parserOptions.parseFunction;

    parser.createCompositeFromDefinitions = function (options) {
        options = options || {};

        var composite = options.composite || parseFunction("composite"),
            mixinDefinitions = options.mixinDefinitions || [],
            childrenTypes = options.childrenTypes || [];

        composite.elementSelector = options.elementSelector;

        if (_.isArray(mixinDefinitions)) {
            var parseOne = function (value, key) {
                childrenTypes.push(parseFunction(key, value));
            };
            for (var i = 0; i < mixinDefinitions.length; i++) {
                _.each(mixinDefinitions[i], parseOne);
            }
        } else {
            var _createMixinFromDefinitions = function (nestedMixinDefinitions, elementSelector) {
                var mixin = parser.createCompositeFromDefinitions({
                    mixinDefinitions: nestedMixinDefinitions,
                    elementSelector: elementSelector
                });
                childrenTypes.push(mixin);
            };
            _.each(mixinDefinitions, _createMixinFromDefinitions);
        }
        composite.childrenTypes = childrenTypes;
        return composite;
    };

    return parser;
};

/**
 * @field
 */
Ribs.mixinParser = Ribs.utils.createMixinDefinitionParser({ parseFunction: Ribs.compose });

/**
 * @method
 */
Ribs.parse = Ribs.mixinParser.createCompositeFromDefinitions;


