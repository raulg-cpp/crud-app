import './App.css';
import handleSubmit from './handle-submit';
import { useRef, useState, useEffect } from 'react';
 
import { getDocs, collection } from "@firebase/firestore"
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
 
  const items = users.map( 
  	data => {
  		return ( <li key={data.text}> {data.text}: {data.id} </li> );
  	}
  );
  
  return (
    <div className="App">
		{/* Form */}
    	<form onSubmit={submithandler}>
    	<input type= "text" ref={dataRef} />
    	<button type = "submit">Save</button>
    	</form>
		
		{/* Output*/}
		<ul>
			{ items }
		</ul>    	
    </div>
  );
}
 
export default App;
