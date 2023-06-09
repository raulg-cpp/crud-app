import './App.css';
import { useState, useEffect } from 'react';
 
import { addDoc, getDocs, collection, doc, deleteDoc, updateDoc } from "@firebase/firestore"
import { db } from "./firebase-config"

// Form input fields
const INPUT_NAMES = ["name", "surname", "email"];
 
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
				{ INPUT_NAMES.map( key => (
    				<label key={key}> 
    					<span>{key}</span>
						<input 
							type="text" 
							name={key} 
							value={inputs[key] || ""} 
							onChange={handleChange}
						/>  
					</label> ) 					
				)}
			
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
