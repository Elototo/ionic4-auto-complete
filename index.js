import { Input, Output, ViewChild, ElementRef, HostListener, Component, EventEmitter, TemplateRef, Pipe, Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Platform, IonicModule } from '@ionic/angular';
import { Subject, from, Observable, noop } from 'rxjs';
import { finalize } from 'rxjs/operators';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

var AutoCompleteOptions = /** @class */ (function () {
    function AutoCompleteOptions() {
        this.animated = false;
        this.color = null;
        this.autocomplete = 'off';
        this.autocorrect = 'off';
        this.cancelButtonIcon = 'arrow-round-back';
        this.cancelButtonText = 'Cancel';
        this.clearIcon = 'close';
        this.clearInput = false;
        this.clearOnEdit = false;
        this.debounce = 250;
        this.mode = 'md';
        this.noItems = '';
        this.placeholder = 'Search';
        this.searchIcon = 'search';
        this.showCancelButton = false;
        this.spellcheck = 'off';
        this.type = 'search';
        this.value = '';
    }
    return AutoCompleteOptions;
}());

var AutoCompleteComponent = /** @class */ (function () {
    /**
     * Create a new instance
     *
     * @param platform
     */
    function AutoCompleteComponent(platform) {
        this.platform = platform;
        this.disabled = false;
        this.exclude = [];
        this.hideListOnSelection = true;
        this.location = 'auto';
        this.multi = false;
        this.options = new AutoCompleteOptions();
        this.removeButtonClasses = '';
        this.removeButtonColor = 'primary';
        this.removeButtonIcon = 'close';
        this.removeButtonSlot = 'end';
        this.removeDuplicateSuggestions = true;
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
        this.isLoading = false;
        this.showListChanged = false;
        this.keyword = '';
        this.suggestions = [];
        this._showList = false;
        this.modelChanged = new EventEmitter();
        this.itemsChange = new EventEmitter();
        this.itemRemoved = new EventEmitter();
        this.itemSelected = new EventEmitter();
        this.itemsShown = new EventEmitter();
        this.itemsHidden = new EventEmitter();
        this.ionAutoInput = new EventEmitter();
        this.autoFocus = new EventEmitter();
        this.autoBlur = new EventEmitter();
        this.options = new AutoCompleteOptions();
        this.defaultOpts = new AutoCompleteOptions();
        this.defaultOpts.clearIcon = this.platform.is('ios') ? 'close-circle' : 'close';
        this.defaultOpts.clearIcon = this.platform.is('ios') ? 'ios' : 'md';
        this.selected = [];
    }
    AutoCompleteComponent_1 = AutoCompleteComponent;
    Object.defineProperty(AutoCompleteComponent.prototype, "model", {
        get: function () {
            var model = this.selected;
            if (!this.multi && typeof this.selected.length !== 'undefined') {
                if (this.selected.length === 0) {
                    model = null;
                }
                else {
                    model = this.selected[0];
                }
            }
            return model;
        },
        // @ts-ignore
        set: function (selected) {
            if (typeof selected !== 'undefined') {
                this.selected = selected;
                this.keyword = this.getLabel(selected);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "showList", {
        // @ts-ignore
        get: function () {
            return this._showList;
        },
        // @ts-ignore
        set: function (value) {
            if (this._showList === value) {
                return;
            }
            this._showList = value;
            this.showListChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    AutoCompleteComponent.prototype.ngAfterViewChecked = function () {
        if (this.showListChanged) {
            this.showListChanged = false;
            this.showList ? this.itemsShown.emit() : this.itemsHidden.emit();
        }
    };
    /**
     * Handle document click
     *
     * @param event
     *
     * @private
     */
    AutoCompleteComponent.prototype._documentClickHandler = function (event) {
        if ((this.searchbarElem && this.searchbarElem.nativeElement && !this.searchbarElem.nativeElement.contains(event.target))
            ||
            (!this.inputElem && this.inputElem.nativeElement && this.inputElem.nativeElement.contains(event.target))) {
            this.hideItemList();
        }
    };
    /**
     * Get value from form
     *
     * @param selection
     *
     * @private
     */
    AutoCompleteComponent.prototype._getFormValue = function (selection) {
        if (selection == null) {
            return null;
        }
        var attr = this.dataProvider.formValueAttribute == null ? this.dataProvider.labelAttribute : this.dataProvider.formValueAttribute;
        if (typeof selection === 'object' && attr) {
            return selection[attr];
        }
        return selection;
    };
    /**
     * Get element's position on screen
     *
     * @param el
     *
     * @private
     */
    AutoCompleteComponent.prototype._getPosition = function (el) {
        var xPos = 0;
        var yPos = 0;
        while (el) {
            if (el.tagName === 'BODY') {
                var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = el.scrollTop || document.documentElement.scrollTop;
                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            }
            else {
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }
            el = el.offsetParent;
        }
        return {
            x: xPos,
            y: yPos
        };
    };
    /**
     * Clear current input value
     *
     * @param hideItemList
     */
    AutoCompleteComponent.prototype.clearValue = function (hideItemList) {
        if (hideItemList === void 0) { hideItemList = false; }
        this.keyword = '';
        this.selection = null;
        this.formValue = null;
        if (hideItemList) {
            this.hideItemList();
        }
        return;
    };
    /**
     * Get items for auto-complete
     *
     * @param event
     */
    AutoCompleteComponent.prototype.getItems = function (event) {
        var _this = this;
        if (this.promise) {
            clearTimeout(this.promise);
        }
        this.promise = setTimeout(function () {
            // if (event && event != undefined) {
            //     console.log(event)
            //     _this.keyword = event.detail.target.value;
            // }
            var result;
            if (_this.showResultsFirst && _this.keyword.trim() === '') {
                _this.keyword = '';
            }
            result = (typeof _this.dataProvider === 'function') ?
                _this.dataProvider(_this.keyword) : _this.dataProvider.getResults(_this.keyword);
            if (result instanceof Subject) {
                result = result.asObservable();
            }
            if (result instanceof Promise) {
                result = from(result);
            }
            if (result instanceof Observable) {
                _this.isLoading = true;
                result.pipe(finalize(function () {
                    _this.isLoading = false;
                })).subscribe(function (results) {
                    _this.setSuggestions(results);
                }, function (error) { return console.error(error); });
            }
            else {
                _this.setSuggestions(result);
            }
            _this.ionAutoInput.emit(_this.keyword);
        }, this.options.debounce);
    };
    /**
     * Get an item's label
     *
     * @param selection
     */
    AutoCompleteComponent.prototype.getLabel = function (selection) {
        if (selection == null) {
            return '';
        }
        var attr = this.dataProvider.labelAttribute;
        var value = selection;
        if (this.dataProvider.getItemLabel) {
            value = this.dataProvider.getItemLabel(value);
        }
        if (typeof value === 'object' && attr) {
            return value[attr] || '';
        }
        return value || '';
    };
    /**
     * Get current selection
     */
    AutoCompleteComponent.prototype.getSelection = function () {
        if (this.multi) {
            return this.selection;
        }
        else {
            return this.selected;
        }
    };
    /**
     * Get menu style
     */
    AutoCompleteComponent.prototype.getStyle = function () {
        var location = this.location;
        if (this.location === 'auto') {
            var elementY = this._getPosition(this.searchbarElem.nativeElement).y;
            var windowY = window.innerHeight;
            if (elementY > windowY - elementY) {
                location = 'top';
            }
            else {
                location = 'bottom';
            }
        }
        if (location === 'bottom') {
            return {};
        }
        else {
            return {
                'bottom': '37px'
            };
        }
    };
    /**
     * Get current input value
     */
    AutoCompleteComponent.prototype.getValue = function () {
        return this.formValue;
    };
    /**
     * Handle tap
     *
     * @param event
     */
    AutoCompleteComponent.prototype.handleTap = function (event) {
        if (this.showResultsFirst || this.keyword.length > 0) {
            this.getItems();
        }
    };
    /**
     * Handle tap when selecting an item
     *
     * @param $event
     * @param suggestion
     */
    AutoCompleteComponent.prototype.handleSelectTap = function ($event, suggestion) {
        this.selectItem(suggestion);
        if ($event.srcEvent) {
            if ($event.srcEvent.stopPropagation) {
                $event.srcEvent.stopPropagation();
            }
            if ($event.srcEvent.preventDefault) {
                $event.srcEvent.preventDefault();
            }
        }
        else if ($event.preventDefault) {
            $event.preventDefault();
        }
        return false;
    };
    /**
     * Hide item list
     */
    AutoCompleteComponent.prototype.hideItemList = function () {
        this.showList = this.alwaysShowList;
    };
    /**
     * Fired when the input focused
     */
    AutoCompleteComponent.prototype.onFocus = function () {
        this.getItems();
        this.autoFocus.emit();
    };
    /**
     * Fired when the input focused
     */
    AutoCompleteComponent.prototype.onBlur = function () {
        this.autoBlur.emit();
    };
    /**
     * Register onChangeCallback
     *
     * @param fn
     */
    AutoCompleteComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    /**
     * Register onTouchedCallback
     *
     * @param fn
     */
    AutoCompleteComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    /**
     * Remove already selected suggestions
     *
     * @param suggestions
     */
    AutoCompleteComponent.prototype.removeDuplicates = function (suggestions) {
        var selectedCount = this.selected ? this.selected.length : 0;
        var suggestionCount = suggestions.length;
        for (var i = 0; i < selectedCount; i++) {
            var selectedLabel = this.getLabel(this.selected[i]);
            for (var j = 0; j < suggestionCount; j++) {
                var suggestedLabel = this.getLabel(suggestions[j]);
                if (selectedLabel === suggestedLabel) {
                    suggestions.splice(j, 1);
                }
            }
        }
        return suggestions;
    };
    AutoCompleteComponent.prototype.removeExcluded = function (suggestions) {
        var excludedCount = this.exclude.length;
        var suggestionCount = this.suggestions.length;
        for (var i = 0; i < excludedCount; i++) {
            var exclude = this.exclude[i];
            var excludeLabel = this.getLabel(exclude);
            for (var j = 0; j < suggestionCount; j++) {
                var suggestedLabel = this.getLabel(suggestions[j]);
                if (excludeLabel === suggestedLabel) {
                    suggestions.splice(j, 1);
                }
            }
        }
        return suggestions;
    };
    /**
     * Remove item from selected
     *
     * @param selection
     * @param notify?
     */
    AutoCompleteComponent.prototype.removeItem = function (selection, notify) {
        var count = this.selected ? this.selected.length : 0;
        for (var i = 0; i < count; i++) {
            var item = this.selected[i];
            var selectedLabel = this.getLabel(selection);
            var itemLabel = this.getLabel(item);
            if (selectedLabel === itemLabel) {
                this.selected.splice(i, 1);
            }
        }
        notify = typeof notify === 'undefined' ? true : notify;
        if (notify) {
            this.itemRemoved.emit(selection);
            this.itemsChange.emit(this.selected);
        }
    };
    /**
     * Select item from list
     *
     * @param selection
     **/
    AutoCompleteComponent.prototype.selectItem = function (selection) {
        this.keyword = this.getLabel(selection);
        this.formValue = this._getFormValue(selection);
        this.hideItemList();
        this.updateModel(this.formValue);
        if (this.hideListOnSelection) {
            this.hideItemList();
        }
        if (this.multi) {
            this.clearValue();
            this.selected.push(selection);
            this.itemsChange.emit(this.selected);
        }
        else {
            this.selection = selection;
            this.selected = [selection];
            this.itemsChange.emit(selection);
        }
        this.itemSelected.emit(selection);
    };
    /**
     * Set focus of searchbar
     */
    AutoCompleteComponent.prototype.setFocus = function () {
        if (this.searchbarElem) {
            this.searchbarElem.nativeElement.setFocus();
        }
    };
    /**
     * Set suggestions
     *
     * @param suggestions
     */
    AutoCompleteComponent.prototype.setSuggestions = function (suggestions) {
        if (this.removeDuplicateSuggestions) {
            suggestions = this.removeDuplicates(suggestions);
            suggestions = this.removeExcluded(suggestions);
        }
        this.suggestions = suggestions;
        this.showItemList();
    };
    /**
     * Set current input value
     *
     * @param selection
     */
    AutoCompleteComponent.prototype.setValue = function (selection) {
        this.formValue = this._getFormValue(selection);
        this.keyword = this.getLabel(selection);
        return;
    };
    /**
     * Show item list
     */
    AutoCompleteComponent.prototype.showItemList = function () {
        this.showList = true;
    };
    /**
     * Update the model
     */
    AutoCompleteComponent.prototype.updateModel = function (enteredText) {
        if (enteredText !== this.formValue) {
            this.formValue = enteredText;
            this.selected = this.multi ? [] : null;
        }
        this.onChangeCallback(this.formValue);
        this.modelChanged.emit(this.selected);
    };
    /**
     * Write value
     *
     * @param value
     */
    AutoCompleteComponent.prototype.writeValue = function (value) {
        if (value !== this.selection) {
            this.selection = value || null;
            this.formValue = this._getFormValue(this.selection);
            this.keyword = this.getLabel(this.selection);
        }
    };
    var AutoCompleteComponent_1, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AutoCompleteComponent.prototype, "alwaysShowList", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AutoCompleteComponent.prototype, "dataProvider", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AutoCompleteComponent.prototype, "disabled", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], AutoCompleteComponent.prototype, "exclude", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AutoCompleteComponent.prototype, "hideListOnSelection", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AutoCompleteComponent.prototype, "keyword", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AutoCompleteComponent.prototype, "location", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AutoCompleteComponent.prototype, "multi", void 0);
    __decorate([
        Input(),
        __metadata("design:type", typeof (_a = typeof AutoCompleteOptions !== "undefined" && AutoCompleteOptions) === "function" ? _a : Object)
    ], AutoCompleteComponent.prototype, "options", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AutoCompleteComponent.prototype, "removeButtonClasses", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AutoCompleteComponent.prototype, "removeButtonColor", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AutoCompleteComponent.prototype, "removeButtonIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AutoCompleteComponent.prototype, "removeButtonSlot", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AutoCompleteComponent.prototype, "removeDuplicateSuggestions", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AutoCompleteComponent.prototype, "showResultsFirst", void 0);
    __decorate([
        Input(),
        __metadata("design:type", typeof (_b = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _b : Object)
    ], AutoCompleteComponent.prototype, "template", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AutoCompleteComponent.prototype, "useIonInput", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AutoCompleteComponent.prototype, "model", null);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
    ], AutoCompleteComponent.prototype, "modelChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
    ], AutoCompleteComponent.prototype, "autoFocus", void 0);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
    ], AutoCompleteComponent.prototype, "autoBlur", void 0);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
    ], AutoCompleteComponent.prototype, "ionAutoInput", void 0);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
    ], AutoCompleteComponent.prototype, "itemsChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
    ], AutoCompleteComponent.prototype, "itemsHidden", void 0);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_j = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _j : Object)
    ], AutoCompleteComponent.prototype, "itemRemoved", void 0);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_k = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _k : Object)
    ], AutoCompleteComponent.prototype, "itemSelected", void 0);
    __decorate([
        Output(),
        __metadata("design:type", typeof (_l = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _l : Object)
    ], AutoCompleteComponent.prototype, "itemsShown", void 0);
    __decorate([
        ViewChild('searchbarElem', {
            read: ElementRef
        }),
        __metadata("design:type", typeof (_m = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _m : Object)
    ], AutoCompleteComponent.prototype, "searchbarElem", void 0);
    __decorate([
        ViewChild('inputElem', {
            read: ElementRef
        }),
        __metadata("design:type", typeof (_o = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _o : Object)
    ], AutoCompleteComponent.prototype, "inputElem", void 0);
    __decorate([
        HostListener('document:click', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_p = typeof Event !== "undefined" && Event) === "function" ? _p : Object]),
        __metadata("design:returntype", void 0)
    ], AutoCompleteComponent.prototype, "_documentClickHandler", null);
    AutoCompleteComponent = AutoCompleteComponent_1 = __decorate([
        Component({
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: AutoCompleteComponent_1,
                    multi: true
                }
            ],
            selector: 'ion-auto-complete',
            template: "\n    <div *ngIf=\"multi\">\n        <div *ngFor=\"let item of selected\"\n             class=\"selected-items\">\n            <ion-button class=\"{{ removeButtonClasses }}\"\n                        [color]=\"removeButtonColor\"\n                        [fill]=\"'outline'\"\n                        [shape]=\"'round'\"\n                        (click)=\"removeItem(item)\">\n                {{ getLabel(item) }}\n                <ion-icon [name]=\"removeButtonIcon\"\n                          [slot]=\"removeButtonSlot\"></ion-icon>\n            </ion-button>\n        </div>\n    </div>\n    <ion-input\n            #inputElem\n            (keyup)=\"getItems($event)\"\n            (tap)=\"handleTap($event)\"\n            [(ngModel)]=\"keyword\"\n            (ngModelChange)=\"updateModel($event)\"\n            [placeholder]=\"options.placeholder == null ? defaultOpts.placeholder : options.placeholder\"\n            [type]=\"options.type == null ? defaultOpts.type : options.type\"\n            [clearOnEdit]=\"options.clearOnEdit == null ? defaultOpts.clearOnEdit : options.clearOnEdit\"\n            [clearInput]=\"options.clearInput == null ? defaultOpts.clearInput : options.clearInput\"\n            [color]=\"options.color == null ? null : options.color\"\n            [mode]=\"options.mode == null ? defaultOpts.mode : options.mode\"\n            [disabled]=\"disabled\"\n            [ngClass]=\"{ 'hidden': !useIonInput, 'loading': isLoading }\"\n            (ionFocus)=\"onFocus()\"\n            (ionBlur)=\"onBlur()\"\n    >\n    </ion-input>\n    <ion-searchbar\n            #searchbarElem\n            [animated]=\"options.animated == null ? defaultOpts.animated : options.animated\"\n            (ionInput)=\"getItems($event)\"\n            (tap)=\"handleTap($event)\"\n            [(ngModel)]=\"keyword\"\n            (ngModelChange)=\"updateModel($event)\"\n            [cancelButtonIcon]=\"options.cancelButtonIcon == null ? defaultOpts.cancelButtonIcon : options.cancelButtonIcon\"\n            [cancelButtonText]=\"options.cancelButtonText == null ? defaultOpts.cancelButtonText : options.cancelButtonText\"\n            [clearIcon]=\"options.clearIcon == null ? defaultOpts.clearIcon : options.clearIcon\"\n            [color]=\"options.color == null ? null : options.color\"\n            [showCancelButton]=\"options.showCancelButton == null ? defaultOpts.showCancelButton : options.showCancelButton\"\n            [debounce]=\"options.debounce == null ? defaultOpts.debounce : options.debounce\"\n            [placeholder]=\"options.placeholder == null ? defaultOpts.placeholder : options.placeholder\"\n            [autocomplete]=\"options.autocomplete == null ? defaultOpts.autocomplete : options.autocomplete\"\n            [autocorrect]=\"options.autocorrect == null ? defaultOpts.autocorrect : options.autocorrect\"\n            [mode]=\"options.mode == null ? defaultOpts.mode : options.mode\"\n            [searchIcon]=\"options.searchIcon == null ? defaultOpts.searchIcon : options.searchIcon\"\n            [spellcheck]=\"options.spellcheck == null ? defaultOpts.spellcheck : options.spellcheck\"\n            [type]=\"options.type == null ? defaultOpts.type : options.type\"\n            [ngClass]=\"{ 'hidden': useIonInput, 'loading': isLoading, 'disabled': disabled }\"\n            (ionClear)=\"clearValue(true)\"\n            (ionFocus)=\"onFocus()\"\n            (ionBlur)=\"onBlur()\"\n    >\n    </ion-searchbar>\n    <ng-template #defaultTemplate let-attrs=\"attrs\">\n        <span [innerHTML]='attrs.label | boldprefix:attrs.keyword'></span>\n    </ng-template>\n    <ul *ngIf=\"!disabled && suggestions.length > 0 && showList\"\n        [ngStyle]=\"getStyle()\">\n        <li *ngFor=\"let suggestion of suggestions\"\n            (click)=\"handleSelectTap($event, suggestion)\"\n            (tap)=\"handleSelectTap($event, suggestion)\">\n            <ng-template\n                    [ngTemplateOutlet]=\"template || defaultTemplate\"\n                    [ngTemplateOutletContext]=\"\n                            {attrs:{ \n                              data: suggestion, \n                              label: getLabel(suggestion),\n                              keyword: keyword,\n                              formValue: _getFormValue(suggestion), \n                              labelAttribute: dataProvider.labelAttribute, \n                              formValueAttribute: dataProvider.formValueAttribute }}\"></ng-template>\n        </li>\n    </ul>\n    <p *ngIf=\"suggestions.length == 0 && showList && options.noItems\">{{ options.noItems }}</p>\n  "
        }),
        __metadata("design:paramtypes", [typeof (_q = typeof Platform !== "undefined" && Platform) === "function" ? _q : Object])
    ], AutoCompleteComponent);
    return AutoCompleteComponent;
}());

/**
 * Bolds the beginning of the matching string in the item
 */
var BoldPrefix = /** @class */ (function () {
    function BoldPrefix() {
    }
    BoldPrefix.prototype.transform = function (value, keyword) {
        if (!keyword) {
            return value;
        }
        var escaped_keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return value.replace(new RegExp(escaped_keyword, 'gi'), function (str) {
            return str.bold();
        });
    };
    BoldPrefix = __decorate([
        Pipe({
            name: 'boldprefix'
        }),
        Injectable()
    ], BoldPrefix);
    return BoldPrefix;
}());

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AutoCompleteModule = /** @class */ (function () {
    function AutoCompleteModule() {
    }
    AutoCompleteModule_1 = AutoCompleteModule;
    AutoCompleteModule.forRoot = function () {
        return {
            ngModule: AutoCompleteModule_1,
            providers: []
        };
    };
    var AutoCompleteModule_1;
    AutoCompleteModule = AutoCompleteModule_1 = __decorate$1([
        NgModule({
            declarations: [
                AutoCompleteComponent,
                BoldPrefix
            ],
            exports: [
                AutoCompleteComponent,
                BoldPrefix
            ],
            imports: [
                CommonModule,
                FormsModule,
                IonicModule
            ]
        })
    ], AutoCompleteModule);
    return AutoCompleteModule;
}());

export { AutoCompleteComponent, AutoCompleteModule, AutoCompleteOptions, BoldPrefix };
//# sourceMappingURL=index.js.map
