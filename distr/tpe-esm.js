/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
const removeNodes = (container, startNode, endNode = null) => {
    let node = startNode;
    while (node !== endNode) {
        const n = node.nextSibling;
        container.removeChild(node);
        node = n;
    }
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        let index = -1;
        let partIndex = 0;
        const nodesToRemove = [];
        const _prepareTemplate = (template) => {
            const content = template.content;
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
            // null
            const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
            // Keeps track of the last index associated with a part. We try to delete
            // unnecessary nodes, but we never want to associate two different parts
            // to the same index. They must have a constant node between.
            let lastPartIndex = 0;
            while (walker.nextNode()) {
                index++;
                const node = walker.currentNode;
                if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                    if (node.hasAttributes()) {
                        const attributes = node.attributes;
                        // Per
                        // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                        // attributes are not guaranteed to be returned in document order.
                        // In particular, Edge/IE can return them out of order, so we cannot
                        // assume a correspondance between part index and attribute index.
                        let count = 0;
                        for (let i = 0; i < attributes.length; i++) {
                            if (attributes[i].value.indexOf(marker) >= 0) {
                                count++;
                            }
                        }
                        while (count-- > 0) {
                            // Get the template literal section leading up to the first
                            // expression in this attribute
                            const stringForPart = result.strings[partIndex];
                            // Find the attribute name
                            const name = lastAttributeNameRegex.exec(stringForPart)[2];
                            // Find the corresponding attribute
                            // All bound attributes have had a suffix added in
                            // TemplateResult#getHTML to opt out of special attribute
                            // handling. To look up the attribute value we also need to add
                            // the suffix.
                            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                            const attributeValue = node.getAttribute(attributeLookupName);
                            const strings = attributeValue.split(markerRegex);
                            this.parts.push({ type: 'attribute', index, name, strings });
                            node.removeAttribute(attributeLookupName);
                            partIndex += strings.length - 1;
                        }
                    }
                    if (node.tagName === 'TEMPLATE') {
                        _prepareTemplate(node);
                    }
                }
                else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                    const data = node.data;
                    if (data.indexOf(marker) >= 0) {
                        const parent = node.parentNode;
                        const strings = data.split(markerRegex);
                        const lastIndex = strings.length - 1;
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for node parts
                        for (let i = 0; i < lastIndex; i++) {
                            parent.insertBefore((strings[i] === '') ? createMarker() :
                                document.createTextNode(strings[i]), node);
                            this.parts.push({ type: 'node', index: ++index });
                        }
                        // If there's no text, we must insert a comment to mark our place.
                        // Else, we can trust it will stick around after cloning.
                        if (strings[lastIndex] === '') {
                            parent.insertBefore(createMarker(), node);
                            nodesToRemove.push(node);
                        }
                        else {
                            node.data = strings[lastIndex];
                        }
                        // We have a part for each match found
                        partIndex += lastIndex;
                    }
                }
                else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                    if (node.data === marker) {
                        const parent = node.parentNode;
                        // Add a new marker node to be the startNode of the Part if any of
                        // the following are true:
                        //  * We don't have a previousSibling
                        //  * The previousSibling is already the start of a previous part
                        if (node.previousSibling === null || index === lastPartIndex) {
                            index++;
                            parent.insertBefore(createMarker(), node);
                        }
                        lastPartIndex = index;
                        this.parts.push({ type: 'node', index });
                        // If we don't have a nextSibling, keep this node so we have an end.
                        // Else, we can remove it to save future costs.
                        if (node.nextSibling === null) {
                            node.data = '';
                        }
                        else {
                            nodesToRemove.push(node);
                            index--;
                        }
                        partIndex++;
                    }
                    else {
                        let i = -1;
                        while ((i = node.data.indexOf(marker, i + 1)) !==
                            -1) {
                            // Comment node has a binding marker inside, make an inactive part
                            // The binding won't work, but subsequent bindings will
                            // TODO (justinfagnani): consider whether it's even worth it to
                            // make bindings in comments work
                            this.parts.push({ type: 'node', index: -1 });
                        }
                    }
                }
            }
        };
        _prepareTemplate(element);
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this._parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this._parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this._parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // When using the Custom Elements polyfill, clone the node, rather than
        // importing it, to keep the fragment in the template's document. This
        // leaves the fragment inert so custom elements won't upgrade and
        // potentially modify their contents by creating a polyfilled ShadowRoot
        // while we traverse the tree.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const parts = this.template.parts;
        let partIndex = 0;
        let nodeIndex = 0;
        const _prepareInstance = (fragment) => {
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
            // null
            const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
            let node = walker.nextNode();
            // Loop through all the nodes and parts of a template
            while (partIndex < parts.length && node !== null) {
                const part = parts[partIndex];
                // Consecutive Parts may have the same node index, in the case of
                // multiple bound attributes on an element. So each iteration we either
                // increment the nodeIndex, if we aren't on a node with a part, or the
                // partIndex if we are. By not incrementing the nodeIndex when we find a
                // part, we allow for the next part to be associated with the current
                // node if neccessasry.
                if (!isTemplatePartActive(part)) {
                    this._parts.push(undefined);
                    partIndex++;
                }
                else if (nodeIndex === part.index) {
                    if (part.type === 'node') {
                        const part = this.processor.handleTextExpression(this.options);
                        part.insertAfterNode(node.previousSibling);
                        this._parts.push(part);
                    }
                    else {
                        this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
                    }
                    partIndex++;
                }
                else {
                    nodeIndex++;
                    if (node.nodeName === 'TEMPLATE') {
                        _prepareInstance(node.content);
                    }
                    node = walker.nextNode();
                }
            }
        };
        _prepareInstance(fragment);
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const endIndex = this.strings.length - 1;
        let html = '';
        for (let i = 0; i < endIndex; i++) {
            const s = this.strings[i];
            // This exec() call does two things:
            // 1) Appends a suffix to the bound attribute name to opt out of special
            // attribute value parsing that IE11 and Edge do, like for style and
            // many SVG attributes. The Template class also appends the same suffix
            // when looking up attributes to create Parts.
            // 2) Adds an unquoted-attribute-safe marker for the first expression in
            // an attribute. Subsequent attribute expressions will use node markers,
            // and this is safe since attributes with multiple expressions are
            // guaranteed to be quoted.
            const match = lastAttributeNameRegex.exec(s);
            if (match) {
                // We're starting a new bound attribute.
                // Add the safe attribute suffix, and use unquoted-attribute-safe
                // marker.
                html += s.substr(0, match.index) + match[1] + match[2] +
                    boundAttributeSuffix + match[3] + marker;
            }
            else {
                // We're either in a bound node, or trailing bound attribute.
                // Either way, nodeMarker is safe to use.
                html += s + nodeMarker;
            }
        }
        return html + this.strings[endIndex];
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
/**
 * Sets attribute values for AttributeParts, so that the value is only set once
 * even if there are multiple parts for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = this.parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (v != null &&
                    (Array.isArray(v) ||
                        // tslint:disable-next-line:no-any
                        typeof v !== 'string' && v[Symbol.iterator])) {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
                else {
                    text += typeof v === 'string' ? v : String(v);
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
class AttributePart {
    constructor(comitter) {
        this.value = undefined;
        this.committer = comitter;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
class NodePart {
    constructor(options) {
        this.value = undefined;
        this._pendingValue = undefined;
        this.options = options;
    }
    /**
     * Inserts this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
     * its next sibling must be static, unchanging nodes such as those that appear
     * in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part._insert(this.startNode = createMarker());
        part._insert(this.endNode = createMarker());
    }
    /**
     * Appends this part after `ref`
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref._insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this._pendingValue = value;
    }
    commit() {
        while (isDirective(this._pendingValue)) {
            const directive = this._pendingValue;
            this._pendingValue = noChange;
            directive(this);
        }
        const value = this._pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this._commitText(value);
            }
        }
        else if (value instanceof TemplateResult) {
            this._commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this._commitNode(value);
        }
        else if (Array.isArray(value) ||
            // tslint:disable-next-line:no-any
            value[Symbol.iterator]) {
            this._commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this._commitText(value);
        }
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    _commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this._insert(value);
        this.value = value;
    }
    _commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = value;
        }
        else {
            this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
        }
        this.value = value;
    }
    _commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this._commitNode(fragment);
            this.value = instance;
        }
    }
    _commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this._pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this._pendingValue = value;
    }
    commit() {
        while (isDirective(this._pendingValue)) {
            const directive = this._pendingValue;
            this._pendingValue = noChange;
            directive(this);
        }
        if (this._pendingValue === noChange) {
            return;
        }
        const value = !!this._pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
        }
        this.value = value;
        this._pendingValue = noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // tslint:disable-next-line:no-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
try {
    const options = {
        get capture() {
            eventOptionsSupported = true;
            return false;
        }
    };
    // tslint:disable-next-line:no-any
    window.addEventListener('test', options, options);
    // tslint:disable-next-line:no-any
    window.removeEventListener('test', options, options);
}
catch (_e) {
}
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this._pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this._boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this._pendingValue = value;
    }
    commit() {
        while (isDirective(this._pendingValue)) {
            const directive = this._pendingValue;
            this._pendingValue = noChange;
            directive(this);
        }
        if (this._pendingValue === noChange) {
            return;
        }
        const newListener = this._pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
        }
        if (shouldAddListener) {
            this._options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
        }
        this.value = newListener;
        this._pendingValue = noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const comitter = new PropertyCommitter(element, name.slice(1), strings);
            return comitter.parts;
        }
        if (prefix === '@') {
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const comitter = new AttributeCommitter(element, name, strings);
        return comitter.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if (isTemplatePartActive(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected.` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                removeNodesFromTemplate(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (renderedDOM, template, scopeName) => {
    shadyRenderSet.add(scopeName);
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    // If there are no styles, skip unnecessary work
    if (styles.length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    insertNodeIntoTemplate(template, condensedStyle, template.element.content.firstChild);
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);
    if (window.ShadyCSS.nativeShadow) {
        // When in native Shadow DOM, re-add styling to rendered content using
        // the style ShadyCSS produced.
        const style = template.element.content.querySelector('style');
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else {
        // When not in native Shadow DOM, at this point ShadyCSS will have
        // removed the style from the lit template and parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        template.element.content.insertBefore(condensedStyle, template.element.content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        removeNodesFromTemplate(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render$1 = (result, container, options) => {
    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = container instanceof ShadowRoot &&
        compatibleShadyCSSVersion && result instanceof TemplateResult;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = parts.get(renderContainer);
        parts.delete(renderContainer);
        if (part.value instanceof TemplateInstance) {
            prepareTemplateStyles(renderContainer, part.value.template, scopeName);
        }
        removeNodes(container, container.firstChild);
        container.appendChild(renderContainer);
        parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const microtaskPromise = Promise.resolve(true);
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
const STATE_HAS_CONNECTED = 1 << 5;
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this._updateState = 0;
        this._instanceProperties = undefined;
        this._updatePromise = microtaskPromise;
        this._hasConnectedResolver = undefined;
        /**
         * Map with keys for any properties that have changed since the last
         * update cycle with previous values.
         */
        this._changedProperties = new Map();
        /**
         * Map with keys of properties that should be reflected when updated.
         */
        this._reflectingProperties = undefined;
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        Object.defineProperty(this.prototype, name, {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                // tslint:disable-next-line:no-any no symbol in index
                const oldValue = this[name];
                // tslint:disable-next-line:no-any no symbol in index
                this[key] = value;
                this._requestUpdate(name, oldValue);
            },
            configurable: true,
            enumerable: true
        });
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        if (this.hasOwnProperty(JSCompiler_renameProperty('finalized', this)) &&
            this.finalized) {
            return;
        }
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (typeof superCtor.finalize === 'function') {
            superCtor.finalize();
        }
        this.finalized = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of `updateComplete`
        this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        this._updateState = this._updateState | STATE_HAS_CONNECTED;
        // Ensure first connection completes an update. Updates cannot complete before
        // connection and if one is pending connection the `_hasConnectionResolver`
        // will exist. If so, resolve it to complete the update, otherwise
        // requestUpdate.
        if (this._hasConnectedResolver) {
            this._hasConnectedResolver();
            this._hasConnectedResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    _requestUpdate(name, oldValue) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this._requestUpdate(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        // Mark state updating...
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        let resolve;
        let reject;
        const previousUpdatePromise = this._updatePromise;
        this._updatePromise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await previousUpdatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        // Make sure the element has connected before updating.
        if (!this._hasConnected) {
            await new Promise((res) => this._hasConnectedResolver = res);
        }
        try {
            const result = this.performUpdate();
            // If `performUpdate` returns a Promise, we await it. This is done to
            // enable coordinating updates with a scheduler. Note, the result is
            // checked to avoid delaying an additional microtask unless we need to.
            if (result != null) {
                await result;
            }
        }
        catch (e) {
            reject(e);
        }
        resolve(!this._hasRequestedUpdate);
    }
    get _hasConnected() {
        return (this._updateState & STATE_HAS_CONNECTED);
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            throw e;
        }
        finally {
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update. This getter can be implemented to
     * await additional state. For example, it is sometimes useful to await a
     * rendered element before fulfilling this Promise. To do this, first await
     * `super.updateComplete` then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement.finalized = true;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
            // is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.0.1');
/**
 * Minimal implementation of Array.prototype.flat
 * @param arr the array to flatten
 * @param result the accumlated result
 */
function arrayFlat(styles, result = []) {
    for (let i = 0, length = styles.length; i < length; i++) {
        const value = styles[i];
        if (Array.isArray(value)) {
            arrayFlat(value, result);
        }
        else {
            result.push(value);
        }
    }
    return result;
}
/** Deeply flattens styles array. Uses native flat if available. */
const flattenStyles = (styles) => styles.flat ? styles.flat(Infinity) : arrayFlat(styles);
class LitElement extends UpdatingElement {
    /** @nocollapse */
    static finalize() {
        super.finalize();
        // Prepare styling that is stamped at first render time. Styling
        // is built from user provided `styles` or is inherited from the superclass.
        this._styles =
            this.hasOwnProperty(JSCompiler_renameProperty('styles', this)) ?
                this._getUniqueStyles() :
                this._styles || [];
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Take care not to call `this.styles` multiple times since this generates
        // new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.styles;
        const styles = [];
        if (Array.isArray(userStyles)) {
            const flatStyles = flattenStyles(userStyles);
            // As a performance optimization to avoid duplicated styling that can
            // occur especially when composing via subclassing, de-duplicate styles
            // preserving the last item in the list. The last item is kept to
            // try to preserve cascade order with the assumption that it's most
            // important that last added styles override previous styles.
            const styleSet = flatStyles.reduceRight((set, s) => {
                set.add(s);
                // on IE set.add does not return the set.
                return set;
            }, new Set());
            // Array.from does not work on Set in IE
            styleSet.forEach((v) => styles.unshift(v));
        }
        else if (userStyles) {
            styles.push(userStyles);
        }
        return styles;
    }
    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */
    initialize() {
        super.initialize();
        this.renderRoot =
            this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it.
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        super.update(changedProperties);
        const templateResult = this.render();
        if (templateResult instanceof TemplateResult) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method must return
     * a lit-html TemplateResult. Setting properties inside this method will *not*
     * trigger the element to update.
     */
    render() {
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 */
LitElement.finalized = true;
/**
 * Render method used to render the lit-html TemplateResult to the element's
 * DOM.
 * @param {TemplateResult} Template to render.
 * @param {Element|DocumentFragment} Node into which to render.
 * @param {String} Element name.
 * @nocollapse
 */
LitElement.render = render$1;

const LabelsMixin = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles || [],
        css`
          label div#label-text, ::slotted(*) {
            align-self: center;
            width: var(--nn-input-label-width, auto);
          }

        `
      ]
    }

    static get properties () {
      return {
        label: { type: String },
        labelPosition: {
          type: String,
          attribute: 'label-position'
        },
        labelForElement: {
          type: String,
          attribute: 'false'
        }

      }
    }

    constructor () {
      super();
      this.labelPosition = 'before';
      this.labelForElement = 'native';
    }

    get labelTemplate () {
      return html`
        <label id="label" for="${this.labelForElement}">
          <div id="label-text">${this.label}</div>
          <slot id="label-slot" name="label"></slot>
        </label>
      `
    }

    get ifLabelBefore () {
      if (this.labelPosition === 'after') return ''
      return this.labelTemplate
    }

    get ifLabelAfter () {
      if (this.labelPosition === 'before') return ''
      return this.labelTemplate
    }
  }
};

const StyleableMixin = (base) => {
  return class Base extends base {
    static get properties () {
      return {
        /* This is for non-developers consumers, using attribute */
        stylesheet: {
          type: String
        },
        /* This is for developers, assigning property */
        elementStyle: {
          type: Object,
          attribute: false
        }
      }
    }

    static get styles () {
      return [
        super.styles || []
      ]
    }

    get customStyle () {
      return html`
          ${this.stylesheet ? html`<link rel="stylesheet" href="${this.stylesheet}">` : ''}
          ${this.elementStyle ? html`${this.elementStyle}` : ''}
        `
    }
  }
};

const ThemeableMixin = (path) => (base) => {
  const common = (window.TP_THEME && window.TP_THEME.common) || (p => p);
  const theme = (window.TP_THEME && window.TP_THEME[path]) || (p => p);
  return theme(common(base))
};

class EeAutocompleteInputSpans extends ThemeableMixin('ee-autocomplete-input-spans')(LabelsMixin(StyleableMixin(LitElement))) {
  static get properties () {
    return {
      name: {
        type: String
      },
      valueAs: {
        type: String,
        attribute: 'value-as'
      },
      valueSeparator: {
        type: String,
        attribute: 'value-separator'
      },
      validationMessagePosition: {
        type: String,
        attribute: 'validation-message-position'
      },
      shownValidationMessage: {
        type: String,
        attribute: false
      },
      validity: {
        type: Object,
        attribute: false
      },
      validator: { type: Function }
    }
  }

  constructor () {
    super();
    this.labelForElement = 'ni';
    this.valueAs = 'text'; // can be text, ids, json
    this.removeIcon = '<svg class="icon" height="15" viewBox="0 0 24 24" width="15"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';
    this.itemElement = '';
    this.itemElementConfig = {};
    this.itemElementAttributes = {};
    this.shownValidationMessage = '';
    this.validator = () => '';
    this.validationMessagePosition = 'before';
    this.valueSeparator = ',';
    this.validity = { valid: true, _customValidationMessage: '' };
  }

  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: inline;
        }
        :host(:focus) {
          outline: none;
        }

        #list > span {
          position: relative;
          display: inline-block;
        }

        #list > span > *:not(button) {
          position: relative;
          display: inline-block;
          padding: 3px 6px;
          padding-right: 24px;
          border: 1px solid #ddd;
          border-radius: 1em;
          margin: 2px;
          vertical-align: middle;
          line-height: 1em;
        }

        #list > span > *:not(button)[invalid] {
          background-color: pink;
          border-color: red;
        }

        #list > span:active > *:not(button), #list > span:focus > *:not(button), #list > span:hover > *:not(button) {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          background-color: #eee;
          outline: none;
        }
        #list > span:active > *:not(button), #list > span:focus > *:not(button) {
          border-color: var(--nn-primary-color, #ccc);
        }

        #list > span button.remove {
          appearance: none;
          -moz-appearance: none;
          -webkit-appearance: none;
          fill: #999;
          border: none;
          padding: 0;
          display: inline-block;
          position: absolute;
          top: 55%;
          right: 4px;
          transform: translateY(-50%);
          background: none;
          z-index:0;
        }

        #list > *:focus, #list > span *:active {
          outline: none;
        }

        #list > span button.remove svg {
          z-index: -1;
        }

        #list > span button.remove:hover {
          fill: #555;
        }

        input {
          box-sizing: border-box;
          display: inline-block;
          outline: none;
          vertical-align: middle;
          height: 1.5em;
          border: none;
          font-size: 0.9em;
          width: 120px;
        }

        input:focus, input:hover {
          outline: none
        }

        span.error-message {
          color: red;
        }

        :invalid {
          background-color: pink;
          border: var(--nn-input-border-invalid, 1px solid #bb7777);
        }
      `
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <div id="list" @click="${this._listClicked}">
        <input @keydown="${this._handleKeyEvents}" @input="${this._inputReceived}" rows="1" id="ta" spellcheck="false" autocomplete="false" autocapitalize="off" autocorrect="off" dir="ltr" role="combobox" aria-autocomplete="list">
      </div>
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
      <input id="ni" type="hidden" name="${this.name}">
    `
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('click', this.focus);
  }

  disconnectedCallback () {
    super.connectedCallback();
    this.removeEventListener('click', this.focus);
  }

  firstUpdated () {
    this._updateNativeInputValue();
  }

  focus () {
    this.shadowRoot.querySelector('#ta').focus();
  }

  _listClicked (e) {
    e.stopPropagation();
  }

  get value () {
    let r;
    let list;
    switch (this.valueAs) {
    case 'json':
      r = {};
      list = this.shadowRoot.querySelector('#list');
      for (const span of list.children) {
        if (span.id === 'ta') continue
        const idValue = span.firstChild.idValue;
        r[idValue] = span.firstChild.data;
      }
      return r
    default:
      r = [];
      list = this.shadowRoot.querySelector('#list');
      for (const span of list.children) {
        if (span.id === 'ta') continue
        if (this.valueAs === 'text') {
          // Won't push invalid spans to the final value
          if (span.getAttribute('invalid') === null) r.push(span.firstChild.textValue);
        } else {
          r.push(span.firstChild.idValue);
        }
      }
      return r.join(this.valueSeparator)
    }
  }

  set value (v) {
    const list = this.shadowRoot.querySelector('#list');

    // Remove all children
    while (list.firstChild) {
      if (list.firstChild.id === 'ta') break
      list.removeChild(list.firstChild);
    }

    // Assign all children using pickedElement
    if (Array.isArray(v)) {
      for (const o of v) {
        this.pickedElement(o, false, true);
      }
    } else if (typeof v === 'object' && v !== null) {
      for (const k of Object.keys(v)) {
        const $o = v[k];
        this.pickedElement($o, false, true);
      }
    } else if (typeof v === 'string') {
      for (const s of v.split(this.valueSeparator)) {
        this.pickedElement(s, false, true);
      }
    }
    // Sets the native input
    this._updateNativeInputValue();

    // Rerun validator
    this.setCustomValidity('');
    this.reportValidity();
  }

  get validationMessage () {
    return this.validity._customValidationMessage
  }

  setCustomValidity (m) {
    if (m === '') {
      this.validity = {
        valid: true,
        _customValidationMessage: ''
      };
      this.toggleAttribute('valid', true);
      if (m === '') this.shownValidationMessage = '';
    } else {
      this.validity = {
        valid: false,
        customError: true,
        _customValidationMessage: m
      };
      this.toggleAttribute('valid', false);
    }
  }

  reportValidity () {
    // Run custom validator. Note that custom validator
    // will only ever run on filed without an existing customError.
    // This is because
    if (!this.validity.customError) {
      const ownErrorMessage = this.validator();
      if (ownErrorMessage) this.setCustomValidity(ownErrorMessage);
    }

    // Hide the error message by default
    this.shownValidationMessage = '';

    if (!this.validity.valid) {
      this.toggleAttribute('valid', false);
      this.shownValidationMessage = this.validity._customValidationMessage;
      this.dispatchEvent(new CustomEvent('invalid', {
        cancelable: true,
        bubbles: false,
        composed: true
      }));
      return false
    } else {
      this.toggleAttribute('valid', true);
      return true
    }
  }

  checkValidity () {
    if (!this.native.validity.customError) {
      const ownErrorMessage = this.validator();
      if (ownErrorMessage) this.setCustomValidity(ownErrorMessage);
    }

    if (!this.validity.valid) {
      this.dispatchEvent(new CustomEvent('invalid', {
        cancelable: true,
        bubbles: false,
        composed: true
      }));
      return false
    }
    return true
  }

  get ifValidationMessageBefore () {
    if (this.validationMessagePosition === 'after') return ''
    return this.validationMessageTemplate
  }

  get ifValidationMessageAfter () {
    if (this.validationMessagePosition === 'before') return ''
    return this.validationMessageTemplate
  }

  get validationMessageTemplate () {
    return html`
      <span class="error-message">
        ${this.shownValidationMessage}
      </span>
    `
  }

  get autocompleteValue () {
    const ta = this.shadowRoot.querySelector('#ta');
    if (ta) return ta.value
    return ''
  }

  /* END OF CONSTRAINTS API */

  // Run this when there are no suggestions and the user hits Tab or Enter in #ta
  // This will run pickElement with a STRING, which will get the element to
  // work out a data structure based on the string
  _pickCurrentValue () {
    if (this.valueAs === 'text') {
      this.pickedElement(this.shadowRoot.querySelector('#ta').value, true);
    }
  }

  _askToRemove (e) {
    const target = e.currentTarget;
    this._removeItem(target.parentElement.parentElement);
  }

  _updateNativeInputValue () {
    const ni = this.shadowRoot.querySelector('#ni');
    ni.value = this.value;
  }

  _removeItem (target, which = 'previous') {
    // Focus previous item before deleting target. If it's the first/only, select the input
    const previous = target.previousElementSibling || target.nextElementSibling;
    previous.focus();
    target.remove();
    this._updateNativeInputValue();
    // Rerun validator
    this.setCustomValidity('');
    this.reportValidity();
  }

  _createRemoveBtn () {
    const el = document.createElement('button');
    el.innerHTML = this.removeIcon;
    el.onclick = this._askToRemove.bind(this);
    el.classList.add('remove');
    return el
  }

  _handleKeyEvents (e) {
    const target = e.currentTarget;

    switch (e.key) {
    case 'ArrowLeft':
      if (target.previousElementSibling) {
        e.preventDefault();
        target.previousElementSibling.focus();
      }
      break

    case 'ArrowRight':
      if (target.id !== 'ta') {
        e.preventDefault();
        target.nextElementSibling
          ? target.nextElementSibling.focus()
          : target.parentElement.firstElementChild.focus();
      }
      break

    case 'ArrowDown':
      if (this.parentElement.suggestions.length) {
        e.preventDefault();
        this.parentElement.focusNext();
      }
      break
    case 'Backspace':
    case 'Delete':
      if (target.id === 'ta' && target.parentElement.children.length > 1 && !target.value) {
        this._removeItem(target.previousElementSibling);
      } else if (target.id !== 'ta') {
        this._removeItem(target);
      }
      break
    case 'Tab':
    case 'Enter':
      if (!this.autocompleteValue) break
      if (!this.parentElement.suggestions.length) {
        e.preventDefault();
        this._pickCurrentValue();
      } else {
        e.preventDefault();
        this.parentElement.pickFirst();
      }
    }
  }

  /* API */
  get multiInputApi () { return true }

  pickedElement (data, force = false, skipValidation = false) {
    const parentEl = document.createElement(this.itemElement);
    const el = new parentEl.constructor.PickedElement();

    el.config = { ...el.config, ...this.itemElementConfig };
    for (const k of Object.keys(this.itemElementAttributes)) el.setAttribute(k, this.itemElementAttributes[k]);

    // Convert string into data if necessary
    if (typeof data === 'string') {
      if (!data.length) return
      data = parentEl.stringToData(data);
      if (!data.valid) {
        el.toggleAttribute('invalid', true);
        if (!force) return
      }
    }
    el.data = data;

    const list = this.shadowRoot.querySelector('#list');
    const span = document.createElement('span');
    // -1 means that it will not in the list of tabs, but
    // it will be focusable (spans aren't by default)
    span.setAttribute('tabindex', -1);
    const ta = this.shadowRoot.querySelector('#ta');
    const removeBtn = this._createRemoveBtn();

    span.onkeydown = this._handleKeyEvents.bind(this);
    // Span will be not in the list of tabs
    // Necessary since this is a button and it IS
    // in tab list by default
    removeBtn.setAttribute('tabindex', -1);
    span.appendChild(el);
    el.appendChild(removeBtn);

    list.insertBefore(span, ta);
    ta.value = '';

    this._updateNativeInputValue();

    // Rerun validator
    if (!skipValidation) {
      this.setCustomValidity('');
      this.reportValidity();
    }
  }

  get textInputValue () {
    const targetElementTextArea = this.shadowRoot.querySelector('#ta');
    return targetElementTextArea
      ? targetElementTextArea.value
      : ''
  }

  setPickedElement (itemElement, itemElementConfig, itemElementAttributes) {
    this.itemElement = itemElement;
    this.itemElementConfig = itemElementConfig;
    this.itemElementAttributes = itemElementAttributes;
  }
}

window.customElements.define('ee-autocomplete-input-spans', EeAutocompleteInputSpans);

class EeAutocompleteItemCountry extends ThemeableMixin('ee-autocomplete-item-country')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: block;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }

        :host(:last-child) {
          border-bottom: unset;
        }

        :host(:hover) {
          background-color: #eee;
        }

        li {
          list-style: none;
        }

      `
    ]
  }

  static get properties () {
    return {
      data: {
        type: Object,
        attribute: false
      },
      config: {
        type: Object,
        attribute: false
      }
    }
  }

  constructor () {
    super();
    this.config = {
      id: 'id',
      countryName: 'name',
      countryCapital: 'capital'
    };
  }

  render () {
    return html`
    <li>${this.data[this.config.countryName]} (Capital: ${this.data[this.config.countryCapital]})</li>
    `
  }

  /* API */

  get idValue () {
    return this.data[this.config.id]
  }

  get textValue () {
    return this.data[this.config.countryName]
  }

  stringToData (string) {
    return {
      [this.config.countryName]: string,
      valid: true
    }
  }

  static get PickedElement () {
    return EeAutocompleteItemCountryView
  }
}
customElements.define('ee-autocomplete-item-country', EeAutocompleteItemCountry);

class EeAutocompleteItemCountryView extends ThemeableMixin('ee-autocomplete-item-country-view')(EeAutocompleteItemCountry) {
  static get styles () {
    return [
      css`
        :host {
          position: relative;
          display: inline-block;
          font-size: 0.9em;
        }
      `
    ]
  }

  render () {
    return html`
      ${this.data[this.config.countryName]}
      <slot></slot>
    `
  }
}
customElements.define('ee-autocomplete-item-country-view', EeAutocompleteItemCountryView);

class EeAutocompleteItemEmail extends ThemeableMixin('ee-autocomplete-item-email')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: block;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }

        :host(:last-child) {
          border-bottom: unset;
        }

        :host(:hover) {
          background-color: #eee;
        }

        li {
          list-style: none;
        }

      `
    ]
  }

  static get properties () {
    return {
      data: {
        type: Object,
        attribute: false
      },
      config: {
        type: Object,
        attribute: false
      }
    }
  }

  constructor () {
    super();
    this.config = {
      id: 'id',
      emailName: 'name',
      emailAddress: 'email'
    };
  }

  render () {
    return html`
    <li>${this.textValue}</li>
    `
  }

  /* API */
  get idValue () {
    return this.data[this.config.id]
  }

  get textValue () {
    return this._textValueGetter()
  }

  _textValueGetter (short = false) {
    if (short) return this.data[this.config.emailName] || this.data[this.config.emailAddress]
    const name = this.data[this.config.emailName];
    const address = this.data[this.config.emailAddress];
    if (name && address) return `${name} <${address}>`
    else if (name) return name
    else if (address) return address
    else return ''
  }

  stringToData (string) {
    let emailName;
    let emailAddress;

    if (!string.match('@')) {
      return {
        [this.config.emailName]: string,
        [this.config.emailAddress]: '',
        valid: false
      }
    }

    const emails = string.match(/[^@<\s]+@[^@\s>]+/g);
    if (emails) {
      emailAddress = emails[0];
    }

    const names = string.split(/\s+/);

    if (names.length > 1) {
      names.pop();
      emailName = names.join(' ').replace(/"/g, '');
    }

    const valid = !!emailAddress;

    return {
      [this.config.emailName]: emailName,
      [this.config.emailAddress]: emailAddress,
      valid: valid
    }
  }

  static get PickedElement () {
    return EeAutocompleteItemEmailView
  }
}
customElements.define('ee-autocomplete-item-email', EeAutocompleteItemEmail);

class EeAutocompleteItemEmailView extends ThemeableMixin('ee-autocomplete-item-email-view')(EeAutocompleteItemEmail) {
  static get styles () {
    return [
      css`
        :host {
          position: relative;
          display: inline-block;
          font-size: 0.9em;
        }
      `
    ]
  }

  render () {
    return html`
      ${this._textValueGetter(true)}
      <slot></slot>
    `
  }
}
customElements.define('ee-autocomplete-item-email-view', EeAutocompleteItemEmailView);

class EeAutocompleteItemLi extends ThemeableMixin('ee-autocomplete-item-li')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: block;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }

        :host(:last-child) {
          border-bottom: unset;
        }

        :host(:hover) {
          background-color: #eee;
        }

        li {
          list-style: none;
        }

      `
    ]
  }

  static get properties () {
    return {
      data: {
        type: Object,
        attribute: false
      },
      config: {
        type: Object,
        attribute: false
      }
    }
  }

  constructor () {
    super();
    this.config = {
      id: 'id',
      path: 'name'
    };
  }

  render () {
    return html`
    <li>${this.data[this.config.path]}</li>
    `
  }

  /* API */

  get idValue () {
    return this.data[this.config.id]
  }

  get textValue () {
    return this.data[this.config.path]
  }

  stringToData (string) {
    return {
      [this.config.path]: string
    }
  }

  static get PickedElement () {
    return EeAutocompleteItemLiView
  }
}
customElements.define('ee-autocomplete-item-li', ThemeableMixin('ee-autocomplete-item-li-view')(EeAutocompleteItemLi));

class EeAutocompleteItemLiView extends LitElement {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: inline-block;
        }
      `
    ]
  }

  static get properties () {
    return {
      data: {
        type: Object,
        attribute: false
      },
      config: {
        type: Object,
        attribute: false
      }
    }
  }

  constructor () {
    super();
    this.config = {
      id: 'id',
      path: 'name'
    };
  }

  render () {
    return html`
      -${this.data[this.config.path]}-
    `
  }
}
customElements.define('ee-autocomplete-item-li-view', EeAutocompleteItemLiView);

class EeAutocomplete extends ThemeableMixin('ee-autocomplete')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: block;
          position: relative;
        }

        #suggestions {
          box-sizing: border-box;
          background-color: white;
          position: absolute;
          z-index: 1000;
          max-height: 480px;
          overflow-y: scroll;
          top: 90%;
          box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.2), 0 0 2px 2px rgba(0, 0, 0, 0.05);
        }

        #suggestions[populated] {
          width: 100%;
          padding: 10px;
        }

        #suggestions > *[selected], #suggestions > *:focus, #suggestions > *:hover  {
          background-color: #eee;
        }

        [hidden] {
          display: none !important;
        }
      `
    ]
  }

  static get properties () {
    return {
      url: {
        type: String
      },
      informational: {
        type: Boolean
      },
      target: {
        type: String
      },
      targetForId: {
        type: String,
        attribute: 'target-for-id'
      },
      picked: {
        type: Boolean,
        reflect: true
      },
      suggestions: {
        type: Array,
        attribute: false
      },
      itemElement: {
        type: String,
        attribute: 'item-element'
      },
      itemElementConfig: {
        type: Object,
        attribute: 'item-element-config'
      },
      itemElementAttributes: {
        type: Object,
        attribute: 'item-element-attributes'
      }
    }
  }

  constructor () {
    super();
    this.url = '';
    this.target = null;
    this.targetForId = null;
    this.suggestions = [];
    this.itemElement = 'ee-autocomplete-item-li';
    this.itemElementConfig = {};
    this.itemElementAttributes = {};

    this._boundInputEvent = this._inputEvent.bind(this);
    this._boundKeydownEvent = this._keydownEvent.bind(this);
  }

  // If if's not set, return the first child
  // If it's set:
  //   If it's a string, return the #element
  //   If it's an object, return it directly (assumption that it's an element)
  _findTarget (target) {
    if (target !== null) {
      if (typeof target === 'string') return this.querySelector(`#${target}`)
      else if (typeof target === 'object') return target
    } else {
      return this.children[0]
    }
    return null
  }

  // If if's not set, don't do anything
  // If it's set:
  //   If it's an empty string, look for the first [name] element without no-submit,
  //   If it's a string, return the #element
  //   If it's an object, return it  directly (assumption that it's an element)
  _findTargetForId (target) {
    if (target !== 'null') {
      if (typeof target === 'string') {
        return target === ''
          ? this.querySelector('[name]:not([no-submit])')
          : this.querySelector(`#${target}`)
      } else if (typeof target === 'object') return target
    }
    return null
  }

  connectedCallback () {
    super.connectedCallback();

    this.targetElement = this._findTarget(this.target);
    this.targetForId = this._findTargetForId(this.targetForId);

    console.log('Target element:', this.targetElement);
    console.log('Target for ID element:', this.targetForId);

    if (!this.targetElement) {
      console.error('Target element not found');
      return
    }

    this.targetElement.addEventListener('input', this._boundInputEvent);
    this.targetElement.addEventListener('keydown', this._boundKeydownEvent);

    // API USE: If the target input element implements multiInputApi,
    // then set the basic parameters for all
    // picked items (element name, config and attributes)
    if (this.targetElement.multiInputApi) {
      this.targetElement.setPickedElement(this.itemElement, this.itemElementConfig, this.itemElementAttributes);
    }
  }

  disconnectedCallback () {
    if (!this.targetElement) return

    this.targetElement.removeEventListener('input', this._boundInputEvent);
    this.targetElement.removeEventListener('keydown', this._boundKeydownEvent);
  }

  render () {
    return html`
      <slot></slot>
      <div @click="${this._picked}" id="suggestions" @keydown=${this._handleKeyEvents}></div>
    `
  }

  _keydownEvent (e) {
    switch (e.key) {
    case 'Escape':
      this._dismissSuggestions();
      break
    }
  }

  pickFirst () {
    const suggestionsDiv = this.shadowRoot.querySelector('#suggestions');
    suggestionsDiv.querySelector('[selected]').click();
  }

  focusNext () {
    if (!this.suggestions.length) return
    const suggestionsDiv = this.shadowRoot.querySelector('#suggestions');
    let selected = suggestionsDiv.querySelector('[selected]') || suggestionsDiv.firstElementChild;
    if (this.suggestions.length > 1) {
      selected.toggleAttribute('selected', false);
      selected = selected.nextElementSibling || selected.previousElementSibling;
    }
    if (selected) selected.focus();
  }

  _picked (e) {
    if (this.informational || !this.targetElement) return

    if (this.targetElement.multiInputApi) {
      this.targetElement.pickedElement(e.target.data);
    } else {
      this.targetElement.value = e.target.textValue;
      if (this.targetForId) {
        this.targetForId.value = e.target.idValue;
        this.picked = true;
      }
    }
    this._dismissSuggestions();
    this.targetElement.focus();
  }

  async updated (cp) {
    if (!cp.has('suggestions')) return

    const suggestionsDiv = this.shadowRoot.querySelector('#suggestions');

    while (suggestionsDiv.firstChild) { suggestionsDiv.removeChild(suggestionsDiv.firstChild); }

    if (this._autocompleteInFlight) return

    if (this.targetElement.multiInputApi) {
      if (this.targetElement.textInputValue === '') {
        suggestionsDiv.toggleAttribute('populated', false);
        return
      }
    }

    for (const suggestion of this.suggestions) {
      const el = document.createElement(this.itemElement);
      el.config = { ...el.config, ...this.itemElementConfig };
      for (const k of Object.keys(this.itemElementAttributes)) el.setAttribute(k, this.itemElementAttributes[k]);
      el.data = suggestion;
      el.onkeydown = this._handleKeyEvents.bind(this);
      // Make span focusable AND in the tab list
      el.setAttribute('tabindex', 0);
      suggestionsDiv.appendChild(el);
    }

    // Only 1 response and it's a plain text input? Autocomplete if text fully matches
    // beginning of the only result
    if (
      this.suggestions.length === 1 &&
      !this.targetElement.multiInputApi &&
      typeof this.targetElement.setSelectionRange === 'function'
    ) {
      const firstOption = suggestionsDiv.firstChild;
      const textValue = firstOption.textValue;
      if (textValue.toUpperCase().startsWith(this.targetElement.value.toUpperCase())) {
        const oldValue = this.targetElement.value;
        this.targetElement.value = textValue;
        this.targetElement.setSelectionRange(oldValue.length, textValue.length);
        if (this.targetForId) {
          this.targetForId.value = firstOption.idValue;
          this.picked = true;
        }
      }
    }

    if (!this.suggestions.length) {
      suggestionsDiv.toggleAttribute('populated', false);
    }

    if (this.suggestions.length) {
      suggestionsDiv.toggleAttribute('populated', true);
      suggestionsDiv.firstChild.toggleAttribute('selected', true);
    }
  }

  _dismissSuggestions () {
    const suggestionsDiv = this.shadowRoot.querySelector('#suggestions');
    suggestionsDiv.toggleAttribute('populated', false);
    this.suggestions = [];
  }

  _handleKeyEvents (e) {
    const target = e.currentTarget;

    if (!this.suggestions.length || !target.parentElement) return

    switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      target.previousElementSibling
        ? target.previousElementSibling.focus()
        : target.parentElement.lastElementChild.focus();
      break
    case 'ArrowDown':
      e.preventDefault();
      target.nextElementSibling
        ? target.nextElementSibling.focus()
        : target.parentElement.firstElementChild.focus();
      break
    case 'Tab':
    case 'Enter':
      this._picked(e);
      e.preventDefault();
      this.targetElement.focus();
      break
    case 'Escape':
      this._dismissSuggestions();
      this.targetElement.focus();
      break
    }
  }

  async _inputEvent (e) {
    // Nothing can nor should happen without a target
    const target = this.targetElement;
    if (!target) return

    // There is more input: a new query will be made,
    // so the list is now stale
    this._dismissSuggestions();

    // If the target element is not valid, don't take off at all
    // TAKEN OUT as autocomplete might be necessary to actually make
    // it valid
    // if (!target.validity.valid) {
    //  this.suggestions = []
    //  return
    // }

    // Check if it's inflight. If so, queue up an autocomplete
    // with the same 'e'
    if (this._autocompleteInFlight) {
      this._attemptedAutocompleteFlight = e;
      return
    }
    this._autocompleteInFlight = true;

    if (this.targetForId) {
      this.targetForId.value = '';
      this.picked = false;
    }

    // Set the url, which will also depend on recordId
    const value = target.autocompleteValue || target.value;
    const url = this.url + value;

    const fetchOptions = {
      method: 'GET',
      redirect: 'follow' // manual, *follow, error
    };

    // Attempt the submission
    let networkError = false;
    let response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (e) {
      console.log('ERROR!', e);
      networkError = true;
    }

    // CASE #1: network error.
    if (networkError) {
      console.log('Network error!');

      // Emit event to make it possible to tell the user via UI about the problem
      const event = new CustomEvent('autocomplete-error', { detail: { type: 'network' }, bubbles: true, composed: true });
      this.dispatchEvent(event);

    //
    // CASE #2: HTTP error.
    // Invalidate the problem fields
    } else if (!response.ok) {
      console.log('Fetch error!');

      const errs = await response.json();
      // Emit event to make it possible to tell the user via UI about the problem
      const event = new CustomEvent('autocomplete-error', { detail: { type: 'http', response, errs }, bubbles: true, composed: true });
      this.dispatchEvent(event);

    // CASE #3: NO error. Set fields to their
    // new values
    } else {
      // Convert the result to JSON
      const v = await response.json();

      // Emit event to make it possible to tell the user via UI about the problem
      const event = new CustomEvent('form-ok', { detail: { response }, bubbles: true, composed: true });
      this.dispatchEvent(event);

      this.suggestions = v;
    }

    this._autocompleteInFlight = false;
    if (this._attemptedAutocompleteFlight) {
      const oldE = this._attemptedAutocompleteFlight;
      this._attemptedAutocompleteFlight = false;
      this._inputEvent(oldE);
    }
  }
}
customElements.define('ee-autocomplete', EeAutocomplete);

const close = html`<svg class="icon" height="24" viewBox="0 0 24 24" width="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`;

class EeDrawer extends ThemeableMixin('ee-drawer')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      css`
        :host {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
        }

        :host([opened]) {
          width: 100vw;
          height: 100vh;
        }

        div.container {
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          will-change: transform;
          transform: translateX(-100%);
          overflow-x: hidden;
          transition: transform 0.3s ease-out;
          background-color: var(--drawer-background, initial);
        }

        :host([opened]) div.container {
          will-change: transform;
          transform: translateX(0);
        }

        :host([modal][opened]) div.container {
          box-shadow: var(--drawer-shadow, 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.14), 0 0 0 100vw rgba(0, 0, 0, 0.15)) 
        }

        #close {
          -webkit-appearance: none;
          color: white;
          fill: white;
          position: absolute;
          top: 5px;
          right: 5px;
          z-index: 10;
          background: transparent;
          border: none;
        }

        button#close:focus, button#close:active {
            outline: none !important;
          }

        button#close:active {
          filter: brightness(50%)
        }


        .container > nav  {
          box-sizing: border-box;
          width: 100%;
          min-width: 300px;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
          overflow: scroll;
          padding-bottom: 64px;
        }

        .container > nav ::slotted(a),
        .container > nav ::slotted(.drawer-item) {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
          cursor: pointer;
        }

        .container  > nav ::slotted(a[selected]),
        .container  > nav ::slotted(.drawer-item[selected]) {
          color: var(--app-drawer-selected-color);
          font-weight: bolder;
          border-left: 3px solid var(--app-drawer-selected-color);
          background-color: rgba(255,255,255, 0.1);
        }

        .container  > nav ::slotted(a:hover),
        .container  > nav ::slotted(.drawer-item:hover) {
          background-color: rgba(255,255,255, 0.05);
        }

        .container  > nav ::slotted(* .head) {
          color: white;
          width: 100%;
          border-bottom: 1px solid white;
          padding: 6px 70% 6px 0;
          font-size: 1.15em;
          margin: 10px auto;
        }
      `
    ]
  }

  static get properties () {
    return {
      opened: { type: Boolean, reflect: true },
      modal: { type: Boolean },
      closeButton: { type: Boolean, attribute: 'close-button' }
    }
  }

  constructor () {
    super();
    this.modal = false;
    this.closeButton = true;
    this.opened = false;
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('click', this._handleOutsideClick);
  }

  render () {
    return html`
      <div class="container">
        ${this.closeButton ? html`<button id="close" @click="${this.close}">${close}</button>` : ''}
        <nav>
          <slot></slot>
        </nav>
      </div>
    `
  }

  open () {
    this.opened = true;
  }

  _handleOutsideClick (e) {
    if (e.target.nodeName === 'EE-DRAWER') this.close();
  }

  close () {
    this.opened = false;
  }
}
customElements.define('ee-drawer', EeDrawer);

class EeFab extends ThemeableMixin('ee-fab')(StyleableMixin(LitElement)) {
  static get styles () {
    return css`
      :host {
        display: block;
      }
    `
  }

  render () {
    return html`
    `
  }
}
customElements.define('ee-fab', EeFab);

class EeToolbar extends ThemeableMixin('ee-toolbar')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: flex;
          width: 100%;
          align-items: center;
          position: relative;
          height: 64px;
          padding: 0 5px;
          pointer-events: none;
          font-size: var(--toolbar-font-size, 20px);
        }

        :host ::slotted(*) {
          pointer-events: auto;
        }

        :host ::slotted(.icon) {
          font-size: 0;
        }

        :host ::slotted([title]) {
          pointer-events: none;
          display: flex;
          margin: auto
        }

        :host ::slotted([bottom-item]) {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
        }

        :host ::slotted([top-item]) {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
        }

        :host ::slotted([spacer]) {
          margin-left: 64px;
        }
      `
    ]
  }

  render () {
    return html`
      <slot></slot>
    `
  }
}
customElements.define('ee-toolbar', EeToolbar);

const arrowback = html`<svg class="icon" height="24" viewBox="0 0 24 24" width="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>`;
const menu = html`<svg class="icon" height="24" viewBox="0 0 24 24" width="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;
class EeHeader extends LitElement {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: block;
          width: 100%;
        }

        div#header {
          display: flex;
          width: 100%;
          position: sticky;
          top: 0;
          right: 0;
          width: 100%;
          text-align: center;
          background-color: var(--header-background, var(--app-header-background-color));
          color: var(--header-color, var(--app-header-text-color));
          border-bottom: 1px solid #eee;
        }

        :host([menu]) div[title], 
        :host([back]) div[title] {
          padding-right: 46px;
        }

        :host([menu][back]) div[title]{
          padding-right: 92px;
        }

        .toolbar .subtitle {
          color: rgba(255, 255, 255, 0.75);
        }
        .toolbar button.icon {
          appearance: none;
          -webkit-appearance: none;
          font-size: inherit;
          vertical-align: middle;
          background: transparent;
          border: none;
          cursor: pointer;
          -webkit-appearance: none;
          height: 40px;
          width: 40px;
          padding: 6px ;
          margin: auto 3px;
        }

        .toolbar button.icon:focus, .toolbar button.icon:hover {
          outline: 0;
          background: #eeeeee;
          /* border: 1px solid #bdbdbd; */
        }

        .toolbar button.icon:active {
          outline: 0;
          background: #cccccc;
          border: 1px solid #bdbdbd;
          box-shadow: none
          /* animation: fadeIn 0.1s ease-in; */
        }

        .toolbar button, .toolbar button svg {
          color: var(--app-header-text-color);
          fill: var(--app-header-text-color);
        }

        .toolbar div.actions {
          position: absolute;
          right: 20px;
          display: inline;
        }

        ::slotted([slot=actions]) {
          display: flex
        }

        .toolbar div.actions ::slotted(*[slot="actions"]) a {
          line-height: unset
        }

        .toolbar div.controls {
          align-items: left;
        }

        .toolbar div.controls ::slotted(*[slot="controls"]) {
        }

      `
    ]
  }

  static get properties () {
    return {
      // Users can set these attributes to get built-in basic controls and title text. 
      // Otherwise, they can user their own with slot="controls" and slot="header-title"
      back: { type: Boolean, reflect: true },
      menu: { type: Boolean, reflect: true },
      headerTitle: { type: String, attribute: 'header-title' },
      headerSubtitle: { type: String, attribute: 'header-subtitle' }
    }
  }

  constructor () {
    super();
    this.headerTitle = '';
  }

  render () {
    return html`
      <div id="header">
        <ee-toolbar class="toolbar">
          <div class="controls">
            ${this.menu ? html`<button class="icon" title="Menu" @click="${this._menuEvent}">${menu}</button>` : ''}
            ${this.back || this.history.length > 1 ? html`<button class="icon" title="Back" @click="${this._backEvent}">${arrowback}</button>` : ''}
            <slot name="controls"></slot>
          </div>
          <div title>
          ${this.headerTitle
            ? html`
                ${this.headerTitle}
                ${this.headerSubtitle ? html`<div class="subtitle">${this.headerSubtitle}</div>` : ''}
            `
            : html`
              <slot name="header-title"></slot>
            `
          }
          </div>
          <div class="actions">
            <slot name="actions"></slot>
          </div>
        </ee-toolbar>
        <slot name="sub-toolbar"></slot>
      </div>
    `
  }

  _menuEvent () {
    this.dispatchEvent(new CustomEvent('menu-clicked'));
  }

  _backEvent () {
    this.dispatchEvent(new CustomEvent('back-clicked'));
  }
}
customElements.define('ee-header', EeHeader);

class EeNavBar extends ThemeableMixin('ee-nav-bar')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 56px;
          z-index: 100;
        }

        :host nav {
          display: flex;
          width: 100%;
          height: 64px;
          background: var(--ee-nav-bar-background, var(--app-primary-color));
          color: var(--ee-nav-bar-color, var(--app-light-text-color));
          fill: var(--ee-nav-bar-color, var(--app-light-text-color));
        }

        :host nav > ::slotted(*[nav-item]) {
          margin: 0 auto;
          padding: 8px 12px;
          display: block;
          position: relative;
          opacity: 0.7;
          height: 24px;
          min-width: 80px;
          max-width: 168px;
          text-align: center;
        }

        :host nav > ::slotted(*[nav-item])::after {
          content: attr(item-label);
          position: absolute;
          top: 24px;
          left: 50%;
          line-height: 12px;
          font-size: 12px;
          transform: translateX(-50%);
          margin-top: 6px;
          padding: 6px;
          white-space: nowrap;
          text-transform: uppercase;
        }

        :host nav > ::slotted(*[selected]) {
          opacity: 1;
        }
      `
    ]
  }

  static get properties () {
    return {
      selected: { type: String, reflect: true },
      selectedAttribute: { type: String },
      eventBubbles: { type: Boolean }
    }
  }

  constructor () {
    super();
    this.selected = '';
    this.eventBubbles = false;
    this.selectedAttribute = 'name';
  }

  render () {
    return html`
      <nav>
        <slot @slotchange="${this._manageSlotted}"></slot>
      </nav>
    `
  }

  connectedCallback () {
    super.connectedCallback();
    // Listen to local clicked-slot event
    this.addEventListener('clicked-slot', this._fireSelectedEvent);
  }

  // This adds a click event listener to all slotted children (the tabs)
  _manageSlotted (e) {
    const slot = e.currentTarget;
    const slotted = slot.assignedNodes();
    for (const element of slotted) {
      element.addEventListener('click', this._clickedSlotted.bind(this));
    }
  }

  // Each tab runs this and fires a clicked-slot event, which carries the selected value, It gets the value from the name attribute of the slotted "tab"
  _clickedSlotted (e) {
    console.log('slot clicked', this.selectedAttribute);
    this.dispatchEvent(new CustomEvent('clicked-slot', { detail: { event: e, selected: e.currentTarget.getAttribute(this.selectedAttribute) } }));
  }

  // This function runs when the host element receives a clicked-slot event from it's children. It sets the selected property and fires a 'selected-changed' event with that value.
  _fireSelectedEvent (e) {
    this.dispatchEvent(new CustomEvent('selected-changed', { detail: { selected: e.detail.selected } }));
    this.selected = e.detail.selected;
  }
}
customElements.define('ee-nav-bar', EeNavBar);

class EeNetwork extends ThemeableMixin('ee-network')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          display: block;
          position: relative;
        }

        :host([inline]) {
          display: inline-block;
        }

        #overlay {
          display: none; /* Hide by default */
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          text-align: center;
          transition: background var(--hot-network-transition-duration, 200ms);
          @apply(--hot-network-overlay);
        }
        #overlay.overlay-loading {
          display: block;
          color: var(--hot-network-overlay-loading-color, #666);
          /*background-color: var(--hot-network-overlay-loading-background-color, #d9dce0);*/
          background-color: var(--hot-network-overlay-loading-background-color, rgba(102, 102, 102, 0.25));
        }
        #overlay.clear {
        }
        #overlay.overlay-error {
          display: block;
          cursor: pointer; /* Hint that the object is clickable */
          color: var(--hot-network-overlay-error-color, #c00);
          background-color: var(--hot-network-overlay-error-background-color, rgba(255, 0, 0, 0.25));
        }

        #content-wrapper.overlay-error {
          pointer-events: none;
          opacity: 0.25;
          min-height: 1.25rem; /* FIXME: find a proper value, this is made up */
        }
      `
    ]
  }

  static get properties () {
    return {
      manageLoadingErrors: {
        type: Boolean,
        attribute: 'manage-loading-errors'
      },
      reloadMethod: {
        type: String,
        attribute: 'reload-method'
      },
      noReloadOnTap: {
        type: Boolean,
        attribute: 'no-reload-on-tap'
      },
      status: {
        type: String
      },
      statusMessages: {
        type: Object,
        attribute: 'status-messages'
      },

      messenger: {
        type: Function,
        attribute: false
      },
      overlayClass: {
        type: String,
        attribute: false
      }
    }
  }

  constructor () {
    super();
    this.manageLoadingErrors = false;
    this.reloadMethod = null;
    this.noReloadOnTap = false;
    this.status = 'loaded';
    this.statusMessages = {
      loading: 'Loading\u2026', // &hellip; equivalent
      saving: 'Saving\u2026', // &hellip; equivalent
      error: 'An error has occurred. Click here to try again.'
    };

    this.lastInitObject = null;
    this.lastUrl = null;
  }

  render () {
    return html`
      <div id="overlay" class="${this.overlayClass}" @click="${this._overlayClicked}">
        ${this.statusMessages[this.status]}
      </div>
      <div id="content-wrapper" class="${this.status}">
        <slot></slot>
      </div>
    `
  }

  firstUpdated () {
    this._setOverlay();
  }

  _setOverlay () {
    switch (this.status) {
    case 'loaded':
    case 'saved':
    case 'saving-error':
      this.overlayClass = 'clear';
      break
    case 'loading':
    case 'saving':
      this.overlayClass = 'overlay-loading';
      break
    case 'loading-error':
      this.overlayClass = this.manageLoadingErrors ? 'overlay-error' : 'clear';
    }
  }

  _overlayClicked (e) {
    if (this.noReloadOnTap) return

    // Stop the event here
    e.stopPropagation();
    e.preventDefault();

    // If the status is 'error', try to reload
    if (this.status === 'loading-error') {
      if (!this.reloadMethod) this.fetch(this.lastUrl, this.lastInitObject);
      else this.reloadMethod(this.lastUrl, this.lastInitObject);
    }
  }

  messenger () {}

  async fetch (url, initObject) {
    this.lastUrl = url;
    this.lastInitObject = initObject;

    // Work out manageErrors, which will only ever
    // applu to GET
    const fetchMethod = (initObject && initObject.method && initObject.method.toUpperCase()) || 'GET';
    const isGet = fetchMethod === 'GET';

    this.status = isGet ? 'loading' : 'saving';
    this._setOverlay();
    this.messenger(this.status, url, initObject);
    try {
      const response = await fetch(url, initObject);
      if (response.ok) {
        this.status = isGet ? 'loaded' : 'saved';
      } else {
        this.status = isGet ? 'loading-error' : 'saving-error';
      }
      this._setOverlay();
      this.messenger(this.status, url, initObject, response);
      return response
    } catch (e) {
      this.status = isGet ? 'loading-error' : 'saving-error';
      this._setOverlay();
      this.messenger(this.status, url, initObject);
      throw (e)
    }
  }
}
customElements.define('ee-network', EeNetwork);

class EeSnackBar extends ThemeableMixin('ee-snack-bar')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      css`
        :host {
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          background-color: var(--app-primary-color);
          color: var(--app-light-text-color);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          will-change: transform;
          transform: translate3d(0, 100%, 0);
          transition-property: visibility, transform;
          transition-duration: 0.2s;
          visibility: hidden;
        }

        :host([active]) {
          visibility: visible;
          transform: translate3d(0, 0, 0);
        }

        :host([theme="success"]) {
          background-color: green;
          color: white;
        }

        :host([theme="info"]) {
          background-color: gray;
          color: white;
        }

        :host([theme="error"]) {
          background-color: red;
          color: white;
        }
        @media (min-width: 460px) {
          :host {
            width: 320px;
            margin: auto;
          }
        }
      `
    ]
  }

  render () {
    return html`
      ${this.message}
    `
  }

  static get properties () {
    return {
      active: { type: Boolean, reflect: true },
      message: { type: String }
    }
  }

  _eventListener (e) {
    const theme = e.detail.theme || 'info';
    this.setAttribute('theme', theme);
    this.message = e.detail.message;
    this.show();
  }

  connectedCallback () {
    super.connectedCallback();
    document.addEventListener('snack-bar', this.boundEventListener);
  }

  disconnectedCallback () {
    super.disconnectedCallBack();
    document.removeEventListener('snack-bar', this.boundEventListener);
  }

  constructor () {
    super();
    this.active = false;
    this.boundEventListener = this._eventListener.bind(this);
    this.intervalId = null;
  }

  show () {
    this.active = true;
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => { this.active = false; }, 3000);
  }
}

window.customElements.define('ee-snack-bar', EeSnackBar);

class EeTabs extends ThemeableMixin('ee-tabs')(StyleableMixin(LitElement)) {
  static get styles () {
    return [
      super.styles || [],
      css`
        :host {
          width: 100%;
          height: 42px;
          padding-top: 0;
        }

        :host nav {
          border-bottom: 1px solid var(--app-lines-color);
          display: flex;
        }

        :host nav ::slotted(*) .icon {
          fill: var(--app-drawer-text-color);
        }

        :host nav > ::slotted(*[selected]) .icon {
          fill: var(--app-header-selected-color);
        }

        :host nav > ::slotted(*) {
          color: var(--app-dark-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
          border: unset;
          border-right: 1px solid var(--app-lines-color);
          border-bottom: 4px inset transparent;
          font-size: 0.9em;
          border-radius: 0;
          width: 100%;
          text-align: center;
        }

        :host nav > ::slotted(*:last-child) {
          border-right: unset
        }

        :host nav > ::slotted(*[selected]) {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-primary-color);
        }

        :host nav > ::slotted(*:focus) {
          outline:0 ;
          background: whitesmoke;
          /* border: 1px solid #bdbdbd; */
        }

        :host nav > ::slotted(*:active) {
          background: #cccccc;
          border-bottom: 4px inset #bdbdbd;
          box-shadow: none;
          animation: fadeIn 0.2s ease-in;
        }

        :host nav > ::slotted(*[disabled]) {
          box-shadow: none
        }

        :host nav > ::slotted(*.icon:active) {
          background: #cccccc;
          border: unset;
          border-radius: 50%;
        }

        :host nav > ::slotted(*.icon:hover) svg, :host > ::slotted(*:hover) svg {
          fill: var(--app-primary-color);
        }
      `
    ]
  }

  static get properties () {
    return {
      default: { type: String },
      selected: { type: String, reflect: true },
      selectedAttribute: { type: String },
      eventBubbles: { type: Boolean }
    }
  }

  constructor () {
    super();
    this.selected = '';
    this.eventBubbles = false;
    this.selectedAttribute = 'name';
  }

  /** Tabs usage
   * add elements with a slot="tabs" within the nl-tabs tags to create tabs.
   * Tab elements must have an id. Index support will be added soon
   */
  render () {
    return html`
    <nav>
      <slot @slotchange="${this._manageSlotted}"></slot>
    </nav>
    `
  }

  firstUpdated () {
    const slotted = this.shadowRoot.querySelector('slot').assignedElements();
    if (!slotted.length) return
    const defaultTab = this.default ? slotted.filter(i => i.getAttribute('name') === this.default)[0] : slotted[0];
    const selected = defaultTab.getAttribute('name');
    if (defaultTab) {
      this.dispatchEvent(new CustomEvent('selected-changed', { detail: { selected: selected } }));
      this.selected = selected;
    }
  }

  connectedCallback () {
    super.connectedCallback();
    // Listen to local clicked-slot event
    this.addEventListener('clicked-slot', this._fireSelectedEvent);
  }

  // This adds a click event listener to all slotted children (the tabs)
  _manageSlotted (e) {
    const slot = e.currentTarget;
    const slotted = slot.assignedElements();
    for (const element of slotted) {
      element.addEventListener('click', this._clickedSlotted.bind(this));
    }
  }

  // Each tab runs this and fires a clicked-slot event, which carries the selected value, It gets the value from the name attribute of the slotted "tab"
  _clickedSlotted (e) {
    console.log('slot clicked', this.selectedAttribute);
    this.dispatchEvent(new CustomEvent('clicked-slot', { detail: { event: e, selected: e.currentTarget.getAttribute(this.selectedAttribute) } }));
  }

  // This function runs when the host element receives a clicked-slot event from it's children. It sets the selected property and fires a 'selected-changed' event with that value.
  _fireSelectedEvent (e) {
    this.dispatchEvent(new CustomEvent('selected-changed', { detail: { selected: e.detail.selected } }));
    this.selected = e.detail.selected;
  }
}
customElements.define('ee-tabs', EeTabs);

// NativeReflectorMixin
// ====================
//
// This is the centrepiece of the `nn-`` elements. Every `nn-` element has the
// characteristic of being basically a native element with theming steroids.
// Each `nn-` element has, in its template, a native element marked as
// `id="native"` which identifies the element they represent. For example
// the `Button.js` file will implement `nn-button` element, which in turn will
// have `<button id="native"` in its template.
//
// The approach to `nn-` elements is to reflect as much as possible, in terms
// of properties and attributes, from the `nn-` element down to the `native` one.
//
// This means that the `nn-` element is a "gateway" to properties and attributes
// of the actual native element inside.
//
// For example writing:
//
//     <nn-button label="Some label"></nn-button>
//
// Will imply that the contained `<button>` element (which is marked as
// `native`) also has the `label` attribute set to `Some label`.
//
// The idea is that between `<nn-button>` and `<button>` _everything_ is
// reflected. This is great in theory, but there is a level of trickery
// required to make things work properly. For example some attributes will
// _always_ need to be skipped (`id`, `style`, `class`). Also, it's impossible
// to simply reflect every property, since 1) they could be anywhere in the
// prototype chain 2) Some properties should never be reflected (see:
// `setAttribute()`, `hasChildNodes()`, and so on).
//
// So, the approach is:
//
//  * All attributes are reflected, _except_ some that are blacklisted (in
//    `this.skipAttributes`)
//  * Only properties/methods listed in `this.reflectProperties` are reflected.
//    Each element will provide a comprehensive list of reflected properties, which
//    will depend on the HTML specs of the targeted `native` element.
//  * Some "boot" properties are assigned when the element is first updated.
//
// ## Into the code
//
// First of all, NativeRefletorMixin is declared as a mixing in function:
const NativeReflectorMixin = (base) => {
  return class Base extends base { // eslint-disable-line

// The firstUpdated method is used to perform one-time work after the element's
// template has been created. In this case, it will need to:
//
// 1) Find the native element (marked with `id="native"`)
// 3) Start reflection of attributes and properties
//
    firstUpdated () {
      /* Find the native element */
      this.native = this.shadowRoot.querySelector('#native');

      /* Reflect all attributes and properties */
      /*  - all properties are reflected except some (listed in skipAttributes) */
      /*  - only elected properties are reflected (listed in reflectProperties) */
      this._reflectAttributesAndProperties();
    }

    // From https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
    get reflectProperties () {
      return [
        'accessKey', 'accessKeyLabel', 'contentEditable', 'isContentEditable', 'contextMenu ', 'dataset', 'dir', 'draggable', 'dropzone', 'hidden', 'inert', 'innerText', 'itemScope ', 'itemType', 'itemId ', 'itemRef', 'itemProp', 'itemValue ', 'lang', 'noModule', 'nonce', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth', 'properties', 'spellcheck', 'style', 'tabIndex', 'title', 'translate', 'attachInternals', 'blur', 'click', 'focus', 'forceSpellCheck'
      ]
    }

    get skipAttributes () {
      return ['id', 'style', 'class']
    }

    afterSettingProperty () {}

    getAttribute (attr) {
      if (this.skipAttributes.indexOf(attr) !== -1) {
        return super.getAttribute(attr)
      }

      const nativeAttribute = this.native.getAttribute(attr);
      if (nativeAttribute !== null) return nativeAttribute

      // This shouldn't really happen, but it's here as a fallback
      // TODO: Maybe delete it and always return the native's value regardless
      return super.getAttribute(attr)
    }

    setAttribute (attr, value) {
      // Set the attribute
      super.setAttribute(attr, value);

      // Skip the ones in the skipAttributes list
      if (this.skipAttributes.indexOf(attr) !== -1) return

      // Assign the same attribute to the contained native
      // element, taking care of the 'nn' syntax
      //
      this._setSubAttr(attr, value);
    }

    removeAttribute (attr) {
      // Set the attribute
      super.removeAttribute(attr);

      // Skip the ones in the skipAttributes list
      if (this.skipAttributes.indexOf(attr) !== -1) return

      // Assign the same attribute to the contained native
      // element, taking care of the 'nn' syntax
      //
      this._setSubAttr(attr, null);
    }

    _setSubAttr (subAttr, attrValue) {
      const tokens = subAttr.split('::');

      // Safeguard: if this.native is not yet set, it means that
      // an attribute was set BEFORE the element was rendered. If that
      // is the case, simply give up. _reflectAttributesAndProperties() will
      // be run afterwards to sync things up anyway
      if (!this.native) return

      // No :: found, simply change attribute in `native`
      if (tokens.length === 1) {
        (attrValue === null)
          ? this.native.removeAttribute(subAttr)
          : this.native.setAttribute(subAttr, attrValue);

      // Yes, :: is there: assign the attribute to the element with the
      // corresponding ID
      } else if (tokens.length === 2) {
        const dstElement = this.shadowRoot.querySelector(`#${tokens[0]}`);
        if (dstElement) {
          attrValue === null
            ? dstElement.removeAttribute(tokens[1])
            : dstElement.setAttribute(tokens[1], attrValue);
        }
      }
    }

    _reflectAttributesAndProperties () {
      const dst = this.native;

      // STEP #1: ATTRIBUTES FIRST

      // Assign all starting attribute to the destination element
      for (const attributeObject of this.attributes) {
        const attr = attributeObject.name;

        if (this.skipAttributes.indexOf(attr) !== -1) continue
        this._setSubAttr(attr, super.getAttribute(attr));
      }

      // Observe changes in attribute from the source element, and reflect
      // them to the destination element
      const thisObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            const attr = mutation.attributeName;

            // Don't reflect forbidden attributes
            if (this.skipAttributes.indexOf(attr) !== -1) return

            // Don't reflect attributes with ::
            if (attr.indexOf('::') !== -1) return

            // Check if the value has changed. If it hasn't, there is no
            // point in re-assigning it, especially since the observer
            // might have been triggered by this very mixin
            const newValue = this.native.getAttribute(attr);
            const thisValue = super.getAttribute(attr);
            if (newValue === thisValue) return

            // Assign the new value
            (newValue === null)
              ? super.removeAttribute(attr)
              : super.setAttribute(attr, newValue);
          }
        });
      });
      thisObserver.observe(this.native, { attributes: true });

      // STEP #2: METHODS (as bound functions) AND PROPERTIES (as getters/setters)

      const uniqProps = [...new Set(this.reflectProperties)];
      uniqProps.forEach(prop => {
        let oldProp;
        if (Object.prototype.hasOwnProperty.call(this, prop)) oldProp = this[prop];
        Object.defineProperty(Object.getPrototypeOf(this), prop, {
          get: function () {
            if (typeof dst[prop] === 'function') return dst[prop].bind(dst)
            else return dst[prop]
          },
          set: function (newValue) {
            if (typeof this.beforeSettingProperty === 'function') {
              this.beforeSettingProperty(prop, newValue);
            }
            if (typeof dst[prop] === 'function') return
            const oldValue = dst[prop];

            // Set the new value
            dst[prop] = newValue;

            // This is required by litElement since it won't
            // create a setter if there is already one
            this._requestUpdate(prop, oldValue);

            if (typeof this.afterSettingProperty === 'function') {
              this.afterSettingProperty(prop, newValue);
            }
          },
          configurable: true,
          enumerable: true
        });
        if (typeof oldProp !== 'undefined') {
          delete this[prop];
          this[prop] = oldProp;
        }
      });
    }
  }
};

/* globals customElements */
class NnForm extends ThemeableMixin('nn-form')(StyleableMixin(NativeReflectorMixin(LitElement))) {
  get reflectProperties () {
    return [
      ...super.reflectProperties,
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement -checkValidity -reportValidity -reset -elements
      ...['length', 'name', 'method', 'target', 'action', 'encoding', 'enctype', 'acceptCharset', 'autocomplete', 'noValidate', 'requestAutocomplete', 'submit']
    ]
  }

  reportValidity () {
    // Check validity in form
    let valid = true;

    for (const el of this.elements) {
      if (typeof el.reportValidity === 'function') {
        // Native element may have customValidity set
        // by a server response. Clear any existing custom
        // errors and report validity
        el.setCustomValidity('');
        if (!el.reportValidity()) {
          valid = false;
        }
      }
    }
    return valid
  }

  checkValidity () {
    // Check validity in form
    let valid = true;
    // if (!this.native.checkValidity()) valid = false

    for (const el of this.elements) {
      if (typeof el.checkValidity === 'function') {
        // Native element may have customValidity set
        // by a server response. Clear any existing custom
        // errors and report validity
        el.setCustomValidity('');
        if (!el.checkValidity()) {
          valid = false;
        }
      }
    }
    return valid
  }

  setFormElementValue (elName, value) {
    const el = [...this.elements].find(el => {
      if (this._radioElement(el)) {
        return el.name === elName && el.value === value
      } else {
        return el.name === elName
      }
    });

    if (!el) return

    // Get the original value
    const valueSource = this._getElementValueSource(el);

    // CHECKBOXES
    if (this._checkboxElement(el)) {
      el[valueSource] = !!value;

    // RADIO
    // Radio elements
    } else if (this._radioElement(el)) {
      el[valueSource] = true;
      const others = [...this.elements].filter(e =>
        el !== e &&
        this._radioElement(el)
      );
      for (const other of others) other[valueSource] = false;

    // SELECT
    // Selectable elements (with prop selectedIndex)
    } else if (this._selectElement(el)) {
      if (!value) el.selectedIndex = 0;
      else el[valueSource] = value;

    // Any other case
    } else {
      el[valueSource] = value;
    }
  }

  getFormElementValue (elName) {
    const elements = [...this.elements].filter(el => el.name === elName);

    if (!elements.length) {
      console.error('Trying to set', elName, 'but no such element in form');
      return
    }

    if (elements.length === 1) {
      const el = elements[0];

      const valueSource = this._getElementValueSource(el);
      if (this._checkboxElement(el)) {
        return el[valueSource]
          ? (el.value ? el.value : 'on')
          : undefined
      } else if (this._selectElement(el)) {
        return el[valueSource]
      } else {
        return el[valueSource]
      }
    } else {
      const nonRadio = elements.filter(el => !this._radioElement(el));
      if (nonRadio.length) {
        console.error('Duplicate name', elName, 'for non-radio elements');
        return
      }

      const checked = elements.find(el => {
        const valueSource = this._getElementValueSource(el);
        return el[valueSource]
      });
      if (checked) return checked.value
      else return undefined
    }
  }

  reset () {
    if (!this.native) return

    this.native.reset();

    // TODO: Adjust this for radios in a nice sensible way
    for (const el of this.elements) {
      const valueSource = this._getElementValueSource(el);

      if (this._radioElement(el)) {
        el[valueSource] = el.getAttribute(valueSource) !== null;
      } else if (this._checkboxElement(el)) {
        el[valueSource] = el.getAttribute(valueSource) !== null;
      } else {
        el[valueSource] = el.getAttribute(valueSource);
      }
    }
  }

  _selectElement (el) {
    if (typeof el.selectedIndex !== 'undefined' || el.getAttribute('as-select') !== null) return true
    return false
  }

  _checkboxElement (el) {
    if (el.type === 'checkbox') return true
    if (el.getAttribute('as-checkbox') !== null) return true
    return false
  }

  _radioElement (el) {
    if (el.type === 'radio') return true
    if (el.getAttribute('as-radio') !== null) return true
    return false
  }

  _getElementValueSource (el) {
    if (el.type === 'checkbox' || el.type === 'radio') return 'checked'
    if (el.getAttribute('value-source')) return el.getAttribute('value-source')
    return 'value'
  }

  get elements () {
    // A tags (links) can have "name", filter them out
    return [...this.querySelectorAll('[name]')].filter(el => el.tagName !== 'A')
  }

  render () {
    return html`
      ${this.customStyle}
      <form id="native">
        <slot></slot>
      </form>
    `
  }
}
customElements.define('nn-form', NnForm);

/* globals customElements CustomEvent */
class EnForm extends ThemeableMixin('en-form')(NnForm) {
  get reflectProperties () {
    // The `submit` and `elements` properties have been redefined
    return super.reflectProperties.filter(attr => attr !== 'submit')
  }

  static get properties () {
    return {

      fetchingElement: {
        type: String,
        attribute: 'fetching-element'
      },

      recordId: {
        type: String,
        attribute: 'record-id'
      },

      setFormAfterSubmit: {
        type: Boolean,
        attribute: 'set-form-after-submit'
      },

      resetFormAfterSubmit: {
        type: Boolean,
        attribute: 'reset-form-after-submit'
      },

      validateOnLoad: {
        type: Boolean,
        attribute: 'validate-on-load'
      },

      validateOnRender: {
        type: Boolean,
        attribute: 'validate-on-render'
      },

      submitCheckboxesAsNative: {
        type: Boolean,
        attribute: 'submit-checkboxes-as-native'

      },
      noAutoload: {
        type: Boolean,
        attribute: 'no-autoload'
      },

      // This will allow users to redefine methods declaratively
      createSubmitObject: Function,
      presubmit: Function,
      response: Function,
      setFormElementValues: Function,
      extrapolateErrors: Function

    }
  }

  constructor () {
    super();
    this.validateOnLoad = false;
    this.validateOnRender = false;
    this.fetchingElement = null;
    this.submitCheckboxesAsNative = false;
    this._boundRealtimeSubmitter = this._realTimeSubmitter.bind(this);
    this.inFlight = false;
    this.attemptedFlight = false;
    this.inFlightMap = new WeakMap();
    this.attemptedFlightMap = new WeakMap();
  }

  async _allChildrenCompleted () {
    // Wait for all children to be ready to rock and roll
    for (const el of this.elements) {
      // TODO: What about React, Vue, etc.? Uniform API across element libraries?
      if (typeof el.updateComplete !== 'undefined') {
        await el.updateComplete;
      }
    }
  }

  _realTimeSubmitter (e) {
    this.submit(e.target);
  }

  connectedCallback () {
    super.connectedCallback();
    this._allChildrenCompleted().then(() => {
      for (const el of this.elements) {
        const realTime = el.getAttribute('real-time') !== null;
        const realTimeEvent = el.getAttribute('real-time-event') || 'input';
        if (!realTime || !realTimeEvent) continue
        this.addEventListener(realTimeEvent, this._boundRealtimeSubmitter);
      }
    });
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    for (const el of this.elements) {
      const realTime = el.getAttribute('real-time');
      if (realTime === null) continue
      const realTimeEvent = el.getAttribute('real-time-event');
      if (!realTimeEvent) continue

      this.removeEventListener(realTimeEvent, this._boundRealtimeSubmitter);
    }
  }

  async firstUpdated () {
    super.firstUpdated();

    if (this.validateOnRender) {
      await this._allChildrenCompleted();
      // Check validity
      this.reportValidity();
    }

    /*
    const form = this
    this.addEventListener('change', (e) => {
      const el = form.elements.find(el => el === e.target)
      const eventNameForElement = el.getAttribute('real-time-event')
      if (el && el.realTime) form.submit(el)
    })
    */
  }

  setFormElementValues (o) {
    for (const k in o) {
      this.setFormElementValue(k, o[k]);
    }
  }

  setRecordObject (o) {
    o = { ...o };
    const elHash = {};
    for (const el of this.elements) elHash[el.name] = el;

    for (const k of Object.keys(elHash)) {
      o[k] = this.getFormElementValue(k);
    }
    return o
  }

  extrapolateErrors (o) {
    return o
  }

  createSubmitObject (elements) {
    const r = {};
    for (const el of elements) {
      // Radio will only happen once thanks to checking for undefined
      if (typeof r[el.name] !== 'undefined') continue
      if (el.getAttribute('no-submit') !== null) continue
      // Checkboxes are special: they might be handled as native ones,
      // (NOTHING set if unchecked, and their value set if checked) or
      // as booleans (true for checked, or false for unchecked)
      if (this._checkboxElement(el)) {
        if (this.submitCheckboxesAsNative) {
          // As native checkboxes.
          const val = this.getFormElementValue(el.name);
          if (val) r[el.name] = val;
        } else {
          // As more app-friendly boolean value
          r[el.name] = !!this.getFormElementValue(el.name);
        }
      } else {
        r[el.name] = this.getFormElementValue(el.name);
      }
    }
    return r
  }

  presubmit () {}

  response () {}

  _disableElements (elements) {
    for (const el of elements) {
      if (!el.disabled) el.setAttribute('disabled', true);
    }
  }

  _enableElements (elements) {
    for (const el of elements) el.removeAttribute('disabled');
  }

  _fetchEl (specificElement) {
    // Tries to figure out what the fetching element is.
    // if fetching-element was passed, then it's either considered an ID
    // or the element itself.
    // Otherwise it will look for an ee-network or with an element with class
    // .network. Finally, it will use `window`
    if (specificElement) {
      let pEl;
      pEl = specificElement;
      let found = false;
      while (pEl.parentElement) {
        pEl = pEl.parentElement;
        if (pEl.tagName === 'EE-NETWORK' || pEl.classList.contains('network')) {
          found = true;
          break
        }
      }
      return found ? pEl : window
    } else {
      if (this.fetchingElement) {
        if (typeof this.fetchingElement === 'string') return this.querySelector(`#${this.fetchingElement}`)
        else return this.fetchingElement
      } else {
        let maybeNetwork = this.querySelector('ee-network');
        if (!maybeNetwork) maybeNetwork = this.querySelector('.network');
        return maybeNetwork || window
      }
    }
  }

  async submit (specificElement) {
    // Clear all custom validities if they are set
    // Native elements will NEED this, or any invalid state
    // will persist even if validation passes
    let submitObject;
    if (specificElement) {
      if (typeof specificElement.setCustomValidity === 'function') specificElement.setCustomValidity('');
      if (!specificElement.reportValidity()) return
      submitObject = this.createSubmitObject([specificElement]);
    } else {
      for (const el of this.elements) {
        if (typeof el.setCustomValidity === 'function') el.setCustomValidity('');
      }
      if (!this.reportValidity()) return
      submitObject = this.createSubmitObject(this.elements);
    }

    // inFlightMap is a map of all connections, using the specificElement
    // as key (or "window" if there is no specific element)
    const mapIndex = specificElement || this;

    // The connection is ongoing: add a "specificElement" to the attempted
    // field, and simply return.
    // Towards the end, this function will check that "attempted" which,
    // if set, means that the form needs to be resubmitted with that
    // specificElement
    if (this.inFlightMap.has(mapIndex)) {
      this.inFlightMap.set(mapIndex, { attempted: true });
      return
    }
    this.inFlightMap.set(mapIndex, { attempted: false });

    // The element's method can only be null, POST or PUT.
    // If not null, and not "PUT", it's set to "POST"
    let elementMethod = this.getAttribute('method');
    if (elementMethod && elementMethod.toUpperCase() !== 'PUT') {
      elementMethod = 'POST';
    }

    // The 'method' attribute will have priority no matter what.
    // If `method` is not set, then it will depend on recordId (PUT if present,
    // POST if not)
    const method = elementMethod === null
      ? this.recordId ? 'PUT' : 'POST'
      : elementMethod;

    // Set the url, which will also depend on recordId
    const action = this.getAttribute('action');
    if (!action) throw new Error('The submitted form has no action URL set')
    const url = action + (this.recordId ? `/${this.recordId}` : '');

    const fetchOptions = {
      url,
      method,
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow', // manual, *follow, error
      body: submitObject // body data type must match "Content-Type" header
    };

    // HOOK: Allow devs to customise the request about to be sent to the server
    this.presubmit(fetchOptions);

    // Disable the elements
    if (!specificElement) this._disableElements(this.elements);

    // fetch() wants a stingified body
    fetchOptions.body = JSON.stringify(fetchOptions.body);

    // Attempt the submission
    let networkError = false;
    let response;
    let errs;
    try {
      const el = this._fetchEl(specificElement);
      response = await el.fetch(fetchOptions.url, fetchOptions);
    } catch (e) {
      console.log('ERROR!', e);
      networkError = true;
    }

    // CASE #1: network error.
    if (networkError) {
      console.log('Network error!');

      // Re-enable the elements
      if (!specificElement) this._enableElements(this.elements);

      // Emit event to make it possible to tell the user via UI about the problem
      const event = new CustomEvent('form-error', { detail: { type: 'network' }, bubbles: true, composed: true });
      this.dispatchEvent(event);

      // Response hook
      this.response(null, null);
    //
    // CASE #2: HTTP error.
    // Invalidate the problem fields
    } else if (!response.ok) {
      //
      // Try and get the errors object from the reponse's json
      const originalErrs = await response.json();
      errs = this.extrapolateErrors(originalErrs) || {};

      // Emit event to make it possible to tell the user via UI about the problem
      const event = new CustomEvent('form-error', { detail: { type: 'http', response, errs }, bubbles: true, composed: true });
      this.dispatchEvent(event);

      // Re-enable the elements
      // This must happen before setCustomValidity() and reportValidity()
      if (!specificElement) this._enableElements(this.elements);

      // Set error messages
      if (errs.errors && errs.errors.length) {
        const elHash = {};
        for (const el of this.elements) {
          elHash[el.name] = el;
        }
        for (const err of errs.errors) {
          const el = elHash[err.field];
          if (el) {
            el.setCustomValidity(err.message);
            el.reportValidity();
          }
        }
      }

      // Response hook
      this.response(response, errs);
    // CASE #3: NO error. Set fields to their
    // new values
    } else {
      // Convert the result to JSON
      const v = await response.json();



      let attempted;
      if (this.inFlightMap.has(mapIndex)) {
        attempted = this.inFlightMap.get(mapIndex).attempted;
      }

      // HOOK Set the form values, in case the server processed some values
      // Note: this is only ever called if set-form-after-submit was
      // passed to the form.
      if (this.setFormAfterSubmit) {
        // Won't overwrite fields if another attempt is queued
        if (!attempted) {
          if (!specificElement) {
            this.setFormElementValues(v);
          } else {
            const name = mapIndex.name;
            this.setFormElementValues({ [name]: v[name] });
          }
        }
      }

      if (this.resetFormAfterSubmit && !attempted && !specificElement) this.reset();

      // Re-enable the elements
      if (!specificElement) this._enableElements(this.elements);

      // Emit event to make it possible to tell the user via UI about the problem
      const event = new CustomEvent('form-ok', { detail: { response }, bubbles: true, composed: true });
      this.dispatchEvent(event);

      // Response hook
      this.response(response, v);
    }

    if (this.inFlightMap.has(mapIndex)) {
      const attempted = this.inFlightMap.get(mapIndex).attempted;
      this.inFlightMap.delete(mapIndex);
      if (attempted) {
        this.submit(specificElement);
      }
    }
    /*
    this.inFlight = false
    if (this.attemptedFlight) {
      const oldEl = this.attemptedFlight
      this.attemptedFlight = false
      this.submit(oldEl)
    }
    */
  }

  async updated (changedProperties) {
    super.updated();

    // If no-autoload is set to true, or there is no autoload or no recordId,
    // simply give up: nothing to do
    if (this.noAutoload || !changedProperties.has('recordId')) return

    // Record ID must be "something"
    if (typeof this.recordId === 'undefined' || this.recordId === null) return

    // Work out the action's URL, adding the record ID  at the end
    // (It will be a get)
    // If there is a result, fetch the element values
    const action = this.getAttribute('action');
    let response;
    if (action) {
      // This will make sure that the element is actually visible
      // before doing the fetch
      await this.updateComplete;

      // Disable elements
      this._disableElements(this.elements);

      // Fetch the data and trasform it to json
      let v;
      try {
        const el = this._fetchEl();
        response = await el.fetch(action + '/' + this.recordId);
        v = await response.json();
      } catch (e) {
        console.error('WARNING: Fetching element failed to fetch');
        v = {};
      }

      // Set values
      this.setFormElementValues(v);

      // Re-enabled all disabled fields
      this._enableElements(this.elements);

      // Run reportValidity if validateOnRender is on
      if (this.validateOnLoad) {
        this.reportValidity();
      }
    }
  }

  render () {
    return html`
      ${this.customStyle}
      <form id="native">
        <slot></slot>
      </form>
    `
  }
}
customElements.define('en-form', EnForm);

const InputMixin = (base) => {
  return class Base extends base {
    get skipAttributes () {
      return [
        ...super.skipAttributes,
        ...['type']
      ]
    }

    get reflectProperties () {
      return [
        ...super.reflectProperties,
        // From https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement -checkValidity -form
        ...['formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'name', 'type', 'disabled', 'autofocus', 'required', 'value', 'validity', 'validationMessage', 'willValidate', 'checked', 'defaultChecked', 'indeterminate', 'alt', 'height', 'src', 'width', 'accept', 'allowdirs ', 'files', 'webkitdirectory ', 'webkitEntries ', 'autocomplete', 'max', 'maxLength', 'min', 'minLength', 'pattern', 'placeholder', 'readOnly', 'size', 'selectionStart', 'selectionEnd', 'selectionDirection', 'defaultValue', 'dirName', 'accessKey', 'list', 'multiple', 'files', 'labels', 'step', 'valueAsDate', 'valueAsNumber', 'autocapitalize ', 'inputmode', 'align ', 'useMap ', 'blur', 'click', 'focus', 'select', 'setSelectionRange', 'setRangeText', 'setCustomValidity', 'reportValidity', 'stepDown', 'stepUp']
      ]
    }
  }
};

const FormElementMixin = (base) => {
  return class Base extends base {
    get reflectProperties () {
      return super.reflectProperties.filter(attr => attr !== 'checkValidity' && attr !== 'reportValidity' && attr !== 'setCustomValidity')
    }

    static get properties () {
      return {
        nativeErrorMessages: {
          type: Boolean,
          attribute: 'native-error-messages'
        },
        shownValidationMessage: {
          type: String,
          attribute: false
        },
        validator: { type: Function },
        validationMessages: {
          type: Object,
          attribute: 'validition-messages'
        },
        validationMessagePosition: {
          type: String,
          attribute: 'validation-message-position'
        }
      }
    }

    static get styles () {
      return [
        super.styles || [],
        css`

          span.error-message {
            color: red;
          }

          :invalid {
            background-color: pink;
            border: var(--nn-input-border-invalid, 1px solid #bb7777);
          }
        `
      ]
    }

    // Submit on enter with forms with only one element
    _eventListener (e) {
      if (e.keyCode === 13 && [...this.form.elements].length === 1) {
        this.form.submit();
      }
    }

    connectedCallback () {
      super.connectedCallback();
      this.assignFormProperty();
      this.addEventListener('keydown', this._boundKeyEventListener);
    }

    disconnectedCallback () {
      super.disconnectedCallBack();
      this.removeEventListener('keydown', this._boundKeyEventListener);
    }

    constructor () {
      super();
      this.validator = () => '';
      this.nativeValidationKeys = [
        'badInput',
        'customError',
        'patternMismatch',
        'rangeOverflow',
        'rangeUnderflow',
        'stepMismatch',
        'valueMissing',
        'tooLong',
        'tooShort',
        'typeMismatch'
      ];
      this.validationMessages = {};
      this.validationMessagePosition = 'before';

      this._boundKeyEventListener = this._eventListener.bind(this);
      this._showPrettyError = false;
    }

    get skipAttributes () {
      return [
        ...super.skipAttributes,
        ...['form']
      ]
    }

    get validationMessageTemplate () {
      return html`
        <span class="error-message">
          ${this.shownValidationMessage}
        </span>
      `
    }

    get ifValidationMessageBefore () {
      if (this.validationMessagePosition === 'after') return ''
      return this.validationMessageTemplate
    }

    get ifValidationMessageAfter () {
      if (this.validationMessagePosition === 'before') return ''
      return this.validationMessageTemplate
    }

    assignFormProperty () {
      if (this.tagName === 'NN-FORM' || this.tagName === 'EN-FORM') return
      let el = this;
      while ((el = el.parentElement) && (el.tagName !== 'FORM' && el.tagName !== 'NN-FORM' && el.tagName !== 'EN-FORM')) { } // eslint-disable-line no-empty
      this.form = el;
    }

    setCustomValidity (m) {
      return this.native.setCustomValidity(m)
    }

    reportValidity () {
      // Run custom validator. Note that custom validator
      // will only ever run on filed without an existing customError.
      // This is because
      if (!this.native.validity.customError) {
        const ownErrorMessage = this.validator();
        if (ownErrorMessage) this.setCustomValidity(ownErrorMessage);
      }

      // Hide the fancy error message by default
      this.shownValidationMessage = '';

      // Run reportValidity which will display the native
      // error messages.
      // Suppress the pretty error messages
      if (this.nativeErrorMessages) {
        this._showPrettyError = false;
        return this.native.reportValidity()
      } else {
        // Since pretty errors will be shown, it will actually
        // return checkValidity() which will not show the
        // error messages
        this._showPrettyError = true;
        return this.native.checkValidity()
      }
    }

    checkValidity () {
      if (!this.native.validity.customError) {
        const ownErrorMessage = this.validator();
        if (ownErrorMessage) this.setCustomValidity(ownErrorMessage);
      }

      this._showPrettyError = false;
      return this.native.checkValidity()
    }

    firstUpdated () {
      super.firstUpdated();
      this.native.oninput = (e) => {
        this.setCustomValidity('');
        this.reportValidity();
      };

      this.native.oninvalid = (e) => {
        // No pretty error to be shown (probably running checkValidity())
        if (!this._showPrettyError) return

        const validity = e.target.validity;

        // Find which one flag in validity is raised
        let found;
        for (const k of this.nativeValidationKeys) {
          if (validity[k]) {
            found = k;
            break
          }
        }

        // Assign shownValidationMessage
        // Allow translating with specific function
        const translator = this.validationMessages[found];
        if (translator) {
          this.shownValidationMessage = (typeof translator === 'function')
            ? translator(e.target.validationMessage)
            : translator;
        } else {
          this.shownValidationMessage = e.target.validationMessage;
        }
      };
    }
  }
};

class EnInputRange extends ThemeableMixin('en-input-range')(FormElementMixin(StyleableMixin(LabelsMixin(InputMixin(NativeReflectorMixin(LitElement)))))) {
  static get styles () {
    return [
      super.styles || [],
      css`
        /* :host {
          display: flex;
          height: 30px;
        } */
      `
    ]
  }

  static get properties () {
    return {
      shownValue: {
        type: String,
        attribute: false
      }
    }
  }

  firstUpdated () {
    super.firstUpdated();
    this.shownValue = this.shadowRoot.querySelector('#native').value;
  }

  render () {
    return html`
      ${this.customStyle}
      <slot @slotchange="${this.slotChanged}" id="range-amount-before" name="range-amount-before"></slot>
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input @change=${this.updateShownValue} type="range" id="native" real-time-event="input">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
      <slot @slotchange="${this.slotChanged}" id="range-amount-after" name="range-amount-after"></slot>
    `
  }

  _updateSpanInSlot (slot, value) {
    if (slot) {
      const slotContents = slot.assignedElements()[0];
      if (slotContents) {
        const amountSpan = slotContents.querySelector('span#range-amount');
        if (amountSpan) {
          amountSpan.innerHTML = Number(value);
        }
      }
    }
  }

  updateShownValue (e) {
    let slot;
    this.shownValue = e.srcElement.value;

    slot = this.shadowRoot.querySelector('slot#range-amount-before');
    this._updateSpanInSlot(slot, this.shownValue);

    slot = this.shadowRoot.querySelector('slot#range-amount-after');
    this._updateSpanInSlot(slot, this.shownValue);
  }

  slotChanged (e) {
    this._updateSpanInSlot(e.srcElement, this.shownValue);
  }
}
window.customElements.define('en-input-range', EnInputRange);

class NnButton extends ThemeableMixin('nn-button')(FormElementMixin(StyleableMixin(NativeReflectorMixin(LitElement)))) {
  static get styles () {
    return [
      super.styles || []
    ]
  }

  static get properties () {
    return {
      stylesheet: { type: String },
      customCSS: { type: Object },
      raised: { type: Boolean, reflect: true }
    }
  }

  get skipAttributes () {
    return [
      ...super.skipAttributes,
      'form'
    ]
  }

  get reflectProperties () {
    return [
      ...super.reflectProperties,
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement (-form -checkValidity)
      ...['accessKey', 'autofocus', 'disabled', 'formAction', 'formEnctype', 'formMethod', 'formNoValidate', 'formTarget', 'labels', 'menu ', 'name', 'tabIndex', 'type', 'willValidate', 'validationMessage', 'validity', 'value', 'reportValidity', 'setCustomValidity']
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      <button @click="${this._clicked}" id="native">
        <slot></slot>
      </button>
    `
  }

  _clicked () {
    if (this.getAttribute('type') === 'submit') this.form.submit();
  }
}
customElements.define('nn-button', NnButton);

class NnInputButton extends ThemeableMixin('nn-input-button')(FormElementMixin(InputMixin(NativeReflectorMixin(LitElement)))) {
  static get properties () {
    return {}
  }

  render () {
    return html`
      <input type="button" id="native">
        <slot></slot>
     `
  }
}
customElements.define('nn-input-button', NnInputButton);

class NnInputCheckbox extends ThemeableMixin('nn-input-checkbox')(FormElementMixin(LabelsMixin(StyleableMixin(InputMixin(NativeReflectorMixin(LitElement)))))) {
  static get styles () {
    return [
      super.styles || [],
      css`
      `
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <input type="checkbox" as-checkbox value-source="checked" id="native"  real-time-event="checked">
      ${this.ifLabelAfter}
    `
  }
}
customElements.define('nn-input-checkbox', NnInputCheckbox);

class NnInputText extends ThemeableMixin('nn-input-text')(FormElementMixin(StyleableMixin(LabelsMixin(InputMixin(NativeReflectorMixin(LitElement)))))) {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="text" id="native" real-time-event="input">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
customElements.define('nn-input-text', NnInputText);

class NnInputColor extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <input type="color" id="native">
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-color', NnInputColor);

class NnInputDatalist extends ThemeableMixin('nn-input-datalist')(FormElementMixin(LabelsMixin(StyleableMixin(InputMixin(NativeReflectorMixin(LitElement)))))) {
  static get styles () {
    return [
      super.styles || [],
      css`
      `
    ]
  }

  get skipAttributes () {
    return [
      ...super.skipAttributes,
      'list'
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <slot @slotchange="${this.addSlotToSelect}"></slot>
      <input type="text" id="native" list="_datalist" real-time-event="input">
      <datalist id="_datalist">
      </datalist>
      ${this.ifLabelAfter}
    `
  }

  addSlotToSelect (e) {
    const select = this.shadowRoot.querySelector('#_datalist');
    for (const option of e.srcElement.assignedElements()) {
      select.appendChild(option);
    }
  }
}
customElements.define('nn-input-datalist', NnInputDatalist);

class NnInputDate extends ThemeableMixin('nn-input-date')(NnInputText) {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="date" id="native">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-date', NnInputDate);

class NnInputDateTimeLocal extends ThemeableMixin('nn-input-date')(NnInputText) {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <input type="datetime-local" id="native">
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-datetime-local', NnInputDateTimeLocal);

class NnInputEmail extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="email" id="native">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-email', NnInputEmail);

class NnInputFile extends ThemeableMixin('nn-input-file')(FormElementMixin(StyleableMixin(LabelsMixin(InputMixin(NativeReflectorMixin(LitElement)))))) {
  static get styles () {
    return [
      super.styles || [],
      css`
        /* :host {
          display: flex;
          height: 30px;
        } */

        /* From https://zellwk.com/blog/hide-content-accessibly/ */
        [hidden] {
          border: 0;
          clip: rect(0 0 0 0);
          height: auto; /* new - was 1px */
          margin: 0; /* new - was -1px */
          overflow: hidden;
          padding: 0;
          position: absolute;
          width: 1px;
          white-space: nowrap; /* 1 */
        }
      `
    ]
  }

  static get properties () {
    return {
      fileName: { type: String },
      manyFilesText: {
        type: String,
        attribute: 'many-files-text'
      }
    }
  }

  constructor () {
    super();
    this.manyFilesText = 'Many';
  }

  render () {
    // From https://stackoverflow.com/a/25825731/829771
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="file" id="native" @change="${this.fileNameChanged}" hidden>
      ${this.ifValidationMessageAfter}
      ${this.fileName}
      ${this.ifLabelAfter}
    `
  }

  fileNameChanged (e) {
    const native = this.shadowRoot.querySelector('#native');
    this.fileName = native.files.length > 1 ? this.manyFilesText : native.value;
  }
}
customElements.define('nn-input-file', NnInputFile);

class NnInputMonth extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="password" id="native">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-month', NnInputMonth);

class NnInputNumber extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <input type="password" id="native">
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-number', NnInputNumber);

class NnInputPassword extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <input type="password" id="native">
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-password', NnInputPassword);

class NnInputRadio extends ThemeableMixin('nn-input-radio')(FormElementMixin(LabelsMixin(StyleableMixin(InputMixin(NativeReflectorMixin(LitElement)))))) {
  static get styles () {
    return [
      super.styles || [],
      css`
      `
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <input as-radio value-source="checked" @change="${this._excludeOthers}" type="radio" id="native"  real-time-event="input">
      ${this.ifLabelAfter}
    `
  }

  _excludeOthers (e) {
    // All other elements with the same name, marked as `as-radio`
    const others = [...this.form.elements].filter(el =>
      el !== this &&
      el.getAttribute('name') &&
      el.getAttribute('name') === this.getAttribute('name') &&
      el.getAttribute('as-radio') !== null
    );
    for (const el of others) {
      const prop = el.getAttribute('value-source') || 'checked';
      el[prop] = false;
    }
  }
}
customElements.define('nn-input-radio', NnInputRadio);

class NnInputRange extends ThemeableMixin('nn-input-range')(FormElementMixin(StyleableMixin(LabelsMixin(InputMixin(NativeReflectorMixin(LitElement)))))) {
  static get styles () {
    return [
      super.styles || [],
      css`
        /* :host {
          display: flex;
          height: 30px;
        } */
      `
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="range" id="native" real-time-event="input">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-range', NnInputRange);

class NnInputSearch extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <input type="search" id="native">
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-search', NnInputSearch);

class NnInputSubmit extends ThemeableMixin('nn-input-submit')(FormElementMixin(InputMixin(NativeReflectorMixin(LitElement)))) {
  render () {
    return html`
      ${this.customStyle}
      <input @click="${this._formSubmit}" type="submit" id="native">
    `
  }

  _formSubmit (e) {
    if (this.form) {
      this.form.submit();
    }
  }
}
customElements.define('nn-input-submit', NnInputSubmit);

class NnInputTel extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="tel" id="native">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-tel', NnInputTel);

class NnInputTime extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="time" id="native">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-time', NnInputTime);

class NnInputUrl extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="password" id="native">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-url', NnInputUrl);

class NnInputWeek extends NnInputText {
  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <input type="password" id="native">
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }
}
window.customElements.define('nn-input-week', NnInputWeek);

class NnMeter extends ThemeableMixin('nn-meter')(FormElementMixin(InputMixin(NativeReflectorMixin(LitElement)))) {
  static get styles () {
    return [
      super.styles || [],
      css`
      `
    ]
  }

  get reflectProperties () {
    return [
      ...super.reflectProperties,
      ...['high', 'low', 'max', 'min', 'optimum', 'value', 'labels']
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      <meter id="native" real-time-event="input"></meter>
    `
  }
}
customElements.define('nn-meter', NnMeter);

class NnProgress extends ThemeableMixin('nn-progress')(FormElementMixin(InputMixin(NativeReflectorMixin(LitElement)))) {
  static get styles () {
    return [
      super.styles || [],
      css`
      `
    ]
  }

  static get properties () {
    return {
    }
  }

  get reflectProperties () {
    return [
      ...super.reflectProperties,
      ...['max', 'position', 'value', 'labels']
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      <progress id="native" real-time-event="input"></progress>
    `
  }
}
customElements.define('nn-progress', NnProgress);

class NnSelect extends ThemeableMixin('nn-select')(FormElementMixin(LabelsMixin(InputMixin(NativeReflectorMixin(LitElement))))) {
  static get styles () {
    return [
      super.styles || [],
      css`
        /* :host {
          display: flex;
          height: 30px;
        } */

        /* select {
          display: inline-flex;
          border-radius: var(--nn-select-border-radius, 0 4px 4px 0);
          border: var(--nn-select-border, 1px solid #dddddd);
          color: var(--nn-select-color, inherit);
          background-color: var(--nn-select-background, initial);
          -webkit-appearance: select;
          width: 100%;
          float: right;
          font-size: 1em;
          padding-left: 10px;
          margin-left: 4px;
        } */
      `
    ]
  }

  get reflectProperties () {
    return [
      ...super.reflectProperties,
      // FROM https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement -checkValidity -form
      ...['autofocus', 'disabled', 'labels', 'length', 'multiple', 'name', 'options', 'required', 'selectedIndex', 'selectedOptions', 'size', 'type', 'validationMessage', 'validity', 'value', 'willValidate', 'add', 'blur', 'focus', 'item', 'namedItem', 'remove', 'reportValidity', 'setCustomValidity']
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      ${this.ifValidationMessageBefore}
      <slot @slotchange="${this.addSlotToSelect}"></slot>
      <select id="native" real-time-event="selected"></select>
      ${this.ifValidationMessageAfter}
      ${this.ifLabelAfter}
    `
  }

  addSlotToSelect (e) {
    const select = this.shadowRoot.querySelector('#native');
    for (const option of e.srcElement.assignedElements()) {
      select.appendChild(option);
    }
  }
}
customElements.define('nn-select', NnSelect);

class NnTextArea extends ThemeableMixin('nn-textarea')(StyleableMixin(FormElementMixin(LabelsMixin(InputMixin(NativeReflectorMixin(LitElement)))))) {
  static get styles () {
    return [
      super.styles || [],
      css`
      `
    ]
  }

  get reflectProperties () {
    return [
      ...super.reflectProperties,
      // From https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement -checkValidity -form
      ...['type', 'value', 'textLength', 'defaultValue', 'placeholder', 'rows', 'cols', 'autofocus', 'name', 'disabled', 'labels', 'maxLength', 'accessKey', 'readOnly', 'required', 'tabIndex', 'selectionStart', 'selectionEnd', 'selectionDirection', 'validity', 'willValidate', 'validationMessage', 'autocomplete ', 'autocapitalize ', 'inputMode ', 'wrap', 'blur', 'focus', 'select', 'setRangeText', 'setSelectionRange', 'reportValidity', 'setCustomValidity']
    ]
  }

  render () {
    return html`
      ${this.customStyle}
      ${this.ifLabelBefore}
      <textarea name="" id="native" real-time-event="input"></textarea>
      ${this.ifLabelAfter}
    `
  }
}
customElements.define('nn-textarea', NnTextArea);
