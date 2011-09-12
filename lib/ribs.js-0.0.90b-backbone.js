/**
 * Ribs.js 0.0.90b backbone
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
Ribs.backbone = {};

/**
 * @namespace
 */
Ribs.backbone.mixins = Ribs.mixins.backbone = {};

/**
 * @namespace
 */
Ribs.backbone.support = {};

/**
 * @namespace
 */
Ribs.backbone.utils = {};


/*global Backbone*/

Ribs.backbone.init = function () {
    Ribs.mixins.pivot = Ribs.compose("backbone.pivot");
};


/**
 * @field
 */
Ribs.backbone.mixins.support = {};


/**
 * @field
 */
Ribs.backbone.mixins.support.model = {};


/**
 * @class
 */
Ribs.backbone.mixins.support.invalidating = {
    renderingHash: {},
    redrawHash: {},
    
    mixinInitialize: function () {
        var that = this;

        // Set up model change listeners for rendering only.
        _.each(this.renderingHash, function (attributeName, modelName) {
            that.models.get(modelName).bind("change:" + attributeName, this.render);
        });

        // Set model change listeners for invalidate+render.
        _.each(this.redrawHash, function (attributeName, modelName) {
            that.models.get(modelName).bind("change:" + attributeName, function () {
                that.invalidated = true;
                that.render();
            });
        });
    }
};


/**
 * @class
 * @requires Ribs.backbone.mixins.support.model.modelBase
 */
Ribs.backbone.mixins.support.model.modelAccess = {

    getValue: function (options) {
        var modelName = options.valueModelName,
            attributeName = options.valueAttributeName;

        if (!modelName || !attributeName || !this.models) {
            return;
        }

        if (!this.models.attributes.hasOwnProperty(modelName)) {
            Ribs.throwError("modelNotFound", "" + modelName);
            return;
        }
        if (!this.models.get(modelName).attributes.hasOwnProperty(attributeName)) {
            Ribs.throwError("attributeNotFound", "model=" + modelName + ", attribute=" + attributeName);
            return;
        }
        return this.models.get(modelName).get(attributeName);
    },

    setValue: function (options) {
        var modelName = options.valueModelName,
            attributeName = options.valueAttributeName,
            value = options.value,
            newValues;

        if (!modelName || !attributeName) {
            return;
        }

        if (!this.models.attributes.hasOwnProperty(modelName)) {
            Ribs.throwError("modelNotFound", modelName);
            return;
        }
        newValues = {};
        newValues[attributeName] = value;
        this.models.get(modelName).set(newValues);
    }
};


/**
 * @class
 */
Ribs.backbone.mixins.support.model.modelBase = {
    backboneModels: null,
    createInternalModel: true,
    inheritingMethods: ["modelRemoved", "modelAdded"],

    mixinInitialize: function () {
        var backboneModels = this.backboneModels || {};

        if (this.createInternalModel) {
            backboneModels = _.extend({
                internal: new Backbone.Model()
            }, backboneModels);
        }

        if (this.models) {
            this.models.set(backboneModels);
        } else {
            this.models = new Backbone.Model(backboneModels);
        }

        this.models.bind("change", _.bind(function () { this.modelChangeHandler(); }, this));

        if (_.isFunction(this.modelAdded)) {
            _.each(this.models.attributes, _.bind(function (model, name) {
                this.modelAdded(name, model);
            }, this));
        }
    },

    modelChangeHandler: function () {
        var previousAttributes = this.models.previousAttributes(),
            changedAttributes = this.models.changedAttributes(),
            broadcastChange = _.bind(function (value, key) {
                if (this.models.previous(key) && _.isFunction(this.modelRemoved)) {
                    this.modelRemoved(key, this.models.previous(key));
                }
                if (this.models.get(key) && _.isFunction(this.modelAdded)) {
                    this.modelAdded(key, this.models.get(key));
                }
            }, this);

        // Backbone changedAttributes() does not include any
        // deleted ones. Check for them manually.
        for (var key in previousAttributes) {
            if (previousAttributes.hasOwnProperty(key) &&
                    !this.models.attributes.hasOwnProperty(key) &&
                    _.isFunction(this.modelRemoved)) {
                this.modelRemoved(key, this.models.previous(key));
            }
        }
        if (changedAttributes) {
            _.each(changedAttributes, broadcastChange);
        }
    }
};


/**
 * @class
 * @requires Ribs.backbone.mixins.support.model.modelBase
 */
Ribs.backbone.mixins.support.model.modelJSON = {
    getModelJSON: function (options) {
        var json,
            modelName = options.jsonModelName || options.modelName;

        if (!modelName || !this.models) {
            return;
        }

        if (_.isArray(modelName)) {
            json = {};
            for (var i = 0; i < modelName.length; i++) {
                _.extend(json, this.getModelJSON({ jsonModelName: modelName[i] }));
            }
        } else {
            if (!this.models.attributes.hasOwnProperty(modelName)) {
                Ribs.throwError("modelNotFound", "" + modelName);
                return;
            }
            json = this.models.get(modelName).toJSON();
        }
        return json;
    }
};


/**
 * @class
 * @requires Ribs.backbone.mixins.support.model.modelBase
 * @requires Ribs.backbone.mixins.support.model.modelAccess
 * @requires Ribs.backbone.mixins.support.model.modelJSON
 */
Ribs.export("backbone.support.modelSupport", [
    "backbone.support.model.modelBase",
    "backbone.support.model.modelAccess",
    "backbone.support.model.modelJSON",
    "backbone.support.model.supportModel"
]);


/**
 * @class
 * @requires Ribs.mixins.support.modelChooser
 */
Ribs.backbone.mixins.support.model.supportModel = {
    supportModelName: "support",
    useSupportModel: true,

    myModelAdded: function (model) {
        if (this.useSupportModel && this.supportModelName) {
            var values = {};
            values[this.supportModelName] = model.supportModel;
            this.models.set(values);
        }
    },

    myModelRemoved: function (model) {
        if (this.useSupportModel && this.supportModelName) {
            this.models.unset(this.supportModelName);
        }
    }
};


/**
 * @class
 */
Ribs.export("backbone.pivot", [
    "pivot",
    "backbone.support.modelSupport",
    "backbone.support.invalidating",
    "support.modelChooser",
    "support.initializing"
]);


/**
 * @class
 */
Ribs.export("backbone.simpleList", [
    "support.parent",
    "backbone.support.modelSupport",
    "support.modelChooser",
    {
        itemRenderer: null,
        listRendererModelName: "data",

        redraw: function () {
            $(this.el).html("");
        },
        refresh: function () {
            _.each(this._listViews, _.bind(function (view) {
                view.render();
                $(this.el).append(view.el);
            }, this));
        },
        myModelAdded: function (model) {
            model.bind("add", this.listAdd);
            model.bind("remove", this.listRemove);
            model.bind("refresh", this.listRefresh);
            this.listRefresh();
        },
        myModelRemoved: function (model) {
            if (this._listViews) {
                _.each(this._listViews, function (view) {
                    if (_.isFunction(view.dispose)) {
                        view.dispose();
                    }
                });
                this._listViews = {};
            }
            model.unbind("add", this.listAdd);
            model.unbind("remove", this.listRemove);
            model.unbind("refresh", this.listRefresh);
        },
        listAdd: function (item) {
            if (!this._listViews.hasOwnProperty(item.cid)) {
                var models = {}, itemView;
                models[this.listRendererModelName] = item;
                itemView = _.extend({}, this.itemRenderer, {
                    backboneModels: models
                });
                itemView.mixinInitialize();
                this._listViews[item.cid] = itemView;
                this.pivot.requestInvalidate();
            }
        },
        listRemove: function (item) {
            if(this._listViews.hasOwnProperty(item.cid)) {
                $(this._listViews[item.cid].el).remove();
                delete this._listViews[item.cid];
            }
        },
        listRefresh: function () {
            this._listViews = {};
            if (this.myModel && _.isFunction(this.myModel.each)) {
                this.myModel.each(_.bind(this.listAdd, this));
            }
            this.pivot.requestInvalidate();
        }
    }
]);


Ribs.backbone.utils.Collection = function (models, options) {
    this.model = (options && options.model) || Backbone.Model;
    Backbone.Collection.apply(this, arguments);
};

_.extend(Ribs.backbone.utils.Collection.prototype, Backbone.Collection.prototype);


/**
 * @class
 */
Ribs.backbone.utils.Model = function(attributes, options) {
    var supportAttributes = {};
    if (_.isArray(attributes)) {
        supportAttributes = attributes[1];
        attributes = attributes[0];
    }
    Backbone.Model.apply(this, [attributes, options]);
    var supportModel = new Backbone.Model(supportAttributes);
    supportModel.bind("change", _.bind(function (ev) {
        this.trigger("support:" + ev);
    }, this));
    this.supportModel = supportModel;
};

_.extend(Ribs.backbone.utils.Model.prototype, Backbone.Model.prototype);


Ribs.backbone.utils.NonSyncingCollection = Backbone.Collection.extend({
    add: function (item) {
        var oldCollection = item.collection;
        Backbone.Collection.prototype.add.apply(this, arguments);
        item.collection = oldCollection;
    },
    remove: function (item) {
        var oldCollection = item.collection;
        Backbone.Collection.prototype.remove.apply(this, arguments);
        item.collection = oldCollection;
    }
});


Ribs.backbone.utils.createUIManager = function (key, myOptions) {
    myOptions = myOptions || {};

    Ribs.backbone.uiManagers = Ribs.backbone.uiManagers || {};

    Ribs.backbone.uiManagers[key] = (function () {
        var allowMultiselect = myOptions.allowMultiselect,
            viewModel = new Backbone.Model({ nowHovering: null, nowSelected: null }),
            hoveringChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowHovering") && !item.get("hovering")) {
                    viewModel.set({ nowHovering: null });
                } else if (item !== viewModel.get("nowHovering") && item.get("hovering")) {
                    var lastHovering = viewModel.get("nowHovering");
                    viewModel.set({ nowHovering: item });
                    if (lastHovering) {
                        lastHovering.set({ hovering: false });
                    }
                }
            },
            selectedChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowSelected") && !item.get("selected")) {
                    viewModel.set({ nowSelected: null });
                } else if (item !== viewModel.get("nowSelected") && item.get("selected")) {
                    var lastSelected = viewModel.get("nowSelected");
                    viewModel.set({ nowSelected: item });
                    if (!allowMultiselect && lastSelected) {
                         lastSelected.set({ selected: false });
                    }
                }
            },
            unregister = function (model) {
                if (model) {
                    model.unbind("ribsUI:change:hovering", hoveringChanged);
                    model.unbind("ribsUI:change:selected", selectedChanged);
                }
            },
            register = function (model) {
                if (model) {
                    unregister(model);
                    model.bind("ribsUI:change:hovering", hoveringChanged);
                    model.bind("ribsUI:change:selected", selectedChanged);
                }
            };

        return {
            register: register,
            unregister: unregister,
            getViewModel: function () { return viewModel; }
        };
    }());
};


Ribs.backbone.utils.augmentModelWithUIAttributes = function (model) {
    if (!model.hasOwnProperty("ribsUI")) {
        model.ribsUI = new Backbone.Model();
        model.ribsUI.set({ owner: model });
        model.ribsUI.bind("all", function (event) {
            var ev = "ribsUI:" + event;
            model.trigger(ev, Array.prototype.slice.call(arguments, 1));
        });
    }
};


