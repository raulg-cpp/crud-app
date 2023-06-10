// Form parameters: 

const INPUT_NAMES = ["Quantity", "Product", "Name", "Email", "Telephone"];	// Defines properties of stored objects

//const INPUT_TYPES = ["number", "text", "text", "email", "tel"];		
		
		// Regex
const INPUT_PATTERNS = ["^[1-9]*$",									// Positive Number
						"^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$",							// Alfanumeric Words
					  	"^[A-Z][a-z]+([ ][A-Z][a-z]+)*$",			// Words  
					  	"[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$",	// Email
					  	"^[0-9]{1,3}-[0-9]{3}-[0-9]{3}-[0-9]{4}$"];	// Telephone 
 
const INPUT_PLACEHOLDER = [	"1",
							"label", 
							"First Last",
							"user@host.domain", 
							"1-100-200-3000" ];

//export { INPUT_NAMES, INPUT_TYPES, INPUT_PATTERNS, INPUT_PLACEHOLDER };
export { INPUT_NAMES, INPUT_PATTERNS, INPUT_PLACEHOLDER };
