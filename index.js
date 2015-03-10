function TreeManipulator(options) {
	options = options || {};
	this.identifierProperty = options.identifierProperty || 'id';
	this.nestedNodesProperty = options.nestedNodesProperty || 'children';
	this.idGenerator = options.idGenerator || this._idGenerator;
	this.valueGetter = options.valueGetter || this._valueGetter;
	this.valueSetter = options.valueSetter || this._valueSetter;
	this.nodeCreator = options.nodeCreator || this._nodeCreator;
	this.addItemToArray = options.addItemToArray || this._addItemToArray;
	this.removeItemFromArray = options.removeItemFromArray || this._removeItemFromArray;
}

TreeManipulator.prototype.findNode = function(identifierValue, tree) {
	if (!identifierValue) {
		return;
	} else {
		return this._recursiveGetNode(identifierValue, [], tree);
	}
};

TreeManipulator.prototype._recursiveGetNode = function(identifierValue, path, node) {
	var found = [];
	if (this.valueGetter(node, this.identifierProperty) === identifierValue) {
		path = path.slice(0);
		path.push(node[this.identifierProperty]);
		found.push({
			node: node,
			path: path
		});
	} else if (this.valueGetter(node, this.nestedNodesProperty) && this.valueGetter(node, this.nestedNodesProperty).length > 0) {
		path.push(this.valueGetter(node, this.identifierProperty));
		found = this.valueGetter(node, this.nestedNodesProperty).map(this._recursiveGetNode.bind(this, identifierValue, path)).filter(function(mapped) {
			return !!mapped;
		});
	}
	return found[0];
};

TreeManipulator.prototype.deleteNode = function(identifierValue, tree) {
	var found = this.findNode(identifierValue, tree),
		parent,
		path,
		deleted;
	if (found) {
		path = found.path.reverse();
		if (path[1]) {
			parent = this.findNode(path[1], tree);
			if (parent) {
				deleted = this.removeItemFromArray(found.node, this.valueGetter(parent.node, this.nestedNodesProperty));
			}
		}
	}
	return deleted;
};

TreeManipulator.prototype.createNode = function(identifierValue, options, tree) {
	options = options || {};
	var parent,
		before,
		after,
		created,
		index;
	if (options.parent) {
		parent = this.findNode(options.parent, tree);
		parent = parent ? parent.node : undefined;
	}
	if (parent) {
		this.valueSetter(parent, this.nestedNodesProperty, this.valueGetter(parent, this.nestedNodesProperty) || []);
		if (options.before) {
			before = this.findNode(options.before, parent);
			before = before ? before.node : undefined;
			index = this.valueGetter(parent, this.nestedNodesProperty).indexOf(before);
		} else if (options.after) {
			after = this.findNode(options.after, parent);
			after = after ? after.node : undefined;
			index = this.valueGetter(parent, this.nestedNodesProperty).indexOf(after);
		} else {
			index = this.valueGetter(parent, this.nestedNodesProperty).length;
		}
		if (typeof index === 'number') {
			created = this.nodeCreator();
			this.valueSetter(created, this.identifierProperty, identifierValue || this.idGenerator());
			this.addItemToArray(created, index, this.valueGetter(parent, this.nestedNodesProperty));
		}
	}
	return created;

};

TreeManipulator.prototype._addItemToArray = function(item, index, array) {
	array.splice(index, 0, item);
};

TreeManipulator.prototype._removeItemFromArray = function(item, array) {
	var index = array.indexOf(item);
	return array.splice(index, 1)[0];
};

TreeManipulator.prototype._nodeCreator = function() {
	return {};
};

TreeManipulator.prototype._valueGetter = function(obj, property) {
	return obj[property];
};

TreeManipulator.prototype._valueSetter = function(obj, property, value) {
	obj[property] = value;
};

TreeManipulator.prototype._idGenerator = function() {
	return new Date().getTime().toString();
};

module.exports = TreeManipulator;