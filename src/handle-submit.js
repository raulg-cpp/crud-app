import { addDoc, collection } from "@firebase/firestore"
import { db } from "./firebase-config"
 
const handleSubmit = (testdata) => {
    const ref = collection(db, "data") // Firebase creates this automatically
 
    let data = {
        testData: testdata
    }
    
    try {
        addDoc(ref, data)
    } catch(err) {
        console.log(err)
    }
}
 
export default handleSubmit
