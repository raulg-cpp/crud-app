// Form parameters: 

const INPUT_NAMES = ["Quantity", "Product", "Name", "Email", "Telephone"];  // Defines properties of stored objects
        
        // Regex
const INPUT_PATTERNS = ["^[0-9]+$|^0$",                             // Positive Number
                        "^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$",         // No special chars
                        "^[A-Z][a-z]+([ ][A-Z][a-z]+)*$",           // Words  
                        "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$",    // Email
                        "^[0-9]{1,3}-[0-9]{3}-[0-9]{3}-[0-9]{4}$"]; // Telephone 
 
const INPUT_PLACEHOLDER = [ "1",
                            "label", 
                            "First Last",
                            "user@host.domain", 
                            "1-100-200-3000" ];
                            
// Labels
const TEXT_LABEL = { header: "Inventory",
                     create: "Create",
                     delete: "Delete",
                     clear: "Clear", 
                     update: "Update",
                     select: "Select" };
                    
    // Popup messages for buttons
const BUTTON_TOOLTIP = { create: "Add a new record",
                         delete: "Remove the selected record",
                         clear: "Reset the form", 
                         update: "Change the selected record",
                         select: "Focus on this record" };

export { INPUT_NAMES, INPUT_PATTERNS, INPUT_PLACEHOLDER, TEXT_LABEL, BUTTON_TOOLTIP };
