import './App.css';
import { useRef, useState, useEffect } from 'react';
 
import { addDoc, getDocs, collection, doc, deleteDoc, updateDoc } from "@firebase/firestore"
import { db } from "./firebase-config"
 
function App() {
	// state
	const [users, setUsers] = useState( [] );
	const [inFocus, setInFocus] = useState(0);
  		// refs
	const usersRef = collection( db, "data" );
	const dataRef = useRef();
 
  	// display data
	const resetForm = () => { dataRef.current.value = "" };
	
	const loadData = () => {
		const getUsers = async () => {
  			const data = await getDocs(usersRef);
  			var elem = data.docs.map( 
  				(doc) => ( { ...doc.data(), id: doc.id } )
  			);
  			setUsers( elem );
		};
		getUsers();
		// api calls
		console.log("updated data");
	};

		// load on startup
	useEffect( () => {
		loadData();
		//handleGet(0);	// begin at end of list
	}, [] );
 	
 	// create data	
	const handleSubmit = (e) => {
		e.preventDefault();
		
		// load data
		var input = dataRef.current.value;
		const ref = collection(db, "data");
		
		try {
    		var data = { text: input };
    		addDoc(ref, data);
		} catch(error) {
    		console.log(error);
		}
		// update
		loadData();
		resetForm();
		//setInFocus(users.length);
	} 

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
		let obj = { text: dataRef.current.value };
		let id = users[inFocus].id;
  		await updateDoc( doc(db, "data", id), obj );
  		loadData();
  		resetForm();
	};
	  
	const loadForm = (index) => {	// fill out form with stored data 
		let data = users[index];
		dataRef.current.value = data.text;
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
    			<input type="text" ref={dataRef} />    			
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
  					<span> {index} : {data.text} , {data.id} </span> 
  					
  					{/* Selection button */}
  					<button onClick={ () => {handleGet(index)} } className={styleGet(index)}> Select </button>
  				</div> )}
  			)}
		</div>    	
	</div>
	);
}
 
export default App;
