//==== Includes ====

/* React */
import './App.scss';
import { useState, useEffect } from 'react';

/* Firebase */ 
import { addDoc, getDocs, collection, doc, deleteDoc, updateDoc } from "@firebase/firestore"
import { db } from "./firebase-config"

/* Other */
import { INPUT_NAMES, INPUT_TYPES, INPUT_PATTERNS, INPUT_PLACEHOLDER } from "./constants"
 
//==== App ====

function App() {
	//--- I. State ---
	
	/* variables */
	const [dataBase, setDataBase] = useState( [] );
	const [inFocus, setInFocus] = useState(0);
	const [inputs, setInputs] = useState( {} );
  	
  	/* Refs */
	const dbRef = collection( db, "data" );
 
 	//--- II. Functions ---
 
  	// 1. Display data
	const resetForm = () => {
		let _inputs = {};
		for( const key in inputs ) {
			_inputs[key] = "";
		}
		setInputs(_inputs);
	};
	
	const loadData = () => {
		const getData = async () => {
  			const data = await getDocs(dbRef);
  			let array = data.docs.map( (doc) => ({id: doc.id, ...doc.data()}) );
  			// api calls
  			setDataBase( array );
  			console.log("updated output");
		};
		getData();
	};

	/* Load on startup */
	// eslint-disable-next-line
	useEffect( () => { loadData() }, [] ); 
 	
 	// 2. Create data	
	const handleSubmit = (event) => {
		event.preventDefault();		
		try {
    		addDoc(dbRef, inputs );
		} catch(error) {
    		console.log(error);
		}
		// update
		loadData();
		resetForm();
	} 
	
		// update inputs
	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs( curr_inputs => ({...curr_inputs, [name]: value}) );
	};

	// 2. Delete data
	const handleDelete = async () => {
		let length = dataBase.length;
		if( length > 0 ) {
			let id = dataBase[inFocus].id;
			await deleteDoc( doc(db, "data", id) ); 
			loadData();
			
			// change focus
			length -= 1;
			if( inFocus === length && length !== 0 ) {
				handleGet(length - 1);
			}
			resetForm(); 
		}
	};	 
	
	// 3. Update data
	const handleEdit = async (index) => {	
		let length = dataBase.length;
		if( length > 0 ) {				
			let id = dataBase[inFocus].id;
  			await updateDoc( doc(db, "data", id), inputs );
  			loadData();
  			resetForm();
  		}
	};
	  	  
	const handleGet = (index) => {
		// load form		
		let _inputs = {};
		for( const key of INPUT_NAMES ) {
			_inputs[key] = dataBase[index][key];
		}	
		setInputs(_inputs);
		
		// highlight
		setInFocus(index);
	};
	
	const styleGet = (index, style) => {
		return index === inFocus ? style : "";
	}
	
	//--- III. JSX ----
	
	return (
	<div className="App">
		<div className="mainBox">
			<h1>Contact Information</h1>
			{/* Form */}
    		<form className="inputForm" id="input_fields" onSubmit={handleSubmit}>
    			<div className="inputList">
					{ INPUT_NAMES.map( (key, index) => { 
						return (
    					<label key={key}> 
    						<span>{key}</span>
							<input 
								pattern={ INPUT_PATTERNS[index] }
								placeholder={ INPUT_PLACEHOLDER[index] }
								type={ INPUT_TYPES[index] } 
								name={key} 
								value={inputs[key] || ""} 
								onChange={handleChange}
								min="1"
								required
							/>  
						</label> ) 					
					})}
				</div>
    		</form>
			
			{/* create, delete and update buttons */}
			<div className="submitButtons">
				<button className="create" type="submit" form="input_fields"> Create </button>	
    			<button className="delete" onClick={handleDelete}> Delete </button>	
  				<button className="" onClick={handleEdit}> Update </button>
    		</div>				
			{/* list output */}
			
			<table className="tableList" cellspacing="0" cellpadding="7">
				{/* header */}
				<thead>
				{ dataBase.length === 0 ? (<></>) : (
					<tr>
    					{ INPUT_NAMES.map( name => {
							return ( <th key={name}> {name} </th> )	
						})}
  					</tr>
  				)}
  				</thead>
  			
  				<tbody>
  				{/* content */}
				{ dataBase.map( (data, i) => {
					// object properties
					const outputList = INPUT_NAMES.map( name => {
						return ( <td key={name} className={ styleGet(i, "focusText") }> 
									{ data[name] } 
								</td> )	
					});
					
					// display data
					const id = data.id; 
					return (
					<tr key={id}>
  						{ outputList }
  						<td>
  							<button className={ styleGet(i, "focusBtn") } 
  									onClick={ () => {handleGet(i)} }> 
  								Select
  							</button>
  						</td>
  					</tr>); 
  				})}
  				</tbody>
			</table>
		</div>    	
	</div>
	);
}
 
export default App;
