var repeatString = function(string, num) {
	return new Array(num + 1).join(string);
};

var Rusha = require('rusha');

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
	path = path.slice(0);
	if (this.valueGetter(node, this.identifierProperty) === identifierValue) {
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
		path = [],
		deleted;
	if (found) {
		path = found.path.reverse();
		if (path[1]) {
			parent = this.findNode(path[1], tree);
			if (parent) {
				deleted = this.removeItemFromArray(found.node, this.valueGetter(parent.node, this.nestedNodesProperty));
			}
		}
		path.reverse();
	}
	return {
		node: deleted,
		path: path
	};
};

TreeManipulator.prototype.createNode = function(identifierValue, options, tree) {
	options = options || {};
	var parent,
		before,
		after,
		created,
		path = [],
		index,
		newId;
	if (options.parent) {
		parent = this.findNode(options.parent, tree);
	}
	if (parent && parent.node) {
		this.valueSetter(parent.node, this.nestedNodesProperty, this.valueGetter(parent.node, this.nestedNodesProperty) || []);
		if (options.before) {
			before = this.findNode(options.before, parent.node);
			before = before ? before.node : undefined;
			index = this.valueGetter(parent.node, this.nestedNodesProperty).indexOf(before);
		} else if (options.after) {
			after = this.findNode(options.after, parent.node);
			after = after ? after.node : undefined;
			index = this.valueGetter(parent.node, this.nestedNodesProperty).indexOf(after) + 1;
		} else {
			index = this.valueGetter(parent.node, this.nestedNodesProperty).length;
		}
		if (typeof index === 'number') {
			newId = identifierValue || this.idGenerator();
			created = this.nodeCreator();
			this.valueSetter(created, this.identifierProperty, newId);
			this.addItemToArray(created, index, this.valueGetter(parent.node, this.nestedNodesProperty));
			path = path.concat(parent.path);
			path.push(newId);
		}
	}
	return {
		node: created,
		path: path
	};
};

TreeManipulator.prototype.print = function(tree) {
	this._recursivePrint(0, tree);
};

TreeManipulator.prototype._recursivePrint = function(depth, node) {
	var prefix = '',
		branchStr =  ' \\___';
	if (depth === 1){
		prefix = branchStr;
	} else if (depth > 1){
		prefix = repeatString('     ', depth -1) + branchStr;
	}
	
	if (node){
		console.log(prefix + this.valueGetter(node, this.identifierProperty) + '\n');
	}
	(this.valueGetter(node, this.nestedNodesProperty) || []).forEach(this._recursivePrint.bind(this, depth + 1));
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
	return this._rusha.digestFromString(new Date().getTime().toString() + this._getCounter());
};

TreeManipulator.prototype._getCounter = (function(){
	var counter = 0;
	return function(){
		return (++counter);	
	}
})();

TreeManipulator.prototype._rusha = new Rusha();

module.exports = TreeManipulator;