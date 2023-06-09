import './App.css';
import { useRef, useState, useEffect } from 'react';
 
import { addDoc, getDocs, collection, doc, deleteDoc, updateDoc } from "@firebase/firestore"
import { db } from "./firebase-config"
 
function App() {
	// state
	const [users, setUsers] = useState( [] );
	const [inFocus, setInFocus] = useState(0);
	const [inputs, setInputs] = useState( {} );
  		// refs
	const usersRef = collection( db, "data" );
 
  	// display data
	const resetForm = () => {
		setInputs({ 
			text1: "",
			text2: ""
		});
	};
	
	const loadData = () => {
		const getUsers = async () => {
  			const data = await getDocs(usersRef);
  			let elem = data.docs.map( 
  				(doc) => ( { ...doc.data(), id: doc.id } )
  			);
  			// api calls
  			setUsers( elem );
  			console.log("updated data");
		};
		getUsers();
	};

		// load on startup
	useEffect( () => {
		loadData();
	}, [] );
 	
 	// create data	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		// load data
		try {
    		addDoc(usersRef, inputs );
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
		console.log( inputs );
	};

	// delete data
	const handleDelete = async () => {
		let id = users[inFocus].id;
		await deleteDoc( doc(db, "data", id) ); 
		loadData();
		
		// change focus
		let length = users.length - 1;
		if( inFocus === length && length !== 0 ) {
			handleGet(length - 1);
		}
		resetForm(); 
	};	 
	
	// update data
	const handleEdit = async (index) => {
		let obj = { 
			text1: inputs.text1, 
			text2: inputs.text2
		};
		
		let id = users[inFocus].id;
  		await updateDoc( doc(db, "data", id), obj );
  		loadData();
  		resetForm();
	};
	  
	const loadForm = (index) => {	// fill out form with stored data 
		let data = users[index];
		setInputs( { 
			text1: data.text1, 
			text2: data.text2 
		});
	};
	  
	const handleGet = (index) => {
		loadForm(index);
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
    		<form onSubmit={handleSubmit}>
				{/* Form inputs */}
    			<label>data1:
					<input 
						type="text" 
						name="text1" 
						value={inputs.text1 || ""} 
						onChange={handleChange}
					/>  
				</label> 			
    			
    			<label>data2:
					<input 
						type="text" 
						name="text2" 
						value={inputs.text2 || ""} 
						onChange={handleChange}
					/>  
				</label>
    			
    			{/* create */}
    			<button type="submit"> Create </button>
    		</form>
		</div>
		
		{/* delete and update */}
    	<button onClick={handleDelete}> Delete </button>	
  		<button onClick={handleEdit}> Update </button>
				
		{/* list output */}
		<div>
			{ users.map( 
				(data, index) => { return ( 
  				<div key={data.id}>
  					{/* display */}
  					<span> {index} : {data.text1} , {data.text2} , {data.id} </span> 
  					
  					{/* Selection button */}
  					<button onClick={ () => {handleGet(index)} } className={styleGet(index)}> Select </button>
  				</div> )}
  			)}
		</div>    	
	</div>
	);
}
 
export default App;
