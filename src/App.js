import './App.css';
import handleSubmit from './handle-submit';
import { useRef, useState, useEffect } from 'react';
 
import { getDocs, collection, doc, deleteDoc, updateDoc } from "@firebase/firestore"
import { db } from "./firebase-config"
 
function App() {
	// state
  const [users, setUsers] = useState( [] );
  const usersRef = collection( db, "data" );
  const dataRef = useRef();
 
  // send data 
  const submithandler = (e) => {
    e.preventDefault()
    handleSubmit(dataRef.current.value)
    dataRef.current.value = ""
  }
 
  // load data
  useEffect( () => {
  	const getUsers = async () => {
  		const data = await getDocs(usersRef);
  		var elem = data.docs.map( 
  			(doc) => ( { ...doc.data(), id: doc.id } )
  		);
  		setUsers( elem );
  	};
  	getUsers();
  }, [users, usersRef] );
 

	// delete data
	const handleDelete = async (id) => {
		await deleteDoc( doc(db, "data", id) ); 
	};	 
	
	// update data
	const handleEdit = async (id) => {
		var obj = { text: dataRef.current.value };
  		await updateDoc( doc(db, "data", id), obj );
	};
	 
  return (
    <div className="App">
		{/* Form */}
		<div>
			<h1>Create</h1>
    		<form onSubmit={submithandler}>
    			<input type= "text" ref={dataRef} />
    			<button type = "submit">Save</button>
    		</form>
		</div>
				
		{/* Output*/}
		<ul>
			{ users.map( 
  				data => {
  					return ( 
  					<div key={data.id}>
  						{/* display */}
  						<li> {data.text}: {data.id} </li> 
  						
  						{/* delete button */}
  						<button onClick={ () => { handleDelete(data.id) } }>
  							Delete 
  						</button>
  						
  						{/* update button */}
  						<button onClick={ () => { handleEdit(data.id) } }>
  							Update 
  						</button>
  					</div> )
  			} )}
		</ul>    	
    </div>
  );
}
 
export default App;
