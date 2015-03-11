# Tree Manipulator [![npm version](https://badge.fury.io/js/tree-manipulator.svg)](http://badge.fury.io/js/tree-manipulator)

A service manipulating tree object.  

## Installation

```
npm install tree-manipulator --save
```

## Code Example

```javascript
var tree = {
	id: '1',
	children: [{
		id: '2',
		children: [
			{
				id: '3',
			},
			{
				id: '4'
			}
		]
	}, {
		id: '5',
		children: [{
			id: '6'
		}, {
			id: '7'
		}]
	}]
};

var tm = TreeManipulator();

tm.findNode('2', tree);
// 
/*
Returns the entire node with identifier '2' and its path
{
	node: {id:'2' ... },
	path: ['1', '2']	
}
*/

tm.deleteNode('2', tree);
/*
 Deletes node from the tree. Returns the entire node with identifier '2' and its path.
returns {
	node: {id:'2' ... },
	path: ['1', '2']	
}
*/

tm.createNode('8', {parent: '2', before: '4'}, tree);
/*
Inserts a new node before the node '4'. Returns a new node with identifier '8' and its path.
returns {
	node: {id:'8' ... },
	path: ['1', '2', '8']	
}
*/

tm.createNode('8', {parent: '2', after: '3'}, tree);
/*
Inserts a new node after the node '3'. Returns a new node with identifier '8' and its path.
returns {
	node: {id:'8' ... },
	path: ['1', '2', '8']	
}
*/

tm.createNode('8', {parent: '2'}, tree);
/*
Appends a new node as a last child of the node '2'. Returns a new node with identifier '8' and its path.
returns {
	node: {id:'8' ... },
	path: ['1', '2', '8']	
}
*/

tm.print(tree);
/** 
output:
		1
		\___5
			\___6
			\___7

**/

```

## API Reference

#####`constructor (options)`  
- Arguments:    
	- options [`Object`]    
		- identifierProperty [`String`]  
			identifier property of a node  
			default: `'id'`    
		- nestedNodesProperty [`String`]  
			property name for nested nodes array  
			default: `'children'`  
		- idGenerator [`Function`]   
			node identifier generator   
			default:   
			```
			function(){  
				return new Date().getTime().toString();  
			}
			```    
		- valueGetter [`Function`]  
			a node property value getter 
			default:  
			```
			function(obj, property) {  
				return obj[property];  
			}  
			```   
		- valueSetter [`Function`]  
			a node property value setter  
			default:  
			```
			function(obj, property, value) { 
				obj[property] = value;
			}
			```  
		- nodeCreator [`Function`]  
			a newly created node generator  
			default:  
			```
			function() {
				return {};
			}
			```
		- addItemToArray [`Function`]  
			item adder to array  
			default:  
			```
			function(item, index, array) {
				array.splice(index, 0, item);
			}
			```  
		- removeItemFromArray [`Function`]  
			item adder to array  
			default:  
			```
			function(item, array) {
				var index = array.indexOf(item);
				return array.splice(index, 1)[0];
			}
			```  

#####`findNode (identifierValue, tree)`  
- Arguments:  
	- identifierValue [`String`]  
	- tree [`Object`]  
- Returns  
	- found [`Object`]
		- node [`Object`]
		- path [`Array`]


#####`createNode (identifierValue, options, tree)`
- Arguments:  
	- identifierValue [`String`]  
	- options [`Object`]  
		- parent [`String`] - parent identifier  
		- before [`String`] - before identifier  
		- after [`String`] - after identifier  
	- tree [`Object`]  
- Returns      
	- found [`Object`]
		- node [`Object`]
		- path [`Array`]

#####`deleteNode (identifierValue, tree)`   
- Arguments:  
	- identifierValue [`String`]  
	- tree [`Object`]  
- Returns    
	- found [`Object`]
		- node [`Object`]
		- path [`Array`]

#####`print (tree)`   
- Arguments:  
	- tree [`Object`]  

## License

[MIT](http://rem.mit-license.org)
