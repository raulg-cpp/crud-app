//==== Includes ====

/* React */
import './App.scss';
import { useState, useEffect } from 'react';

/* Firebase */ 
import { addDoc, getDocs, collection, doc, deleteDoc, updateDoc } from "@firebase/firestore";
import { db } from "./firebase-config";

/* Other */
import { INPUT_NAMES, INPUT_PATTERNS, INPUT_PLACEHOLDER } from "./constants";
import ubalogo from "./uba-logo.png";
 
//==== App ====
function initFlags() {
	return Array( INPUT_NAMES.length ).fill(true);
}

function App() {
	//--- I. State ---
	
	/* variables */
	const [dataBase, setDataBase] = useState( [] );
	const [inFocus, setInFocus] = useState(null);		// no selection
	const [inputs, setInputs] = useState( {} );
	const [inputFlags, setInputFlags] = useState( initFlags() );
  	
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
		setInputFlags( initFlags() );
		
		// disable update and delete
		setInFocus(null);
	}
	
	const loadData = () => {
		const getData = async () => {
  			const data = await getDocs(dbRef);
  			let array = data.docs.map( (doc) => ({id: doc.id, ...doc.data()}) );
  			// api calls
  			setDataBase( array );
  			console.log("updated output");
		};
		getData();
	}

	/* Load on startup */
	// eslint-disable-next-line
	useEffect( () => { loadData() }, [] ); 
 	
 	// 2. Create data [need to check regex before submiting]	
 	const checkInputs = () => {
 		var output = true;
 		
 		// scan inputs
		let flags = INPUT_NAMES.map( (key, i) => {
			let regex = new RegExp( INPUT_PATTERNS[i] ); 
			let check = regex.test( inputs[key] );
			
			if( !check && output ) { output = false };
			return check;		
		});

		setInputFlags(flags);
		return output;
 	}
 	
	const handleSubmit = (event) => {
		event.preventDefault();	
		if( checkInputs() ) {
			// load data	
			try {
    			addDoc(dbRef, inputs );
			} catch(error) {
    			console.log(error);
			}
			// update output
			loadData();
			resetForm();
		}
	}

		// update inputs
	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs( curr_inputs => ({...curr_inputs, [name]: value}) );
	}

	// 2. Delete data
	const handleDelete = async () => {
		let length = dataBase.length;
		if( length > 0 && inFocus != null ) {
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
	}	 
	
	// 3. Update data 
	const handleEdit = async (index) => {
		if( checkInputs() ) {	
			let length = dataBase.length;
			if( length > 0  && inFocus != null ) {				
				let id = dataBase[inFocus].id;
  				await updateDoc( doc(db, "data", id), inputs );
  				loadData();
  				resetForm();
  			}
  		}
	}
	  	  
	const handleGet = (index) => {
		// load form		
		let _inputs = {};
		for( const key of INPUT_NAMES ) {
			_inputs[key] = dataBase[index][key];
		}	
		setInputs(_inputs);
		setInputFlags( initFlags() );
		
		// highlight
		setInFocus(index);
	}
	
	// 4. Variable styles 
	const styleGet = (index, style) => {
		return index === inFocus ? style : "";
	}
	
	const styleError = (index) => {
		return inputFlags.length > 0 && inputFlags[index] ? "" : "errorField";  
	}
	
	//--- III. JSX ----
	
	return (
	<div className="App">
		<h1 className="watermark">WATERMARK - RAUL GONZALEZ</h1>
		<div className="mainBox">
		
			{/* Form */}
    		<form className="inputForm" id="input_fields" onSubmit={handleSubmit}>
    			<div className="inputList">
    				{/* Header */}
					<div className="title">
						<img className="logo" alt="" src={ubalogo} />
						<h1 className="text">Inventario</h1>
					</div>

					{ INPUT_NAMES.map( (key, index) => { 
						return (
    					<label key={key}> 
    						<span>{key}</span>
							
							{/* Input fields */}
							<input 
								className={ styleError(index) }
								placeholder={ INPUT_PLACEHOLDER[index] }
								name={key} 
								value={inputs[key] || ""} 
								onChange={handleChange}
								required
							/>  
						</label> ) 					
					})}
				</div>
    		</form>
			
			{/* create, delete and update buttons */}
			<div className="submitButtons">
				<button className="create" type="submit" form="input_fields"> Ingresar </button>	
    			<button className="delete" onClick={handleDelete}> Eliminar </button>	
  				<button className="update" onClick={handleEdit}> Cambiar </button>
  				<button className="" onClick={resetForm}> Limpiar </button>
    		</div>				
			{/* list output */}
			
			{ dataBase.length === 0 ? (<></>) : (
			<table className="tableList" cellSpacing="0" cellPadding="7">
				{/* header */}
				<thead>
					<tr>
    					{ INPUT_NAMES.map( name => {
							return ( <th key={name}> {name} </th> )	
						})}
  					</tr>
  				</thead>
  			
  				<tbody>
  				{/* content */}
				{ dataBase.map( (data, index) => {
					// object properties
					const outputList = INPUT_NAMES.map( name => {
						return ( <td key={name} className={ styleGet(index, "focusText") }> 
									{ data[name] } 
								</td> )	
					});
					
					// display data
					const id = data.id; 
					return (
					<tr key={id}>
  						{ outputList }
  						<td>
  							<button className={ styleGet(index, "focusBtn") } 
  									onClick={ () => {handleGet(index)} }> 
  								Seleccionar
  							</button>
  						</td>
  					</tr>); 
  				})}
  				</tbody>
			</table>
			)}
		</div>    	
	</div>
	);
}
 
export default App;
