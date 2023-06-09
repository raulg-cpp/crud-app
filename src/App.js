import './App.css';
import { useState, useEffect } from 'react';
 
import { addDoc, getDocs, collection, doc, deleteDoc, updateDoc } from "@firebase/firestore"
import { db } from "./firebase-config"

//==== Form parameters
const INPUT_NAMES = ["name", "surname", "email", "telephone"];	// Defines properties of stored objects

const INPUT_TYPES = ["text", "text", "email", "tel"];		

const INPUT_PATTERNS = ["^[A-Z][a-z]+([ ][A-Z][a-z]+)*$",			// Words
					  	"^[A-Z][a-z]+([ ][A-Z][a-z]+)*$",			// Words  
					  	"[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$",	// Email
					  	"^[0-9]{1,3}-[0-9]{3}-[0-9]{3}-[0-9]{4}$"];	// Telephone 
 
const INPUT_PLACEHOLDER = [	"John Jim", 
							"Doe Poe",
							"user@host.domain", 
							"1-100-200-3000" ];
 
//==== App
function App() {
	// state
	const [dataBase, setDataBase] = useState( [] );
	const [inFocus, setInFocus] = useState(0);
	const [inputs, setInputs] = useState( {} );
  		// refs
	const dbRef = collection( db, "data" );
 
  	// display data
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
  			console.log("updated data");
		};
		getData();
	};

		// load on startup
	useEffect( () => { loadData() }, [] );
 	
 	// create data	
	const handleSubmit = (event) => {
		event.preventDefault();		
		// load data
		try {
    		addDoc(dbRef, inputs );
		} catch(error) {
    		console.log(error);
		}
		// update
		loadData();
		resetForm();
	} 
	
	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs( curr_inputs => ({...curr_inputs, [name]: value}) );
	};

	// delete data
	const handleDelete = async () => {
		let id = dataBase[inFocus].id;
		await deleteDoc( doc(db, "data", id) ); 
		loadData();
		
		// change focus
		let length = dataBase.length - 1;
		if( inFocus === length && length !== 0 ) {
			handleGet(length - 1);
		}
		resetForm(); 
	};	 
	
	// update data
	const handleEdit = async (index) => {		
		let id = dataBase[inFocus].id;
  		await updateDoc( doc(db, "data", id), inputs );
  		loadData();
  		resetForm();
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
	
	const styleGet = (index) => {
		return index === inFocus ? "buttonFocus" : "";
	}
	
	// === JSX ===
	return (
	<div className="App">
		{/* Form */}
		<div>
			<h1>CRUD application</h1>
    		{/* inputs */}
    		<form onSubmit={handleSubmit}>
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
							required
						/>  
					</label> ) 					
				})}
			
    			{/* create */}
    			<button type="submit"> Create </button>
    		</form>
		</div>
		
		{/* delete and update */}
    	<button onClick={handleDelete}> Delete </button>	
  		<button onClick={handleEdit}> Update </button>
				
		{/* list output */}
		<div>
			{ dataBase.map( (data, index) => {
				// properties
				const outputList = INPUT_NAMES.map( name => {
					return ( <span key={name}> { data[name] } </span> )	
				});
				
				// display
				const id = data.id; 
				
				return (
				<div key={id} className={styleGet(index)}>
  					{ outputList }
  					
  					<button onClick={ () => {handleGet(index)} }> 
  						Select
  					</button>
  				</div>); 
  			})}
		</div>    	
	</div>
	);
}
 
export default App;
