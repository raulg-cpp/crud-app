import './App.css';
import { useRef, useState, useEffect } from 'react';
 
import { addDoc, getDocs, collection, doc, deleteDoc, updateDoc } from "@firebase/firestore"
import { db } from "./firebase-config"
 
function App() {
	// state
	const [users, setUsers] = useState( [] );
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
	useEffect( () => loadData(), [] );
 		
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
		resetForm();
		loadData();
	} 

	// delete data
	const handleDelete = async (id) => {
		await deleteDoc( doc(db, "data", id) ); 
		loadData();
	};	 
	
	// update data
	const handleEdit = async (id) => {
		var obj = { text: dataRef.current.value };
  		await updateDoc( doc(db, "data", id), obj );
  		resetForm();
  		loadData();
	};
	  
	// Form submit handler
	const handleGet = (index) => {
		let data = users[index];
		dataRef.current.value = data.text;
	};
	
	// === JSX ===
	return (
	<div className="App">
		{/* Form */}
		<div>
			<h1>Create</h1>
    		<form onSubmit={ handleSubmit }>
    			<input type= "text" ref={dataRef} />
    			<button type = "submit">Save</button>
    		</form>
		</div>
				
		{/* Output*/}
		<div>
			{ users.map( 
				(data, index) => { return ( 
  				<div key={data.id}>
  					{/* display */}
  					<span> {index} : {data.text} , {data.id} </span> 
  					
  					{/* delete button */}
  					<button onClick={ () => { handleDelete(data.id) } }>
  						Delete 
  					</button>
  					
  					{/* update button */}
  					<button onClick={ () => { handleEdit(data.id)} }>
  						Update 
  					</button>
  					
  					{/* get button */}
  					<button onClick={ () => {handleGet(index)} } className="getButton">
  						Get
  					</button>
  				</div> )}
  			)}
		</div>    	
	</div>
	);
}
 
export default App;
