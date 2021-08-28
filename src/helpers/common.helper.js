/**
 * It consist of different common functions required in the app.
 * 
 */

/**
 * It would fetch the required fields from a table
 * @param {String} tableName , name of the database table
 * @param {Array} requiredFields , required fields from table 
 * @param {Object} conditions , (optional) key value pairs of condition fields and values
 * @param {String} purpose, (optional) the purpose of the query, to show the success/error message properly.
 */
const simpleSelect = (tableName, requiredFields=['*'], conditions={}, purpose = 'data') =>{

    // Create select query
    let query = "SELECT " + requiredFields.toString() + " FROM " + tableName;
    let condition_fields_arr = []; // Array of condition fields 
    let condition_values_arr = []; // Array of values of condition fields 

    if(Object.keys(conditions).length != 0){ // If there is at list one condition

        query = query + " WHERE ";

        for(let key in conditions){
            condition_fields_arr.push(key + " = ?");
            condition_values_arr.push(conditions[key]); 
        }

        query = query + condition_fields_arr.toString();
    }

    return getData(query, condition_values_arr, purpose);
};

/**
 * It would fetch the data from database
 * @param {String} query , MySql select query for retreiving the data
 * @param {Array} paramValues , Values of query params
 * @param {String} purpose, (optional) the purpose of the query, to show the success/error message properly.
 */
const getData = (query, paramValues=[], purpose = 'data') =>{

    return new Promise(function (resolve, reject) {

        db.query(query, paramValues, function (err, result) {
            if (err) {
                reject({message: (process.env.DEVELOPMENT_MODE=='TRUE')?err:"Error: Data connection/query error while fetching "+purpose, appcode: 50001});
            } else {
                if (!result.length) {
                    reject({message: "Failure: No "+purpose+" found", appcode: 50005}); //code 204 No Content
                } else {
                    resolve({data: result, appcode: 50003, message:"Success: "+purpose+" fetched!"});
                }
            }
        });
    });
};

const insertData;
const updateData;
const deleteData;

/* Note:
Provision, If only first row data needed
Batch insert
Batch update */