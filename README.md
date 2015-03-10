# Tree Manipulator

A service manipulating tree object.  

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

var ta = TreeManipulator();

ta.findNode('2', tree);
// returns the entire node with identifier '2'

ta.deleteNode('2', tree);
// returns the entire node with identifier '2' and deletes it from the tree

ta.createNode('8', {parent: '2', before: '4'}, tree);
// returns a new node with identifier '8' and inserts it after the node '4'

ta.createNode('8', {parent: '2', after: '3'}, tree);
// returns a new node with identifier '8' and inserts it before the node '3'

ta.createNode('8', {parent: '2'}, tree);
// returns a new node with identifier '8' and appends it as a last child of the node '2'
```

## Installation

```
npm install tree-manipulator --save
```


## API Reference

####`constructor (options)`  
- arguments:    
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

####`findNode (identifierValue, tree)`  
- arguments:  
	- identifierValue [`String`]  
	- tree [`Object`]  
- Returns  
	node [`Object`]

####`createNode (identifierValue, options, tree)`
- arguments:  
	- identifierValue [`String`]  
	- options [`Object`]  
		- parent [`String`] - parent identifier  
		- before [`String`] - before identifier  
		- after [`String`] - after identifier  
	- tree [`Object`]  
- Returns      
	node [`Object`]   

####`deleteNode (identifierValue, tree)`   
- arguments:  
	- identifierValue [`String`]  
	- tree [`Object`]  
- Returns    
	node [`Object`]  

## License

[MIT](http://rem.mit-license.org)
